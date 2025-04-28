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
     *  Legend for Status and Notifications
     *  0 - Form Cancel
     *  1 - Form Approved
     *  2 - Form Disapproved
     *  3 - Admin Manager's Pending Approval
     *  4 - Port Manager's Pending Approval
     *  5 - Admin Manager's Sent Request
     *  6 - Port Manager's Sent Request
     *  7 - GSO and Authority Sent Request
     *  8 - Regular Sent Request
     * 
     *  For the Notifications
     *  0 - CLosed
     *  1 - Approval/Disapproval
     *  2 - Assign Vehicle and Driver
     *  3 - Send Request
     * 
     */

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
        $deploymentVehicleData = VehicleSlipModel::create($submitVehicleInfo);

        if (!$deploymentVehicleData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For the Notification
        $GSORequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $AMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $PMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first();
        $AuthorityRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AU%")->first();
        $Requestor = PPAEmployee::find($deploymentVehicleData->user_id);


        if ($deploymentVehicleData->user_id == $GSORequest->id || $deploymentVehicleData->user_id == $AuthorityRequest->id) {
            if ($submitVehicleInfo['type_of_slip'] === 'within') {
                // Send to the Admin Manager
                $receivers = [
                    ['id' => $AMRequest->id, 'name' => trim($AMRequest->firstname . ' ' . $AMRequest->middlename . '. ' . $AMRequest->lastname)]
                ];
                $notiMessage = 'There is a request for ' . $deploymentVehicleData->user_name . ' and needs your approval.';
                $form = 2;
            } else {
                // Send to the Port Manager
                $receivers = [
                    ['id' => $PMRequest->id, 'name' => trim($PMRequest->firstname . ' ' . $PMRequest->middlename . '. ' . $PMRequest->lastname)]
                ];
                $notiMessage = 'There is a request for ' . $deploymentVehicleData->user_name . ' and needs your approval.';
                $form = 2;
            }
        } else {
            // Send to both GSO and Authority
            $receivers = [
                ['id' => $GSORequest->id, 'name' => trim($GSORequest->firstname . ' ' . $GSORequest->middlename . '. ' . $GSORequest->lastname)],
                ['id' => $AuthorityRequest->id, 'name' => trim($AuthorityRequest->firstname . ' ' . $AuthorityRequest->middlename . '. ' . $AuthorityRequest->lastname)]
            ];
            $notiMessage = 'There is a request for ' . $deploymentVehicleData->user_name . '.';
            $form = 3;
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
                'joms_id'          => $deploymentVehicleData->id,
                'created_at'       => $now,
                'updated_at'       => $now
            ];
        }        

        // Insert notifications in bulk for efficiency
        NotificationModel::insert($notifications);

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'Vehicle Slip';
        $logs->message = $deploymentVehicleData->user_name.' has submitted a Vehicle Slip request.';
        $logs->save();
    }

    /**
     *  Update Vehicle Slip Details
     */
    public function UpdateVehicleSlip(Request $request, $id){
        $now = Carbon::now();

        //Validation
        $updateVehicleInfo = $request->validate([
            'purpose' => 'required|string',
            'passengers' => 'required|string',
            'place_visited' => 'required|string',
            'date_arrival' => 'required|date',
            'time_arrival' => 'required|date_format:H:i:s',
            'vehicle_type' => 'nullable|string',
            'driver_id' => 'nullable|numeric',
            'driver' => 'nullable|string',
        ]);

        $VehicleSlipData = VehicleSlipModel::find($id);

        if (!$VehicleSlipData) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($VehicleSlipData->admin_approval === 0 || $VehicleSlipData->admin_approval === 1 || $VehicleSlipData->admin_approval === 2) {
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            $updateVehicleSlip = $VehicleSlipData->update([
                'purpose' => $updateVehicleInfo['purpose'],
                'passengers' => $updateVehicleInfo['passengers'],
                'place_visited' => $updateVehicleInfo['place_visited'],
                'date_arrival' => $updateVehicleInfo['date_arrival'],
                'time_arrival' => $updateVehicleInfo['time_arrival'],
                'vehicle_type' => $updateVehicleInfo['vehicle_type'],
                'driver_id' => $updateVehicleInfo['driver_id'],
                'driver' => $updateVehicleInfo['driver'],
            ]);

            if($updateVehicleSlip){

                // Logs
                $logs = new LogsModel();
                $logs->category = 'Vehicle Slip';
                $logs->message = $request->input('authority')." has updated ".$VehicleSlipData->user_name."'s request on Vehicle Slip No.".$VehicleSlipData->id.".";
                $logs->save();

                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['message' => 'There area some missing.'], 204);
            }

        }
    }

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
                'remarks' => $vehicleSlip->remarks,
            ];
        });

        return response()->json($VehDet);
    }

    /**
     *  Show Vehicle Slip Form
     */
    public function showForm($id){

        // Root URL
        $rootUrl = URL::to('/');

        $VehicleSlipForm = VehicleSlipModel::find($id);

        if (!$VehicleSlipForm) {
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
        $RequestorRequest = PPAEmployee::where('id', $VehicleSlipForm->user_id)->first();
        $RequestorPosition = $RequestorRequest->position;
        $RequestorEsig = $rootUrl . '/storage/displayesig/' . $RequestorRequest->esign;

        // Get the Driver's Detail
        $DriverAssign = PPAEmployee::where('id', $VehicleSlipForm->driver_id)->first();
        $DriverEsig = !empty($DriverAssign->esign) 
        ? $rootUrl . '/storage/displayesig/' . $DriverAssign->esign 
        : null;

        // Get The Vehicle and Driver availability
        $DriverDet = AssignPersonnelModel::where('personnel_id', $VehicleSlipForm->driver_id)->where('form_id', $VehicleSlipForm->id)->first();
        $DriverStat = $DriverDet 
        ? ($DriverDet->status == 1 ? 1 : null) 
        : null;

        $VehicleDet = VehicleTypeModel::where('form_id', $VehicleSlipForm->id)->where('availability', 1)->first();
        $VehicleStat = $VehicleDet
        ? ($VehicleDet->availability == 1 ? 1 : null)
        : null;


        $respondData = [
            'form' => $VehicleSlipForm,
            'pmName' => $PMName,
            'pmEsig' => $PMEsig,
            'adminName' => $AdminName,
            'adminEsig' => $AdminEsig,
            'requestorPosition' => $RequestorPosition, 
            'requestorEsig' => $RequestorEsig,     
            'driverEsig' => $DriverEsig,
            'driverAvail' => $DriverStat,
            'vehicleDet' => $VehicleStat
        ];

        return response()->json($respondData);
    }

    /**
     *  Store Vehicle Slip and Driver Information
     */
    public function storeVehicleInformation(Request $request, $id){
        $now = Carbon::now();

        //Validation
        $vehicleInfo = $request->validate([
            'vehicle_type' => 'required|string',
            'driver_id' => 'required|numeric',
            'driver' => 'required|string'
        ]);

        $VehicleDataRequest = VehicleSlipModel::find($id);

        $Approval = $VehicleDataRequest->admin_approval;
        $TypeofTravel = $VehicleDataRequest->type_of_slip;

        if (!$VehicleDataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Check if already assign
        if($VehicleDataRequest->vehicle_type && $VehicleDataRequest->driver){
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
                if(in_array($Approval, [5, 6])){
                    // If both Port and Admin Manager send a request
                    $remark = $assignName. " has assigned both a vehicle and a driver.";
                    $approve = 1;
                    $form = 1;
                }else{
                    // If Regular Requestor send a request
                    $remark = $assignName. " has assigned a vehicle and driver, and is waiting for the Admin Manager's approval.";
                    $approve = 3;
                    $form = 2;
                }
            }else{
                if($Approval == 6) {
                    // If Port Manager send a request
                    $remark = $assignName. " has assigned both a vehicle and a driver.";
                    $approve = 1;
                    $form = 1;
                }else{
                    $remark = $assignName. " has assigned a vehicle and driver, and is waiting for the Port Manager's approval.";
                    $approve = 4;
                    $form = 2;
                }
            }

            // Update first for the Assign Vehicle and Driver
            if($TypeofTravel == 'within'){
                if(in_array($Approval, [5, 6])){
                    // Assign Vehicle and Driver
                    // For the Vechicle
                    $VehTypeDet = VehicleTypeModel::where('vehicle_name', $request->input('vehicleName'))
                    ->where('vehicle_plate', $request->input('vehiclePlate'))
                    ->first();
                    $VehTypeDet->availability = 1;
                    $VehTypeDet->form_id = $VehicleDataRequest->id;
                    $VehTypeDet->save();
    
                    //For the Personnel
                    $AssignDet = AssignPersonnelModel::where('personnel_id', $vehicleInfo['driver_id'])->first();
                    $AssignDet->status = 1;
                    $AssignDet->form_id = $VehicleDataRequest->id;
                    $AssignDet->save();
                }
            }else{
                if($Approval == 6){
                    // Assign Vehicle and Driver
                    // For the Vechicle
                    $VehTypeDet = VehicleTypeModel::where('vehicle_name', $request->input('vehicleName'))
                    ->where('vehicle_plate', $request->input('vehiclePlate'))
                    ->first();
                    $VehTypeDet->availability = 1;
                    $VehTypeDet->form_id = $VehicleDataRequest->id;
                    $VehTypeDet->save();
    
                    //For the Personnel
                    $AssignDet = AssignPersonnelModel::where('personnel_id', $vehicleInfo['driver_id'])->first();
                    $AssignDet->status = 1;
                    $AssignDet->form_id = $VehicleDataRequest->id;
                    $AssignDet->save();
                }
            }
            

            // Update Data
            $getVehDet = $VehicleDataRequest->update([
                'vehicle_type' => $vehicleInfo['vehicle_type'],
                'driver_id' => $vehicleInfo['driver_id'], 
                'driver' => $vehicleInfo['driver'],
                'remarks' => $remark,
                'admin_approval' => $approve,
            ]);

            if($getVehDet){

                // For notification
                if($TypeofTravel == 'within'){
                    if(in_array($Approval, [5, 6])){
                        if($VehicleDataRequest->user_id == $checkAMQuery->id){
                            $receiverId = $checkAMQuery->id;
                            $receiverName = trim($checkAMQuery->firstname . ' ' . $checkAMQuery->middlename . '. ' . $checkAMQuery->lastname);
                            $notiMessage = $assignName."  has a assign driver and vehicle for you.";
                        }else{
                            $receiverId = $checkPMQuery->id;
                            $receiverName = trim($checkPMQuery->firstname . ' ' . $checkPMQuery->middlename . '. ' . $checkPMQuery->lastname);
                            $notiMessage = $assignName."  has a assign driver and vehicle for you.";
                        }
                    }else{
                        $receiverId = $checkAMQuery->id;
                        $receiverName = trim($checkAMQuery->firstname . ' ' . $checkAMQuery->middlename . '. ' . $checkAMQuery->lastname);
                        $notiMessage = "There is a request for ".$VehicleDataRequest->user_name." that needs your approval.";
                    }
                }else{
                    if($Approval == 6) {
                        $receiverId = $checkPMQuery->id;
                        $receiverName = trim($checkPMQuery->firstname . ' ' . $checkPMQuery->middlename . '. ' . $checkPMQuery->lastname);
                        $notiMessage = $assignName."  has a assign driver and vehicle for you.";
                    }else{
                        $receiverId = $checkPMQuery->id;
                        $receiverName = trim($checkPMQuery->firstname . ' ' . $checkPMQuery->middlename . '. ' . $checkPMQuery->lastname);
                        $notiMessage = "There is a request for ".$VehicleDataRequest->user_name." that needs your approval.";
                    }
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
                    'form_location'    => $form,
                    'joms_id'          => $VehicleDataRequest->id,
                    'created_at'       => $now,
                    'updated_at'       => $now
                ];

                // Insert notifications in bulk for efficiency
                NotificationModel::insert($notifications);

                // Update Notification (Para ma wala sa notifacion list)
                NotificationModel::where('joms_type', 'JOMS_Vehicle')
                ->where('joms_id', $VehicleDataRequest->id)
                ->where('form_location', 3)
                ->update(['status' => 0]);

                // Logs
                $logs = new LogsModel();
                $logs->category = 'Vehicle Slip';
                $logs->message = $assignName." has assigned a driver and vehicle to ".$VehicleDataRequest->user_name."'s request on Vehicle Slip No.".$VehicleDataRequest->id.".";
                $logs->save();
            }

        }
    }

    /**
     *  Admin Manager and Port Manager Approval
     */
    public function approveRequest(Request $request, $id){
        $now = Carbon::now();

        $VehicleDataRequest = VehicleSlipModel::find($id);

        // Get the Approver Details
        $approverDet = PPAEmployee::find($request->input('approver'));
        $approverAvatar = $approverDet->avatar;
        $approverName = trim($approverDet->firstname . ' ' . $approverDet->middlename . '. ' . $approverDet->lastname);

        if (!$VehicleDataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // -- Receivers -- //

        // GSO
        $GsoDet = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $GsoId = $GsoDet->id;
        $GsoName = trim($GsoDet->firstname . ' ' . $GsoDet->middlename . '. ' . $GsoDet->lastname);

        // Requestor
        $ReqId = $VehicleDataRequest->user_id;
        $ReqName = $VehicleDataRequest->user_name;

        
        // For Remarks
        $typeOfSlip = $VehicleDataRequest->type_of_slip;

        if($typeOfSlip === 'within'){
            $remark = "Approved by the Admin Manager.";
            $approver = 1;
            $form = 1;
            $receivers = [
                ['id' => $GsoId, 
                 'name' => $GsoName,
                 'noti' => 'The request for '.$VehicleDataRequest->user_name.' has been approved by the Admin Manager.'
                ],
                ['id' => $ReqId, 
                 'name' => $VehicleDataRequest->user_name,
                 'noti' => 'Your request has been approved by the Admin Manager.'
                ]
            ];
        }else{
            $remark = "Approved by the Port Manager.";
            $approver = 1;
            $form = 1;
            if($ReqId == $GsoId){
                $receivers = [
                    ['id' => $ReqId, 
                     'name' => $VehicleDataRequest->user_name,
                     'noti' => 'Your request has been approved by the Port Manager.'
                    ]
                ];
            }else{
                $receivers = [
                    ['id' => $GsoId, 
                     'name' => $GsoName,
                     'noti' => 'The request for '.$VehicleDataRequest->user_name.' has been approved by the Port Manager.'
                    ],
                    ['id' => $ReqId, 
                     'name' => $VehicleDataRequest->user_name,
                     'noti' => 'Your request has been approved by the Port Manager.'
                    ]
                ];
            }
        }

        // Update Table
        $VehicleDataRequest->admin_approval = $approver;
        $VehicleDataRequest->remarks = $remark;

        if($VehicleDataRequest->save()){
            // For the Vechicle
            $VehTypeDet = VehicleTypeModel::where('vehicle_name', $request->input('vehicleName'))
                        ->where('vehicle_plate', $request->input('vehiclePlate'))
                        ->first();
            $VehTypeDet->availability = 1;
            $VehTypeDet->form_id = $VehicleDataRequest->id;

            //For the Personnel
            $AssignDet = AssignPersonnelModel::where('personnel_id', $VehicleDataRequest->driver_id)->first();
            $AssignDet->status = 1;
            $AssignDet->form_id = $VehicleDataRequest->id;


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
                        'joms_id'          => $VehicleDataRequest->id,
                        'created_at'       => $now,
                        'updated_at'       => $now
                    ];
                }  

                // Insert notifications in bulk for efficiency
                NotificationModel::insert($notifications);

                // Update Notification (Para ma wala sa notifacion list)
                NotificationModel::where('joms_type', 'JOMS_Vehicle')
                ->where('joms_id', $VehicleDataRequest->id)
                ->where('form_location', 2)
                ->update(['status' => 0]);

                // For LOGS
                $logs = new LogsModel();
                $logs->category = 'Vehicle Slip';
                $logs->message = $approverName." has approved ".$VehicleDataRequest->user_name."'s request on Vehicle Slip No.".$VehicleDataRequest->id.".";
                $logs->save();

                return response()->json(['message' => 'The Form has been approved'], 200);
            }
        }
    }

    /**
     *  Admin Manager and Port Manager Decline and Reason
     */
    public function submitAdminDeclineRequest(Request $request, $id){
        $now = Carbon::now();

        // Get Data
        $VehicleDataRequest = VehicleSlipModel::find($id);

        if (!$VehicleDataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Approver
        $approver = PPAEmployee::find($request->input('approver'));

        // Identify which Manager to disapprove the request
        if($VehicleDataRequest->type_of_slip === 'within'){
            $remark = "Disapproved by the Admin Manager (Reason: ".$request->input('reason').")";
        } else {
            $remark = "Disapproved by the Port Manager (Reason: ".$request->input('reason').")";
        }

        // Update
        $VehicleDataRequest->admin_approval = 2;
        $VehicleDataRequest->remarks = $remark;

        if($VehicleDataRequest->save()){

            $slipType = $VehicleDataRequest->type_of_slip;

            // Send notificataion
            $GSORequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
            $AuthorityRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AU%")->first();

            if($VehicleDataRequest->user_id == $GSORequest->id || $VehicleDataRequest->user_id == $AuthorityRequest->id){
                $receivers = [
                    [ 
                        'id' => $VehicleDataRequest->user_id == $GSORequest->id 
                        ? $GSORequest->id : $AuthorityRequest->id, 
                        'name' => $VehicleDataRequest->user_id == $GSORequest->id 
                        ? trim($GSORequest->firstname . ' ' . $GSORequest->middlename . '. ' . $GSORequest->lastname) : trim($AuthorityRequest->firstname . ' ' . $AuthorityRequest->middlename . '. ' . $AuthorityRequest->lastname),
                        'message' => $slipType === 'within'
                        ? 'Your request has been disapproved by Admin Manager.' : 'Your request has been disapproved by Port Manager.'
                    ]
                ];
            } else{
                if($VehicleDataRequest->user_id == $GSORequest->id){
                    $receivers = [
                        [ 
                            'id' => $VehicleDataRequest->user_id, 
                            'name' => $VehicleDataRequest->user_name,
                            'message' =>  $slipType === 'within'
                            ? 'Your request has been disapproved by Admin Manager.' : 'Your request has been disapproved by Port Manager.'
                        ]
                        ];
                }else{
                    // Send both Requestor and the GSO
                    $receivers = [
                        [ 
                            'id' => $VehicleDataRequest->user_id, 
                            'name' => $VehicleDataRequest->user_name,
                            'message' =>  $slipType === 'within'
                            ? 'Your request has been disapproved by Admin Manager.' : 'Your request has been disapproved by Port Manager.'
                        ],
                        [
                            'id' => $GSORequest->id,
                            'name' => trim($GSORequest->firstname . ' ' . $GSORequest->middlename . '. ' . $GSORequest->lastname),
                            'message' =>  $slipType === 'within'
                            ? "The request for ".$VehicleDataRequest->user_name." was disapproved by the Admin Manager." : "The request for ".$VehicleDataRequest->user_name." was disapproved by the Port Manager."
                        ]
                    ];
                }
            }

            // Loop through receivers to create separate notifications
            foreach ($receivers as $receiver) {
                $notifications[] = [
                    'type_of_jlms'    => "JOMS",
                    'sender_avatar'    => $approver->avatar,
                    'sender_id'        => $approver->id,
                    'sender_name'      => trim($approver->firstname . ' ' . $approver->middlename . '. ' . $approver->lastname),
                    'message'          => $receiver['message'],
                    'receiver_id'      => $receiver['id'],       
                    'receiver_name'    => $receiver['name'],     
                    'joms_type'        => 'JOMS_Vehicle',
                    'status'           => 2,
                    'form_location'    => 1,
                    'joms_id'          => $VehicleDataRequest->id,
                    'created_at'       => $now,
                    'updated_at'       => $now
                ];
            }  

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Vehicle')
            ->where('joms_id', $VehicleDataRequest->id)
            ->where('form_location', 3)
            ->update(['status' => 0]);

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'Vehicle Slip';
            $logs->message = $request->input('authority')." has dispprove ".$VehicleDataRequest->user_name."'s request on Vehicle Slip No.".$VehicleDataRequest->id.".";
            $logs->save();
        }

    }

    /**
     *  Cancel the Form (Only the GSO has a authority )
     */
    public function cancelFormRequest(Request $request, $id){
        $VehicleDataRequest = VehicleSlipModel::find($id);

        if (!$VehicleDataRequest) {
            return response()->json(['message' => 'Data Error'], 404);
        }

        if($VehicleDataRequest->admin_approval === 0 || $VehicleDataRequest->admin_approval === 1 || $VehicleDataRequest->admin_approval === 2){
            return response()->json(['message' => 'Request is already close'], 409);
        } else {
            // Update Approve
            $VehicleDataRequest->admin_approval = 0;
            $VehicleDataRequest->remarks = $request->input('authority')." has canceled this form.";

            if($VehicleDataRequest->save()){

                $Noti = NotificationModel::where('joms_id', $VehicleDataRequest->id)->where('joms_type', 'JOMS_Vehicle')->get();

                // Loop through each notification and update status
                foreach ($Noti as $notification) {
                    $notification->status = 0;
                    $notification->save();
                }

                // Save a single log entry after all notifications are updated
                $logs = new LogsModel();
                $logs->category = 'Vehicle Slip';
                $logs->message = $request->input('authority') . " has canceled " . $VehicleDataRequest->user_name . "'s request on Vehicle Slip No." . $VehicleDataRequest->id . ".";
                $logs->save();              

                return response()->json(['message' => 'The Form has been canceled'], 200);
            }
        }
    }

    // ---------- Vehicle Type --------- //

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
        $logs->category = 'Vehicle Type';
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
        $logs->category = 'Vehicle Type';
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
     *  Available Vehicle and Driver
     */
    public function availableVehicleDriver(Request $request, $id){
        $DriverDet = AssignPersonnelModel::where('form_id', $id)->first();
        $VehicleDetailRequest = VehicleTypeModel::where('form_id', $id)->first();
        $VehicleSlipForm = VehicleSlipModel::find($id);

        if (!$VehicleDetailRequest && !$DriverDet) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update the status
        $DriverDet->form_id = 0;
        $DriverDet->status = 0;
        $VehicleDetailRequest->form_id = 0;
        $VehicleDetailRequest->availability = 0;

        if($VehicleDetailRequest->save() && $DriverDet->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'Vehicle Type';
            $logs->message = $request->input('authority').' set the driver ('.$VehicleSlipForm->driver.') and vehicle ('.$VehicleSlipForm->vehicle_type.').';
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
            $logs->category = 'Vehicle Type';
            $logs->message = $request->input('authority').' has updated the vehicle.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

    /**
     *  Available Vehicle
     */
    public function availableVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update the status
        $VehicleDetailRequest->form_id = 0;
        $VehicleDetailRequest->availability = 0;

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'Vehicle Type';
            $logs->message = $request->input('authority').' set the vehicle ('.$VehicleDetailRequest->vehicle_name.' - '.$VehicleDetailRequest->vehicle_plate.') to available.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }
}