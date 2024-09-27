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
     *  1 - Admin Approval
     *  2 - Disapprove
     *  3 - Pending Approval
     *  4 - GSO
     *  5 - Force Closed
     *  6 - Admin (Request)
     * 
     */

    /**
     * Show All Request
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
     *  Show Vehicle Slip Form
     */
    public function showForm($id){

        // Root URL
        $rootUrl = URL::to('/');

        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Get the Admin Manager Detail
        $AdminRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $AdminName = $AdminRequest->firstname . ' ' . $AdminRequest->middlename. '. ' . $AdminRequest->lastname;
        $AdminEsig = $rootUrl . '/storage/displayesig/' . $AdminRequest->esign;

        // Get the Requestor Detail
        $RequestorRequest = PPAEmployee::where('id', $DataRequest->user_id)->first();
        $RequestorPosition = $RequestorRequest->position;
        $RequestorEsig = $rootUrl . '/storage/displayesig/' . $RequestorRequest->esign;

        $respondData = [
            'form' => $DataRequest,
            'adminName' => $AdminName,
            'adminEsig' => $AdminEsig,
            'requestorPosition' => $RequestorPosition, 
            'requestorEsig' => $RequestorEsig,       
        ];

        return response()->json($respondData);
    }

    /**
     *  Submit Form
     */
    public function storeVehicleSlip(VehicleSlipRequest $request){

        $data = $request->validated();

        $currentDateTime = Carbon::now();

        $requestDateTime = Carbon::createFromFormat('Y-m-d H:i', $data['date_arrival'].' '.$data['time_arrival']);

        // Check if the start date is in the past
        if ($requestDateTime < $currentDateTime) {
            return response()->json(['error' => 'invalidDate'], 422);
        }

        // Create and save the deployment data
        $deploymentData = VehicleSlipModel::create($data);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'JOMS';
        $logs->message = $request->input('sender_name').' has submitted a request on (Vehicle Slip No. '.$deploymentData->id.').';
        $logs->save();

        // Notification
        $GSORequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $AMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();

        if(strpos($request->input('code_clearance'), 'GSO') !== false){

            // Send to the Admin Manager
            $notiGSO = new NotificationModel();
            $notiGSO->type_of_jlms = "JOMS";
            $notiGSO->sender_avatar = $request->input('avatar');
            $notiGSO->sender_id = $request->input('sender_id');
            $notiGSO->sender_name = $request->input('sender_name');
            $notiGSO->message = $request->input('notif_message');
            $notiGSO->receiver_id = $AMRequest->id;
            $notiGSO->receiver_name = $AMRequest->firstname . ' ' . $AMRequest->middlename. '. ' . $AMRequest->lastname;
            $notiGSO->joms_type = 'JOMS_Vehicle';
            $notiGSO->status = 2;
            $notiGSO->joms_id = $deploymentData->id;
            $notiGSO->save();

        }else{

            // Send to the GSO
            $noti = new NotificationModel();
            $noti->type_of_jlms = "JOMS";
            $noti->sender_avatar = $request->input('avatar');
            $noti->sender_id = $request->input('sender_id');
            $noti->sender_name = $request->input('sender_name');
            $noti->message = $request->input('notif_message');
            $noti->receiver_id = $GSORequest->id;
            $noti->receiver_name = $GSORequest->firstname . ' ' . $GSORequest->middlename. '. ' . $GSORequest->lastname;
            $noti->joms_type = 'JOMS_Vehicle';
            $noti->status = 2;
            $noti->joms_id = $deploymentData->id;
            $noti->save();
        }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
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
     *  Store Vehicle Information
     */
    public function storeVehicleInformation(Request $request, $id){

        //Validation
        $vehicleInfo = $request->validate([
            'vehicle_type' => 'required|string',
            'driver' => 'required|string'
        ]);

        $DataRequest = VehicleSlipModel::find($id);

        $Approval = $DataRequest->admin_approval;

        if (!$DataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update Data
        $getVehDet = $DataRequest->update([
            'vehicle_type' => $vehicleInfo['vehicle_type'],
            'driver' => $vehicleInfo['driver'],
            'remarks' => $Approval == 6 ? "The GSO has assigned the driver and the vehicle." : "The GSO has finished assigning the driver and vehicle and is now waiting for the Admin Manager's approval.",
            'admin_approval' => $Approval == 6 ? 1 : 3,
        ]);

        if($getVehDet){

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

            // Notification
            // Check
            $checkQuery = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first(); // Send to the admin manager

            if($DataRequest->user_id === $checkQuery->id){
                // Send to the Admin Manager
                $notiAM = new NotificationModel();
                $notiAM->type_of_jlms = "JOMS";
                $notiAM->sender_avatar = $request->input('avatar');
                $notiAM->sender_id = $request->input('sender_id');
                $notiAM->sender_name = $request->input('sender_name');
                $notiAM->message = "Your request has an assigned driver and vehicle.";
                $notiAM->receiver_id = $checkQuery->id;
                $notiAM->receiver_name = $checkQuery->firstname . ' ' . $checkQuery->middlename. '. ' . $checkQuery->lastname;
                $notiAM->joms_type = 'JOMS_Vehicle';
                $notiAM->status = 2;
                $notiAM->joms_id = $DataRequest->id;
                $notiAM->save();

            }else{
                // Send to the Admin Manager for approval
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = $request->input('notif_message');
                $noti->receiver_id = $checkQuery->id;
                $noti->receiver_name = $checkQuery->firstname . ' ' . $checkQuery->middlename. '. ' . $checkQuery->lastname;
                $noti->joms_type = 'JOMS_Vehicle';
                $noti->status = 2;
                $noti->joms_id = $DataRequest->id;
                $noti->save();
            }

            

            return response()->json(['message' => 'User details updated successfully.'], 200);
        }else{
            return response()->json(['message' => 'There something missing.'], 204);
        }

    }

    /**
     *  Admin Approval
     */
    public function approveRequest(Request $request, $id){
        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update Approve
        $DataRequest->admin_approval = 1;
        $DataRequest->remarks = $request->input('remarks');

        if($DataRequest->save()){

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

            // Notification
            $checkQueryGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

            if($DataRequest->user_id === $checkQueryGSO->id){

                // Send to the GSO
                $noti2 = new NotificationModel();
                $noti2->type_of_jlms = "JOMS";
                $noti2->sender_avatar = $request->input('avatar');
                $noti2->sender_id = $request->input('sender_id');
                $noti2->sender_name = $request->input('sender_name');
                $noti2->message = 'Your request has been approve by '.$request->input('sender_name').'.';
                $noti2->receiver_id = $checkQueryGSO->id;
                $noti2->receiver_name = $checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename. '. ' . $checkQueryGSO->lastname;
                $noti2->joms_type = 'JOMS_Vehicle';
                $noti2->status = 2;
                $noti2->joms_id = $DataRequest->id;
                $noti2->save();

            } else {

                // Send back to the GSO
                $noti1 = new NotificationModel();
                $noti1->type_of_jlms = "JOMS";
                $noti1->sender_avatar = $request->input('avatar');
                $noti1->sender_id = $request->input('sender_id');
                $noti1->sender_name = $request->input('sender_name');
                $noti1->message = 'The request for '.$DataRequest->user_name.' has been approve by '.$request->input('sender_name').'.';
                $noti1->receiver_id = $checkQueryGSO->id;
                $noti1->receiver_name = $checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename. '. ' . $checkQueryGSO->lastname;
                $noti1->joms_type = 'JOMS_Vehicle';
                $noti1->status = 2;
                $noti1->joms_id = $DataRequest->id;
                $noti1->save();

                // Send to the Requestor
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = $request->input('notif_message');
                $noti->receiver_id = $DataRequest->user_id;
                $noti->receiver_name = $DataRequest->user_name;
                $noti->joms_type = 'JOMS_Vehicle';
                $noti->status = 2;
                $noti->joms_id = $DataRequest->id;
                $noti->save();

            }

            return response()->json(['message' => 'The Form has been approved'], 200);

        }

    }

    /**
     *  Admin Decline Reason
     */
    public function submitAdminDeclineRequest(Request $request, $id){
        // Get Data
        $RequestData = VehicleSlipModel::find($id);

        if (!$RequestData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Update
        $RequestData->admin_approval = 2;
        $RequestData->remarks = $request->input('remarks');

        if($RequestData->save()){

            // For LOGS
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

            // Notification
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
            $checkQueryGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

            // Send back to the GSO
            $noti1 = new NotificationModel();
            $noti1->type_of_jlms = "JOMS";
            $noti1->sender_avatar = $request->input('avatar');
            $noti1->sender_id = $request->input('sender_id');
            $noti1->sender_name = $request->input('sender_name');
            $noti1->message = 'The request for '.$RequestData->user_name.' has been disapproved by '.$request->input('sender_name').'. Please see the reason.';
            $noti1->receiver_id = $checkQueryGSO->id;
            $noti1->receiver_name = $checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename. '. ' . $checkQueryGSO->lastname;
            $noti1->joms_type = 'JOMS_Vehicle';
            $noti1->status = 2;
            $noti1->joms_id = $RequestData->id;
            $noti1->save();


            return response()->json(['message' => 'Request Update Successfully'], 200);
        }else{
            return response()->json(['message' => 'There something wrong'], 500);
        }
    }

     /**
     *  Force Close the Form
     */
    public function forceCloseRequest(Request $request, $id){

        $DataRequest = VehicleSlipModel::find($id);

        if (!$DataRequest) {
            return response()->json(['message' => 'Data Error'], 404);
        }

        if($DataRequest->admin_approval === 1 || $DataRequest->admin_approval === 2){
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            // Update Approve
            $DataRequest->admin_approval = 5;
            $DataRequest->remarks = $request->input('remarks');

            if($DataRequest->save()){

                $Noti = NotificationModel::where('joms_id', $DataRequest->id)->where('joms_type', 'JOMS_Vehicle')->get();

                // Loop through each notification and update status
                foreach ($Noti as $notification) {
                    $notification->status = 3;

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
