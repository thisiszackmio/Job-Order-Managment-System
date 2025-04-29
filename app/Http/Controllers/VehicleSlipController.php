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
     *  1 - Admin Manager's Approval
     *  2 - Port Manager's Approval
     *  3 - Admin Manager's Disapproval
     *  4 - Port Manager's Disapproval
     *  5 - Admin Manager's Request
     *  6 - Port Manager's Request
     *  7 - GSO's and Authority request
     *  8 - Requestor's request
     *  9 - Deleted Form
     *  10 - Pending for Approval
     *  11 - Pending for Approval on Manager
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
                'remarks' => $vehicleSlip->remarks,
                'requestor' => $vehicleSlip->user_name,
            ];
        });

        return response()->json($VehDet);
    }

     /**
     *  Submit Vehicle Slip Form
     */
    public function storeVehicleSlip(Request $request){

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

        // Check if the start date is in the past
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

        if($deploymentData->user_id == $GSORequest->id || $deploymentData->user_id == $AuthorityRequest->id){
            if($submitVehicleInfo['type_of_slip'] === 'within'){
                // If the GSO and Authority create a request (Send directly to the Admin Manager if Within the City)
                $notiAM = new NotificationModel();
                $notiAM->type_of_jlms = "JOMS";
                $notiAM->sender_avatar = $request->input('avatar');
                $notiAM->sender_id = $request->input('sender_id');
                $notiAM->sender_name = $request->input('sender_name');
                $notiAM->message = $request->input('notif_message');
                $notiAM->receiver_id = $AMRequest->id;
                $notiAM->receiver_name = $AMRequest->firstname . ' ' . $AMRequest->middlename. '. ' . $AMRequest->lastname;
                $notiAM->joms_type = 'JOMS_Vehicle';
                $notiAM->status = 2;
                $notiAM->joms_id = $deploymentData->id;
                $notiAM->save();
            } else {
                // If the GSO and Authority create a request (Send directly to the Port Manager if Outside the City)
                $notiPM = new NotificationModel();
                $notiPM->type_of_jlms = "JOMS";
                $notiPM->sender_avatar = $request->input('avatar');
                $notiPM->sender_id = $request->input('sender_id');
                $notiPM->sender_name = $request->input('sender_name');
                $notiPM->message = $request->input('notif_message');
                $notiPM->receiver_id = $PMRequest->id;
                $notiPM->receiver_name = $PMRequest->firstname . ' ' . $PMRequest->middlename. '. ' . $PMRequest->lastname;
                $notiPM->joms_type = 'JOMS_Vehicle';
                $notiPM->status = 2;
                $notiPM->joms_id = $deploymentData->id;
                $notiPM->save();
            }
        } else {
            // -- Send to the Authorize -- //
            $notiAU = new NotificationModel();
            $notiAU->type_of_jlms = "JOMS";
            $notiAU->sender_avatar = $request->input('avatar');
            $notiAU->sender_id = $request->input('sender_id');
            $notiAU->sender_name = $request->input('sender_name');
            $notiAU->message = $request->input('notif_message');
            $notiAU->receiver_id = $AuthorityRequest->id;
            $notiAU->receiver_name = $AuthorityRequest->firstname . ' ' . $AuthorityRequest->middlename. '. ' . $AuthorityRequest->lastname;
            $notiAU->joms_type = 'JOMS_Vehicle';
            $notiAU->status = 2;
            $notiAU->joms_id = $deploymentData->id;
            $notiAU->save();

            // -- Send to the GSO -- //
            $notiGSO = new NotificationModel();
            $notiGSO->type_of_jlms = "JOMS";
            $notiGSO->sender_avatar = $request->input('avatar');
            $notiGSO->sender_id = $request->input('sender_id');
            $notiGSO->sender_name = $request->input('sender_name');
            $notiGSO->message = $request->input('notif_message');
            $notiGSO->receiver_id = $GSORequest->id;
            $notiGSO->receiver_name = $GSORequest->firstname . ' ' . $GSORequest->middlename. '. ' . $GSORequest->lastname;
            $notiGSO->joms_type = 'JOMS_Vehicle';
            $notiGSO->status = 2;
            $notiGSO->joms_id = $deploymentData->id;
            $notiGSO->save();
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'JOMS';
        $logs->message = $request->input('sender_name').' has submitted a request on (Vehicle Slip No. '.$deploymentData->id.').';
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
                'vehicle_plate' => $vehicle->vehicle_plate
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

        $remark = '';
        $approve = 0;

        $GSORequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $GSOName = $GSORequest->firstname . ' ' . $GSORequest->middlename. '. ' . $GSORequest->lastname;

        // for the Remarks 
        if($TypeofTravel === 'within'){
            if(in_array($Approval, [5, 6])) {
                $remark = $request->input('assign'). " has assigned a vehicle and a driver for you.";
            }else {
                $remark = $request->input('assign'). " has finished assigning the driver and vehicle and is now waiting for the Admin Manager's approval.";
            }
        } else {
            if($Approval == 5 ) {
                $remark = "Waiting for the Port Manager's approval";
            } else if($Approval == 6) {
                $remark = $request->input('assign'). " has assigned a vehicle and a driver for you.";
            }
            else {
                $remark = $request->input('assign'). " has finished assigning the driver and vehicle and is now waiting for the Port Manager's approval.";
            }
        }

        // For the Approval
        if($TypeofTravel === 'within'){
            if($Approval == 5) {
                $approve = 1;
            }
            else if($Approval == 6){
                $approve = 2;
            }
            else {
                $approve = 10;
            }
        } else {
            if($Approval == 5) {
                $approve = 11;
            }
            else if($Approval == 6){
                $approve = 2;
            }
            else {
                $approve = 10;
            }
        }

        // Check if already assign
        if($DataRequest->vehicle_type && $DataRequest->driver){
            return response()->json(['error' => 'Already'], 409);
        }else{
            // Update Data
            $getVehDet = $DataRequest->update([
                'vehicle_type' => $vehicleInfo['vehicle_type'],
                'driver_id' => $vehicleInfo['driver_id'], 
                'driver' => $vehicleInfo['driver'],
                'remarks' => $remark,
                'admin_approval' => $approve,
            ]);
        }

        if($getVehDet){

            // Notification

            // Check
            $checkAMQuery = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first(); 
            $checkPMQuery = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first(); 
            $checkReqQuery = PPAEmployee::where('id', $DataRequest->user_id)->first(); 

            // If the Requestor is the Port Manager
            if ($DataRequest->user_id === $checkPMQuery->id){
                if ($TypeofTravel == 'within') {
                    $notiAM = new NotificationModel();
                    $notiAM->type_of_jlms = "JOMS";
                    $notiAM->sender_avatar = $request->input('avatar');
                    $notiAM->sender_id = $request->input('sender_id');
                    $notiAM->sender_name = $request->input('sender_name');
                    $notiAM->message = "A driver and vehicle have been assigned to your request by " .$request->input('sender_name'). ".";
                    $notiAM->receiver_id = $checkPMQuery->id;
                    $notiAM->receiver_name = $checkPMQuery->firstname . ' ' . $checkPMQuery->middlename. '. ' . $checkPMQuery->lastname;
                    $notiAM->joms_type = 'JOMS_Vehicle';
                    $notiAM->status = 2;
                    $notiAM->joms_id = $DataRequest->id;
                    $notiAM->save();
                } else {
                    $notiAM = new NotificationModel();
                    $notiAM->type_of_jlms = "JOMS";
                    $notiAM->sender_avatar = $request->input('avatar');
                    $notiAM->sender_id = $request->input('sender_id');
                    $notiAM->sender_name = $request->input('sender_name');
                    $notiAM->message = "A driver and vehicle have been assigned to your request by " .$request->input('sender_name'). ".";
                    $notiAM->receiver_id = $checkPMQuery->id;
                    $notiAM->receiver_name = $checkPMQuery->firstname . ' ' . $checkPMQuery->middlename. '. ' . $checkPMQuery->lastname;
                    $notiAM->joms_type = 'JOMS_Vehicle';
                    $notiAM->status = 2;
                    $notiAM->joms_id = $DataRequest->id;
                    $notiAM->save();
                } 
            }
            // If the Requestor is the Admin Manager
            else if($DataRequest->user_id === $checkAMQuery->id){
                if ($TypeofTravel == 'within') {
                    $notiAM = new NotificationModel();
                    $notiAM->type_of_jlms = "JOMS";
                    $notiAM->sender_avatar = $request->input('avatar');
                    $notiAM->sender_id = $request->input('sender_id');
                    $notiAM->sender_name = $request->input('sender_name');
                    $notiAM->message = "A driver and vehicle have been assigned to your request by " .$request->input('sender_name'). ".";
                    $notiAM->receiver_id = $checkAMQuery->id;
                    $notiAM->receiver_name = $checkAMQuery->firstname . ' ' . $checkAMQuery->middlename. '. ' . $checkAMQuery->lastname;
                    $notiAM->joms_type = 'JOMS_Vehicle';
                    $notiAM->status = 2;
                    $notiAM->joms_id = $DataRequest->id;
                    $notiAM->save();
                } else {
                    $notiPM = new NotificationModel();
                    $notiPM->type_of_jlms = "JOMS";
                    $notiPM->sender_avatar = $checkAMQuery->avatar;
                    $notiPM->sender_id = $checkAMQuery->id;
                    $notiPM->sender_name = $checkAMQuery->firstname . ' ' . $checkAMQuery->middlename. '. ' . $checkAMQuery->lastname;
                    $notiPM->message = "There is a request for ".$DataRequest->user_name." that needs your approval.";
                    $notiPM->receiver_id = $checkPMQuery->id;
                    $notiPM->receiver_name = $checkPMQuery->firstname . ' ' . $checkPMQuery->middlename. '. ' . $checkPMQuery->lastname;
                    $notiPM->joms_type = 'JOMS_Vehicle';
                    $notiPM->status = 2;
                    $notiPM->joms_id = $DataRequest->id;
                    $notiPM->save();
                }
            }
            // If Others
            else {
                if ($TypeofTravel == 'within') {
                    $notiAM = new NotificationModel();
                    $notiAM->type_of_jlms = "JOMS";
                    $notiAM->sender_avatar = $request->input('avatar');
                    $notiAM->sender_id = $request->input('sender_id');
                    $notiAM->sender_name = $request->input('sender_name');
                    $notiAM->message = "There is a request for ".$DataRequest->user_name." that needs your approval.";
                    $notiAM->receiver_id = $checkAMQuery->id;
                    $notiAM->receiver_name = $checkAMQuery->firstname . ' ' . $checkAMQuery->middlename. '. ' . $checkAMQuery->lastname;
                    $notiAM->joms_type = 'JOMS_Vehicle';
                    $notiAM->status = 2;
                    $notiAM->joms_id = $DataRequest->id;
                    $notiAM->save();
                } else {
                    $notiPM = new NotificationModel();
                    $notiPM->type_of_jlms = "JOMS";
                    $notiPM->sender_avatar = $checkAMQuery->avatar;
                    $notiPM->sender_id = $checkAMQuery->id;
                    $notiPM->sender_name = $checkAMQuery->firstname . ' ' . $checkAMQuery->middlename. '. ' . $checkAMQuery->lastname;
                    $notiPM->message = "There is a request for ".$DataRequest->user_name." that needs your approval.";
                    $notiPM->receiver_id = $checkPMQuery->id;
                    $notiPM->receiver_name = $checkPMQuery->firstname . ' ' . $checkPMQuery->middlename. '. ' . $checkPMQuery->lastname;
                    $notiPM->joms_type = 'JOMS_Vehicle';
                    $notiPM->status = 2;
                    $notiPM->joms_id = $DataRequest->id;
                    $notiPM->save();
                }
            }


            // Logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();


            return response()->json(['message' => 'User details updated successfully.'], 200);
        }else{
            return response()->json(['message' => 'There something missing.'], 204);
        }

    }

    /**
     *  Admin Manager and Port Manager Approval
     */
    public function approveRequest(Request $request, $id){
        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        $approver = '';

        if($DataRequest->type_of_slip === 'within'){
            $approver = 1;
        } else {
            $approver = 2;
        }

        // Update Approve
        $DataRequest->admin_approval = $approver;
        $DataRequest->remarks = $request->input('remarks');

        if($DataRequest->save()){

            // Notification
            // Send back to the Requestor
            $notiReq = new NotificationModel();
            $notiReq->type_of_jlms = "JOMS";
            $notiReq->sender_avatar = $request->input('avatar');
            $notiReq->sender_id = $request->input('sender_id');
            $notiReq->sender_name = $request->input('sender_name');
            $notiReq->message = 'Your request has been approve by '.$request->input('sender_name').'.';
            $notiReq->receiver_id = $DataRequest->user_id;
            $notiReq->receiver_name = $DataRequest->user_name;
            $notiReq->joms_type = 'JOMS_Vehicle';
            $notiReq->status = 2;
            $notiReq->joms_id = $DataRequest->id;
            $notiReq->save();

            return response()->json(['message' => 'The Form has been approved'], 200);

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
        ]);

        // Create and save the deployment data
        $deploymentData = VehicleTypeModel::create($vehicleValidate);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'Vehicle';
        $logs->message = $request->input('logs');
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
        $logs->message = $request->input('logs');
        $logs->save();

        // Delete the vehicle
        if($VehicleDetailRequest->delete()){
            return response()->json(['message' => 'Vehicle deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete vehicle'], 500);
        }

    }

}
