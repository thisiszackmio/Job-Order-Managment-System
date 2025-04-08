<?php

namespace App\Http\Controllers;
use App\Models\VehicleSlipModel;
use App\Models\PPAEmployee;
use App\Models\VehicleTypeModel;
use App\Models\LogsModel;
use App\Models\AssignPersonnelModel;
use App\Models\NotificationModel;
use App\Http\Requests\VehicleSlipRequest;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
use Carbon\Carbon;

class VehicleSlipController extends Controller
{
    /**
     *  Legend
     *  
     * 0 - Deleted Form
     * 1 - Close Form
     * 2 - Admin Manager's Approval
     * 3 - Port Manager's Approval
     * 4 - Admin Manager's Disapproval
     * 5 - Port Manager's Disapproval
     * 6 - Admin Manager's Request
     * 7 - Port Manager's Request
     * 8 - GSO and Authority Request
     * 9 - Regular Requestor
     * 10 - Pending for Approval
     * 11 - Pending for assigning the vehicle and driver
     * 
     */

    /**
     * Show All Request on the List
    */ 
    public function index(){
        // For Inspection Form
        $getVehicleSlipData = VehicleSlipModel::orderBy('created_at', 'desc')->get();

        $VehDet = $getVehicleSlipData->map(function ($vehicleSlip) {
            $passengerArray = ($vehicleSlip->passengers && $vehicleSlip->passengers !== 'None') 
                ? explode("\n", $vehicleSlip->passengers) 
                : [];
            $passengerCount = count($passengerArray);
            return[
                'id' => $vehicleSlip->id,
                'date_request' => $vehicleSlip->created_at->format('F j, Y'),
                'purpose' => $vehicleSlip->purpose,
                'place_visited' => $vehicleSlip->place_visited,
                'date_arrival' => \Carbon\Carbon::parse($vehicleSlip->date_arrival)->format('F j, Y'),
                'time_arrival' => \Carbon\Carbon::parse($vehicleSlip->time_arrival)->format('g:i a'),
                'vehicle_type' => $vehicleSlip->vehicle_type,
                'driver' => $vehicleSlip->driver,
                'passengers' => $passengerCount,
                'admin_approval' => $vehicleSlip->admin_approval,
                'requestor' => $vehicleSlip->user_name,
            ];
        });

        return response()->json($VehDet);
    }

     /**
     *  Submit Vehicle Slip Form
     */
    public function storeVehicleSlip(Request $request){
        $now = Carbon::now();

        //Validation
        $submitVehicleInfo = $request->validate([
            'user_id' => 'required|numeric',
            'user_name' => 'required|string',
            'type_of_slip' => 'required|string',
            'purpose' => 'required|string',
            'passengers' => 'nullable|string',
            'place_visited' => 'required|string',
            'date_arrival' => 'required|date',
            'time_arrival' => 'required|date_format:H:i',
            'vehicle_type' => $request->input('user_type') == 'authorize' ? 'required|string' : 'nullable|string',
            'driver_id' => $request->input('user_type') == 'authorize' ? 'required|numeric' : 'nullable|numeric',
            'driver' => $request->input('user_type') == 'authorize' ? 'required|string' : 'nullable|string',
            'admin_approval' => 'required|numeric',
            'remarks' => 'required|string',
        ]);

        $currentDateTime = Carbon::now();

        $requestDateTime = Carbon::createFromFormat('Y-m-d H:i', $submitVehicleInfo['date_arrival'].' '.$submitVehicleInfo['time_arrival']);

        if($request->input('form') === "Check"){
            return response()->json(['message' => 'Check'], 200);
        }
        
        if ($requestDateTime < $currentDateTime) {
            return response()->json(['error' => 'invalidDate'], 422);
        } 

        // Create and save the deployment data
        $deploymentData = VehicleSlipModel::create($submitVehicleInfo);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For the Notification
        $GSORequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $AMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $PMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first();
        $AuthorityRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AU%")->first();
        $Requestor = PPAEmployee::find($deploymentData->user_id);


        if ($deploymentData->user_id == $GSORequest->id || $deploymentData->user_id == $AuthorityRequest->id) {
            if ($submitVehicleInfo['type_of_slip'] === 'within') {
                $receivers = [
                    ['id' => $AMRequest->id, 'name' => trim($AMRequest->firstname . ' ' . $AMRequest->middlename . '. ' . $AMRequest->lastname)]
                ];
                $notiMessage = 'There is a request for ' . $deploymentData->user_name . ' and needs your approval.';
                $form = 5;
            } else {
                $receivers = [
                    ['id' => $PMRequest->id, 'name' => trim($PMRequest->firstname . ' ' . $PMRequest->middlename . '. ' . $PMRequest->lastname)]
                ];
                $notiMessage = 'There is a request for ' . $deploymentData->user_name . ' and needs your approval.';
                $form = 5;
            }
        } else {
            // Send notification to both GSO and Authority
            $receivers = [
                ['id' => $GSORequest->id, 'name' => trim($GSORequest->firstname . ' ' . $GSORequest->middlename . '. ' . $GSORequest->lastname)],
                ['id' => $AuthorityRequest->id, 'name' => trim($AuthorityRequest->firstname . ' ' . $AuthorityRequest->middlename . '. ' . $AuthorityRequest->lastname)]
            ];
            $notiMessage = 'There is a request for ' . $deploymentData->user_name . '.';
            $form = 6;
        }
        
        // Loop through receivers to create separate notifications
        foreach ($receivers as $receiver) {
            $notifications[] = [
                'type_of_jlms'    => "JOMS",
                'sender_avatar'    => $Requestor->avatar,
                'sender_id'        => $Requestor->id,
                'sender_name'      => trim($Requestor->firstname . ' ' . $Requestor->middlename . '. ' . $Requestor->lastname),
                'message'          => $notiMessage,
                'receiver_id'      => $receiver['id'],       // Individual ID
                'receiver_name'    => $receiver['name'],     // Individual Name
                'joms_type'        => 'JOMS_Vehicle',
                'status'           => 2,
                'form_location'    => $form,
                'joms_id'          => $deploymentData->id,
                'created_at'       => $now,
                'updated_at'       => $now
            ];
        }        

        // Insert notifications in bulk for efficiency
        NotificationModel::insert($notifications);

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'JOMS';
        $logs->message = $deploymentData->user_name.' has submitted a request on Vehicle Slip (No. '.$deploymentData->id.').';
        $logs->save();
    }

    /**
     *  Get The Vehicle on the Form
     */
    public function getVehicleDetails(){

        // Get Vehicle Details
        $VehicleDetailRequest = VehicleTypeModel::all();

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        $vehicleData = $VehicleDetailRequest->map(function ($vehicle) {
            return [
                'vehicle_id' => $vehicle->id,
                'vehicle_name' => $vehicle->vehicle_name,
                'vehicle_plate' => $vehicle->vehicle_plate,
                'availability' => $vehicle->availability
            ];
        });

        return response()->json($vehicleData);
    }

    /**
     *  Get The Driver
     */
    public function getDriverDetails(){

        // Get Driver Details
        $DriverRequest = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->get();

        if (!$DriverRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        $driverData = $DriverRequest->map(function ($drive) {
            return [
                'driver_id' => $drive->personnel_id,
                'driver_name' => $drive->personnel_name,
                'driver_status' => $drive->status,
            ];
        });

        return response()->json($driverData);
    }

    /**
     *  Show Vehicle Slip Form
     */
    public function showForm($id){

        // Root URL
        $rootUrl = URL::to('/');

        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['error' => 'No-Form'], 500);
        }

        // Get the Admin Manager Detail
        $AdminRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $AdminName = $AdminRequest->firstname . ' ' . $AdminRequest->middlename. '. ' . $AdminRequest->lastname;
        $AdminEsig = $rootUrl . '/storage/displayesig/' . $AdminRequest->esign;

        // Get the Port Manager Detail
        $PMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first();
        $PMName = $PMRequest->firstname . ' ' . $PMRequest->middlename. '. ' . $PMRequest->lastname;
        $PMEsig = $rootUrl . '/storage/displayesig/' . $PMRequest->esign;

        // Get the Requestor Detail
        $RequestorRequest = PPAEmployee::where('id', $DataRequest->user_id)->first();
        $RequestorPosition = $RequestorRequest->position;
        $RequestorEsig = $rootUrl . '/storage/displayesig/' . $RequestorRequest->esign;

        // Get the Driver's Detail
        $DriverAssign = PPAEmployee::where('id', $DataRequest->driver_id)->first();
        $DriverEsig = !empty($DriverAssign->esign) 
        ? $rootUrl . '/storage/displayesig/' . $DriverAssign->esign 
        : null;

        $respondData = [
            'form' => $DataRequest,
            'pmName' => $PMName,
            'pmEsig' => $PMEsig,
            'adminName' => $AdminName,
            'adminEsig' => $AdminEsig,
            'requestorPosition' => $RequestorPosition, 
            'requestorEsig' => $RequestorEsig,     
            'driverEsig' => $DriverEsig,
        ];

        return response()->json($respondData);
    }

    /**
     *  Update Vehicle Information
     */
    public function UpdateVehicleSlip(Request $request, $id){
        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($DataRequest->admin_approval === 9 || $DataRequest->admin_approval === 4 || $DataRequest->admin_approval === 3 || $DataRequest->admin_approval === 2 || $DataRequest->admin_approval === 1) {
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            $updateVehicleSlip = $DataRequest->update([
                'purpose' => $request->input('purpose'),
                'passengers' => $request->input('passengers'),
                'place_visited' => $request->input('place_visited'),
                'date_arrival' => $request->input('date_arrival'),
                'time_arrival' => $request->input('time_arrival'),
                'vehicle_type' => $request->input('vehicle_type'),
                'driver_id' => $request->input('driver_id'),
                'driver' => $request->input('driver'),
            ]);

            if($updateVehicleSlip){

                // Logs
                $logs = new LogsModel();
                $logs->category = 'JOMS';
                $logs->message = $request->input('logs');
                $logs->save();

                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['message' => 'There area some missing.'], 204);
            }

        }
    }

    /**
     *  Store Vehicle Information
     */
    public function storeVehicleInformation(Request $request, $id){
        $now = Carbon::now();

        //Validation
        $vehicleInfo = $request->validate([
            'vehicle_type' => 'required|string',
            'driver_id' => 'required|numeric',
            'driver' => 'required|string'
        ]);

        $DataRequest = VehicleSlipModel::find($id);

        $Approval = $DataRequest->admin_approval;
        $TypeofTravel = $DataRequest->type_of_slip;

        if (!$DataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Check if already assign
        if($DataRequest->vehicle_type && $DataRequest->driver){
            return response()->json(['error' => 'Already'], 409);
        }else{

            // Get Admin Manager and Port Manager
            $checkAMQuery = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first(); 
            $checkPMQuery = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first(); 

            // Get inform of the assign person
            $getAssign = PPAEmployee::find($request->input('assign'));
            $assignName = trim($getAssign->firstname . ' ' . $getAssign->middlename . '. ' . $getAssign->lastname);

            // for the Remarks Content
            if($TypeofTravel === 'within'){
                if(in_array($Approval, [5, 6])) {
                    $remark = $assignName. " has assigned a vehicle and a driver for you.";
                }else {
                    $remark = $assignName. " has assigned a vehicle and driver and waiting for Admin Manager's approval.";
                }
            }else{
                if($Approval == 5 ) {
                    $remark = "Waiting for the Port Manager's approval";
                } else if($Approval == 6) {
                    $remark = $assignName. " has assigned a vehicle and a driver for you.";
                }
                else {
                    $remark = $assignName. " has assigned a vehicle and driver and waiting for Port Manager's approval.";
                }
            }

            // For the Approval
            if($TypeofTravel === 'within'){
                if($Approval == 5) { $approve = 1; }
                else if($Approval == 6){ $approve = 2; } 
                else { $approve = 10; }
            } else {
                if($Approval == 5) { $approve = 11; }
                else if($Approval == 6){ $approve = 2; }
                else { $approve = 10; }
            }

            // Update Data
            $getVehDet = $DataRequest->update([
                'vehicle_type' => $vehicleInfo['vehicle_type'],
                'driver_id' => $vehicleInfo['driver_id'], 
                'driver' => $vehicleInfo['driver'],
                'remarks' => $remark,
                'admin_approval' => $approve,
            ]);

            if($getVehDet){
                // For notification
                if($TypeofTravel == 'within'){
                    $receiverId = $checkAMQuery->id;
                    $receiverName = trim($checkAMQuery->firstname . ' ' . $checkAMQuery->middlename . '. ' . $checkAMQuery->lastname);
                    $notiMessage = "There is a request for ".$DataRequest->user_name." that needs your approval.";
                }else{
                    $receiverId = $checkPMQuery->id;
                    $receiverName = trim($checkPMQuery->firstname . ' ' . $checkPMQuery->middlename . '. ' . $checkPMQuery->lastname);
                    $notiMessage = "There is a request for ".$DataRequest->user_name." that needs your approval.";
                }

                $notifications[] = [
                    'type_of_jlms'    => "JOMS",
                    'sender_avatar'    => $getAssign->avatar,
                    'sender_id'        => $getAssign->id,
                    'sender_name'      => $assignName,
                    'message'          => $notiMessage,
                    'receiver_id'      => $receiverId,       
                    'receiver_name'    => $receiverName,    
                    'joms_type'        => 'JOMS_Vehicle',
                    'status'           => 2,
                    'form_location'    => 7,
                    'joms_id'          => $DataRequest->id,
                    'created_at'       => $now,
                    'updated_at'       => $now
                ];

                // Insert notifications in bulk for efficiency
                NotificationModel::insert($notifications);

                // Update Notification (Para ma wala sa notifacion list)
                NotificationModel::where('joms_type', 'JOMS_Vehicle')
                ->where('joms_id', $DataRequest->id)
                ->where('form_location', 6)
                ->update(['status' => 0]);

                // Logs
                $logs = new LogsModel();
                $logs->category = 'JOMS';
                $logs->message = $assignName." has assigned the driver and vehicle (Vehicle Slip No.".$DataRequest->id.").";
                $logs->save();
            }

        }
    }

    /**
     *  Admin Manager and Port Manager Approval
     */
    public function approveRequest(Request $request, $id){
        $now = Carbon::now();

        $vehRequest = VehicleSlipModel::find($id);

        // Get the Approver Details
        $approverDet = PPAEmployee::find($request->input('approver'));
        $approverAvatar = $approverDet->avatar;
        $approverName = trim($approverDet->firstname . ' ' . $approverDet->middlename . '. ' . $approverDet->lastname);

        if (!$vehRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // -- Receivers -- //

        // GSO
        $GsoDet = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $GsoId = $GsoDet->id;
        $GsoName = trim($GsoDet->firstname . ' ' . $GsoDet->middlename . '. ' . $GsoDet->lastname);

        // Requestor
        $ReqId = $vehRequest->user_id;
        $ReqName = $vehRequest->user_name;

        
        // For Remarks
        $typeOfSlip = $vehRequest->type_of_slip;

        if($typeOfSlip === 'within'){
            $remark = "Approved by the Admin Manager.";
            $approver = 1;
            $form = 1;
            $receivers = [
                ['id' => $GsoId, 
                 'name' => $GsoName,
                 'noti' => 'The request for '.$vehRequest->user_name.' has been approved by the Admin Manager.'
                ],
                ['id' => $ReqId, 
                 'name' => $vehRequest->user_name,
                 'noti' => 'Your request has been approved by the Admin Manager.'
                ]
            ];
        }else{
            $remark = "Approved by the Port Manager.";
            $approver = 2;
            $form = 2;
            $receivers = [
                ['id' => $GsoId, 
                 'name' => $GsoName,
                 'noti' => 'The request for '.$vehRequest->user_name.' has been approved by the Port Manager.'
                ],
                ['id' => $ReqId, 
                 'name' => $vehRequest->user_name,
                 'noti' => 'Your request has been approved by the Port Manager.'
                ]
            ];
        }

        // Update Table
        $vehRequest->admin_approval = $approver;
        $vehRequest->remarks = $remark;

        if($vehRequest->save()){
            // For the Vechicle
            $VehTypeDet = VehicleTypeModel::where('vehicle_name', $request->input('vehicleName'))
                        ->where('vehicle_plate', $request->input('vehiclePlate'))
                        ->first();
            $VehTypeDet->availability = 1;

            //For the Personnel
            $AssignDet = AssignPersonnelModel::where('personnel_id', $vehRequest->driver_id)->first();
            $AssignDet->status = 1;


            if($VehTypeDet->save() && $AssignDet->save()){
                // Send Notification to the requestor
                // Loop through receivers to create separate notifications
                foreach ($receivers as $receiver) {
                    $notifications[] = [
                        'type_of_jlms'    => "JOMS",
                        'sender_avatar'    => $approverAvatar,
                        'sender_id'        => $approverDet->id,
                        'sender_name'      => $approverName,
                        'message'          => $receiver['noti'],
                        'receiver_id'      => $receiver['id'],
                        'receiver_name'    => $receiver['name'],
                        'joms_type'        => 'JOMS_Vehicle',
                        'status'           => 2,
                        'form_location'    => $form,
                        'joms_id'          => $vehRequest->id,
                        'created_at'       => $now,
                        'updated_at'       => $now
                    ];
                }  

                // Insert notifications in bulk for efficiency
                NotificationModel::insert($notifications);

                // Update Notification (Para ma wala sa notifacion list)
                NotificationModel::where('joms_type', 'JOMS_Vehicle')
                ->where('joms_id', $vehRequest->id)
                ->where('form_location', 7)
                ->update(['status' => 0]);

                // For LOGS
                $logs = new LogsModel();
                $logs->category = 'JOMS';
                $logs->message = $approverName.' has approved the request on Vehicle Slip (No. '.$vehRequest->id.').';
                $logs->save();

                return response()->json(['message' => 'The Form has been approved'], 200);
            }
        }
    }

    /**
     *  Admin Manager and Port Manager Decline and Reason
     */
    public function submitAdminDeclineRequest(Request $request, $id){
        // Get Data
        $RequestData = VehicleSlipModel::find($id);

        if (!$RequestData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        $approver = '';

        if($RequestData->type_of_slip === 'within'){
            $approver = 3;
        } else {
            $approver = 4;
        }

        // Update
        $RequestData->admin_approval = $approver;
        $RequestData->remarks = $request->input('remarks');

        // Send to the GSO
        $checkQueryGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

        if($RequestData->save()){

            if($RequestData->user_id == $checkQueryGSO->id){
                // Send back to GSO
                $notiGSO = new NotificationModel();
                $notiGSO->type_of_jlms = "JOMS";
                $notiGSO->sender_avatar = $request->input('avatar');
                $notiGSO->sender_id = $request->input('sender_id');
                $notiGSO->sender_name = $request->input('sender_name');
                $notiGSO->message = $request->input('notif_message');
                $notiGSO->receiver_id = $request->input('receiver_id');
                $notiGSO->receiver_name = $request->input('receiver_name');
                $notiGSO->joms_type = 'JOMS_Vehicle';
                $notiGSO->status = 2;
                $notiGSO->joms_id = $RequestData->id;
                $notiGSO->save();
            } else {
                // Send to the Requestor
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = $request->input('notif_message');
                $noti->receiver_id = $request->input('receiver_id');
                $noti->receiver_name = $request->input('receiver_name');
                $noti->joms_type = 'JOMS_Vehicle';
                $noti->status = 2;
                $noti->joms_id = $RequestData->id;
                $noti->save();

                // Send to the GSO
                $notiGSO = new NotificationModel();
                $notiGSO->type_of_jlms = "JOMS";
                $notiGSO->sender_avatar = $request->input('avatar');
                $notiGSO->sender_id = $request->input('sender_id');
                $notiGSO->sender_name = $request->input('sender_name');
                $notiGSO->message = 'The request for '.$RequestData->user_name.' has been disapproved by '.$request->input('sender_name').'. Please see the reason.';
                $notiGSO->receiver_id = $checkQueryGSO->id;
                $notiGSO->receiver_name = $checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename. '. ' . $checkQueryGSO->lastname;
                $notiGSO->joms_type = 'JOMS_Vehicle';
                $notiGSO->status = 2;
                $notiGSO->joms_id = $RequestData->id;
                $notiGSO->save();
            }

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

            return response()->json(['message' => 'Request Update Successfully'], 200);
        } else {
            return response()->json(['message' => 'There something wrong'], 500);
        }
    }

    /**
     *  Delete the Form (Only the GSO has a authority )
     */
    public function forceCloseRequest(Request $request, $id){

        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['message' => 'Data Error'], 404);
        }

        if($DataRequest->admin_approval === 1 || $DataRequest->admin_approval === 2 || $DataRequest->admin_approval === 9){
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            // Update Approve
            $DataRequest->admin_approval = 9;
            $DataRequest->remarks = $request->input('remarks');

            if($DataRequest->save()){

                $Noti = NotificationModel::where('joms_id', $DataRequest->id)->where('joms_type', 'JOMS_Vehicle')->get();

                // Loop through each notification and update status
                foreach ($Noti as $notification) {
                    $notification->status = 0;

                    if ($notification->save()) {
                        // For LOGS
                        $logs = new LogsModel();
                        $logs->category = 'JOMS';
                        $logs->message = $request->input('logs');
                        $logs->save();
                    }
                }                

                return response()->json(['message' => 'The Form has been forcefully closed'], 200);
            }

        }
    }  

    // ---------- Vehicle Type --------- //

    /**
     *  Show Vehicle Details
     */
    public function showVehicleDetails(){

        // Get Vehicle Details
        $VehicleDetailRequest = VehicleTypeModel::all();

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Modify data functions on vehicle usage and details
        $vehicleData = $VehicleDetailRequest->map(function ($vehicle) {
            $vehicleName = $vehicle->vehicle_name. ' ('. $vehicle->vehicle_plate .')';
            $slipCount = VehicleSlipModel::where('vehicle_type', $vehicleName)->count();
            return [
                'vehicle_id' => $vehicle->id,
                'vehicle_name' => $vehicle->vehicle_name,
                'vehicle_plate' => $vehicle->vehicle_plate,
                'vehicle_status' => $vehicle->availability,
                'vehicle_usage' => $slipCount
            ];
        });

        return response()->json($vehicleData);

    }

    /**
     *  Store Vehicle Details
     */
    public function storeVehicleDetails(Request $request){
        // Validate
        $vehicleValidate = $request->validate([
            'vehicle_name' => 'required|string',
            'vehicle_plate' => 'required|string',
            'availability' => 'required|numeric'
        ]);

        // Create and save the deployment data
        $deploymentData = VehicleTypeModel::create($vehicleValidate);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'Vehicle';
        $logs->message = $request->input('authority').' just added the vehicle details.';
        $logs->save();

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     *  Delete Vehicle Details
     */
    public function removeVehicleDetails(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'Vehicle';
        $logs->message = $request->input('authority').' just removed the vehicle ('.$VehicleDetailRequest->vehicle_name.'-'.$VehicleDetailRequest->vehicle_plate.') on the list.';
        $logs->save();

        // Delete the vehicle
        if($VehicleDetailRequest->delete()){
            return response()->json(['message' => 'Vehicle deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete vehicle'], 500);
        }

    }

    /**
     *  Available Vehicle Details
     */
    public function availableVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update the status
        $VehicleDetailRequest->availability = 0;

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'Vehicle';
            $logs->message = $request->input('authority').' has set a vehicle ('.$VehicleDetailRequest->vehicle_name.'-'.$VehicleDetailRequest->vehicle_plate.') to available.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

    /**
     *  Update Vehicle Details
     */
    public function editVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update the status
        $VehicleDetailRequest->vehicle_name = $request->input('vehicle_name');
        $VehicleDetailRequest->vehicle_plate = $request->input('vehicle_plate');

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'Vehicle';
            $logs->message = $request->input('authority').' has updated the vehicle.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

}
