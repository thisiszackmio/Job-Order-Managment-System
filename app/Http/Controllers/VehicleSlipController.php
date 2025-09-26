<?php

namespace App\Http\Controllers;
use App\Models\VehicleSlipModel;
use App\Models\PPAEmployee;
use App\Models\VehicleTypeModel;
use App\Models\LogsModel;
use App\Models\AssignPersonnelModel;
use App\Models\NotificationModel;
use App\Models\FormTracker;
use App\Http\Requests\VehicleSlipRequest;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
use Carbon\Carbon;

class VehicleSlipController extends Controller
{
    /**
     *  Legend for Status and Notifications
     *  0 - Form Cancel
     *  1 - Form Closed
     *  2 - Form Approved
     *  3 - Form Disapproved
     *  4 - Admin Manager's Pending Approval
     *  5 - Port Manager's Pending Approval
     *  6 - Admin Manager's Sent Request
     *  7 - Port Manager's Sent Request
     *  8 - GSO and Authority Sent Request
     *  9 - Regular Sent Request
     * 
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
            'notes' => 'nullable|string'
        ]);

        $currentDateTime = Carbon::now();

        $requestDateTime = Carbon::createFromFormat('Y-m-d H:i', $submitVehicleInfo['date_arrival'].' '.$submitVehicleInfo['time_arrival']);

        if($request->input('form') === "Check"){
            return response()->json(['message' => 'Check'], 201);
        }
        
        if ($requestDateTime < $currentDateTime) {
            return response()->json(['message' => 'invalidDate'], 201);
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

        // Add to the Trackers
        $track = new FormTracker();
        $track->form_id = $deploymentVehicleData->id;
        $track->type_of_request = 'Vehicle';
        $track->remarks = $request->input('user_name').' submitted a request.';
        $track->save();

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'FORM';
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
            'notes' => 'nullable|string'
        ]);

        $VehicleSlipData = VehicleSlipModel::find($id);

        if (!$VehicleSlipData) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        if ($VehicleSlipData->admin_approval === 0 || $VehicleSlipData->admin_approval === 1) {
            return response()->json(['message' => 'Request is already close'], 201);
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
                'notes' => $updateVehicleInfo['notes'],
            ]);

            if($updateVehicleSlip){

                // Add to the Trackers
                $track = new FormTracker();
                $track->form_id = $VehicleSlipData->id;
                $track->type_of_request = 'Vehicle';
                $track->remarks = $request->input('authority').' updated the form.';
                $track->save();

                // Logs
                $logs = new LogsModel();
                $logs->category = 'FORM';
                $logs->message = $request->input('authority')." has updated ".$VehicleSlipData->user_name."'s request on Vehicle Slip No.".$VehicleSlipData->id.".";
                $logs->save();

                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['error' => 'There area some missing.'], 406);
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
            return response()->json(['error' => 'No-Form'], 404);
        }

        // Get the Admin Manager Detail
        $AdminRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $AdminName = $AdminRequest->firstname . ' ' . $AdminRequest->middlename. '. ' . $AdminRequest->lastname;
        $AdminEsig = $rootUrl . '/storage/displayesig/' . $AdminRequest->esign;

        // Get the Port Manager Detail
        $PMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first();
        $PMId = $PMRequest->id;
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

        $respondData = [
            'form' => $VehicleSlipForm,
            'pmId' => $PMId,
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
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Check if already assign
        if($VehicleDataRequest->vehicle_type && $VehicleDataRequest->driver){
            return response()->json(['message' => 'Already'], 201);
        }else{

            // Get Admin Manager and Port Manager
            $checkAMQuery = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first(); 
            $checkPMQuery = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first(); 

            // Get inform of the assign person
            $getAssign = PPAEmployee::find($request->input('assign'));
            $assignName = trim($getAssign->firstname . ' ' . $getAssign->middlename . '. ' . $getAssign->lastname);

            // for the Remarks Content
            if($TypeofTravel === 'within'){
                if(in_array($Approval, [6, 7])){
                    // If both Port and Admin Manager send a request
                    $remark = $assignName. " has assigned both a vehicle and a driver.";
                    $approve = 1;
                    $form = 1;
                }else{
                    // If Regular Requestor send a request
                    $remark = $assignName. " has assigned a vehicle and driver, and is waiting for the Admin Manager's approval.";
                    $approve = 4;
                    $form = 2;
                }
            }else{
                if($Approval == 7) {
                    // If Port Manager send a request
                    $remark = $assignName. " has assigned both a vehicle and a driver.";
                    $approve = 1;
                    $form = 1;
                }else{
                    $remark = $assignName. " has assigned a vehicle and driver, and is waiting for the Port Manager's approval.";
                    $approve = 5;
                    $form = 2;
                }
            }

            // Update first for the Assign Vehicle and Driver
            if($TypeofTravel == 'within'){
                if(in_array($Approval, [6, 7])){
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
                if($Approval == 7){
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
                    if(in_array($Approval, [6, 7])){
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
                    if($Approval == 7) {
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

                // Add to the Trackers
                $track = new FormTracker();
                $track->form_id = $VehicleDataRequest->id;
                $track->type_of_request = 'Vehicle';
                $track->remarks = $assignName.' has assigned the driver and vehicle.';
                $track->save();

                // Logs
                $logs = new LogsModel();
                $logs->category = 'FORM';
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
            return response()->json(['error' => 'Data Error'], 404);
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
            $approver = 2;
            $form = 1;
            if($ReqId == $GsoId){
                $receivers = [
                    ['id' => $ReqId, 
                     'name' => $VehicleDataRequest->user_name,
                     'noti' => 'Your request has been approved by the Admin Manager.'
                    ]
                ];
            }else{
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
            }
        }else{
            $remark = "Approved by the Port Manager.";
            $approver = 2;
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

        // Vehicle
        if (preg_match('/^(.*?)\s*\((.*?)\)$/', $VehicleDataRequest->vehicle_type, $matches)) {
            $vehicleName = trim($matches[1]);
            $plateNumber = trim($matches[2]);
        } else {
            $vehicleName = $slip->vehicle_type;
            $plateNumber = null;
        }

        VehicleTypeModel::where('vehicle_name', $vehicleName)
                    ->where('vehicle_plate', $plateNumber)
                    ->update(['status' => 0]);

        AssignPersonnelModel::where('personnel_id', $VehicleDataRequest->driver_id)
                    ->update(['status' => 0]);

        if($VehicleDataRequest->save()){
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

            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $VehicleDataRequest->id;
            $track->type_of_request = 'Vehicle';
            $track->remarks = $approverName.' approved the request.';
            $track->save();

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'FORM';
            $logs->message = $approverName." has approved ".$VehicleDataRequest->user_name."'s request on Vehicle Slip No.".$VehicleDataRequest->id.".";
            $logs->save();

            return response()->json(['message' => 'The Form has been approved'], 200);
            
        }
    }

    /**
     *  Activate On-Travel on assigned Driver and Vehicle
     */
    public function OnTravel($id){
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $dateNow = Carbon::now()->toDateString();

        $VehicleDataRequest = VehicleSlipModel::where('date_arrival', '<=', $dateNow)
            ->whereIn('admin_approval', [2, 1])
            ->orderBy('date_arrival', 'desc')
            ->get();

        // return response()->json($VehicleDataRequest);

        if ($VehicleDataRequest->isEmpty()) {
            return response()->json(['message' => 'No Vehicle Travel Yet'], 201);
        } else {
            $employee = PPAEmployee::find($id);
            $clearances = array_map('trim', explode(',', $employee->code_clearance));

            foreach ($VehicleDataRequest as $slip) {
                // $vehicleDateTime = Carbon::parse($slip->date_arrival . ' ' . $slip->time_arrival);

                if ($slip->user_id == $employee->id || in_array('GSO', $clearances) || in_array('AM', $clearances)) {
                    // Vehicle
                    if (preg_match('/^(.*?)\s*\((.*?)\)$/', $slip->vehicle_type, $matches)) {
                        $vehicleName = trim($matches[1]);
                        $plateNumber = trim($matches[2]);
                    } else {
                        $vehicleName = $slip->vehicle_type;
                        $plateNumber = null;
                    }

                    // === VEHICLE ===
                    if ($vehicle) {
                        if ($vehicle->status == 0) {
                            // Reset if past date
                            if ($vehicle->date_used && Carbon::parse($vehicle->date_used)->lt($today)) {
                                $vehicle->update([
                                    'status' => 0,
                                    'date_used' => null,
                                ]);
                            }

                            // Activate if scheduled today
                            if (Carbon::parse($slip->date_arrival)->isSameDay($today)) {
                                $vehicle->update([
                                    'status' => 1,
                                    'date_used' => $today->toDateString(),
                                ]);
                            }
                        }
                        // if status == 2 → do nothing (keep as is)
                    }

                    // === DRIVER ===
                    if ($driver) {
                        if ($driver->status == 0) {
                            // Reset if past date
                            if ($driver->date_assigned && Carbon::parse($driver->date_assigned)->lt($today)) {
                                $driver->update([
                                    'status' => 0,
                                    'date_assigned' => null,
                                ]);
                            }

                            // Activate if scheduled today
                            if (Carbon::parse($slip->date_arrival)->isSameDay($today)) {
                                $driver->update([
                                    'status' => 1,
                                    'date_assigned' => $today->toDateString(),
                                ]);
                            }
                        }
                        // if status == 2 → do nothing (keep as is)
                    }

                }
            }

            return response()->json(['message' => 'Assign Vehicle and Driver Updated'], 200);
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
            return response()->json(['error' => 'Data Error'], 404);
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
        $VehicleDataRequest->admin_approval = 3;
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

            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $VehicleDataRequest->id;
            $track->type_of_request = 'Vehicle';
            $track->remarks = $request->input('authority').' disapproved the request.';
            $track->save();

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'FORM';
            $logs->message = $request->input('authority')." has dispprove ".$VehicleDataRequest->user_name."'s request on Vehicle Slip No.".$VehicleDataRequest->id.".";
            $logs->save();
        }

    }

    /**
     * Close Request 
     */
    function closeRequest(Request $request, $id){
        $twentyFourHoursAgo = Carbon::now()->subHours(24);

        $VehicleDataRequest = VehicleSlipModel::where('id', $id)
                                ->where('admin_approval', 2)
                                ->where('updated_at', '<', $twentyFourHoursAgo)
                                ->first();

        if ($VehicleDataRequest) {
            // Update the record
            $VehicleDataRequest->admin_approval = 1;
            $VehicleDataRequest->remarks = 'Form is closed';

            if($VehicleDataRequest->save()){
                // Add to the Trackers
                $track = new FormTracker();
                $track->form_id = $VehicleDataRequest->id;
                $track->type_of_request = 'Vehicle';
                $track->remarks = 'The form was closed by the system.';
                $track->save();

                // Log the action
                $logs = new LogsModel();
                $logs->category = 'FORM';
                $logs->message = 'The system has closed the Vehicle Slip No. ' . $VehicleDataRequest->id;
                $logs->save();
            }

        }
    }

    /**
     *  Cancel the Form
     */
    public function cancelFormRequest(Request $request, $id){
        $VehicleDataRequest = VehicleSlipModel::find($id);

        if (!$VehicleDataRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        if($VehicleDataRequest->admin_approval === 0 || $VehicleDataRequest->admin_approval === 1 || $VehicleDataRequest->admin_approval === 2){
            return response()->json(['message' => 'Request is already close'], 201);
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

                // Add to the Trackers
                $track = new FormTracker();
                $track->form_id = $VehicleDataRequest->id;
                $track->type_of_request = 'Vehicle';
                $track->remarks = $request->input('authority').' has canceled the form.';
                $track->save();

                // Save a single log entry after all notifications are updated
                $logs = new LogsModel();
                $logs->category = 'FORM';
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
    public function getVehicleDetails(Request $request){

        $date = $request->query('date');
        $time = $request->query('time');

        // Get the Vehicle Slip Request
        $vehicleSlipReq = VehicleSlipModel::where('date_arrival', $date)
            ->whereTime('time_arrival', '>=', $time)
            ->whereIn('admin_approval', [1, 2])
            ->get()
            ->map(function ($slip) {
                // Split vehicle_type into name & plate
                if (preg_match('/^(.*?)\s*\((.*?)\)$/', $slip->vehicle_type, $matches)) {
                    return [
                        'vehicle_name'  => trim($matches[1]),
                        'vehicle_plate' => trim($matches[2]),
                    ];
                }
                return [
                    'vehicle_name'  => $slip->vehicle_type,
                    'vehicle_plate' => null,
                ];
            });

        // Convert slips into lookup array for quick matching
        $slipVehicles = collect($vehicleSlipReq);
        
        // Get all vehicle records
        $VehicleDetailRequest = VehicleTypeModel::all();

        // Map and check availability
        $vehicleData = $VehicleDetailRequest->map(function ($vehicle) use ($slipVehicles, $date) {
            $isAvailable = $slipVehicles->contains(function ($slip) use ($vehicle) {
                return $slip['vehicle_name'] === $vehicle->vehicle_name &&
                    $slip['vehicle_plate'] === $vehicle->vehicle_plate;
            });

            // Condition
            if ($vehicle->status == 1 && $vehicle->date_used == $date) {
                $avail = 1;
            } else if($vehicle->status == 2) {
                $avail = 0;
            } else if($vehicle->status == 3){
                $avail = 3;
            } else {
                if($isAvailable) {
                    $avail = 2;
                } else {
                    $avail = 0;
                }
            }

            return [
                'vehicle_id'    => $vehicle->id,
                'vehicle_name'  => $vehicle->vehicle_name,
                'vehicle_plate' => $vehicle->vehicle_plate,
                'availability'  => $avail,
            ];
        });

        return response()->json($vehicleData);
    }

    /**
     *  Get The Driver
     */
    public function getDriverDetails(Request $request){

        $date = $request->query('date');
        $time = $request->query('time');

        // Get the Vehicle Slip Request
        $vehicleSlipReq = VehicleSlipModel::where('date_arrival', $date)
            ->whereTime('time_arrival', '>=', $time)
            ->whereIn('admin_approval', [1, 2])
            ->get()
            ->map(function ($driver) {
                return [
                    'driver_id' => $driver->driver_id,
                ];
            });

        // Convert slips into lookup array for quick matching
        $getDriver = collect($vehicleSlipReq);

        // Get all vehicle records
        $DriverRequest = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->get();

        // Map and check availability
        $driverData = $DriverRequest->map(function ($driverDet) use ($getDriver, $date) {
            $isAssigned = $getDriver->contains(function ($slip) use ($driverDet) {
                return $slip['driver_id'] === $driverDet->personnel_id;
            });

            // Condition
            if ($driverDet->status == 1 && $driverDet->date_assigned == $date) {
                $avail = 1;
            } else if($driverDet->status == 2) {
                $avail = 0;
            } else if($driverDet->status == 3){
                $avail = 3;
            } else {
                if($isAssigned) {
                    $avail = 2;
                } else {
                    $avail = 0;
                }
            }

            return [
                'driver_id'    => $driverDet->personnel_id,
                'driver_name'  => $driverDet->personnel_name,
                'availability' => $avail,
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
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Modify data functions on vehicle usage and details
        $vehicleData = $VehicleDetailRequest->map(function ($vehicle) {
            $vehicleName = $vehicle->vehicle_name. ' ('. $vehicle->vehicle_plate .')';
            $slipCount = VehicleSlipModel::where('vehicle_type', $vehicleName)->count();
            return [
                'vehicle_id' => $vehicle->id,
                'vehicle_name' => $vehicle->vehicle_name,
                'vehicle_plate' => $vehicle->vehicle_plate,
                'vehicle_status' => $vehicle->status,
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
            'status' => 'required|numeric'
        ]);

        // Create and save the deployment data
        $deploymentData = VehicleTypeModel::create($vehicleValidate);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'VEHICLE';
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
            return response()->json(['error' => 'Data Error'], 404);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'VEHICLE';
        $logs->message = $request->input('authority').' just removed the vehicle ('.$VehicleDetailRequest->vehicle_name.'-'.$VehicleDetailRequest->vehicle_plate.') on the list.';
        $logs->save();

        // Delete the vehicle
        if($VehicleDetailRequest->delete()){
            return response()->json(['message' => 'Vehicle deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete vehicle'], 406);
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
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Update the status
        $DriverDet->status = 0;
        $DriverDet->date_assigned = null;
        $VehicleDetailRequest->status = 0;
        $VehicleDetailRequest->date_used = null;

        if($VehicleDetailRequest->save() && $DriverDet->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'VEHICLE';
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
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Update the status
        $VehicleDetailRequest->vehicle_name = $request->input('vehicle_name');
        $VehicleDetailRequest->vehicle_plate = $request->input('vehicle_plate');

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'VEHICLE';
            $logs->message = $request->input('authority').' has updated the vehicle.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

    /**
     *  Set to UnAvailable Vehicle
     */
    public function notavailableVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Update the status
        $VehicleDetailRequest->status = 3;
        $VehicleDetailRequest->date_used = null;

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'VEHICLE';
            $logs->message = $request->input('authority').' set the vehicle ('.$VehicleDetailRequest->vehicle_name.' - '.$VehicleDetailRequest->vehicle_plate.') to not available.';
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
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Update the status
        $VehicleDetailRequest->status = 2;
        $VehicleDetailRequest->date_used = null;

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'VEHICLE';
            $logs->message = $request->input('authority').' set the vehicle ('.$VehicleDetailRequest->vehicle_name.' - '.$VehicleDetailRequest->vehicle_plate.') to available.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

}