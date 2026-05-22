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
use Barryvdh\DomPDF\Facade\Pdf;

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
     *  0 - undread
     *  1 - read
     * 
     */
    /**
     * Generate PDF
     */
    public function generateVehiclePDF($id){
        $vehicle = VehicleSlipModel::findOrFail($id);
        $admin = PPAEmployee::where('code_clearance', 'LIKE', '%AM%')->first();
        $pm = PPAEmployee::where('code_clearance', 'LIKE', '%PM%')->first();

        // Get all needed employees in one query
        $employees = PPAEmployee::whereIn('id', [
            $vehicle->user_id,
            $vehicle->driver_id,
        ])->get()->keyBy('id');

        $requestor = $employees[$vehicle->user_id] ?? null;
        $driver = $employees[$vehicle->driver_id] ?? null;

        $pdf = Pdf::loadView('pdf.vehicle', compact(
            'vehicle',
            'admin',
            'pm',
            'driver',
            'requestor'
        ))->setPaper('a4', 'landscape');

        return $pdf->stream("Vehicle-Slip-No-$id.pdf");
    }

    /**
     * Show All Request on the List
    */ 
    public function VehicleList(Request $request){
        $search = $request->input('search');

        $query = VehicleSlipModel::orderBy('created_at', 'desc');

        // SEARCH
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('purpose', 'LIKE', "%{$search}%")
                ->orWhere('place_visited', 'LIKE', "%{$search}%")
                ->orWhere('driver', 'LIKE', "%{$search}%")
                ->orWhere('user_name', 'LIKE', "%{$search}%")
                ->orWhere('remarks', 'LIKE', "%{$search}%");
            });
        }

        // PAGINATION
        $getVehicleSlipData = $query->paginate(30);

        // TRANSFORM DATA
        $VehDet = $getVehicleSlipData->through(function ($vehicleSlip) {

            $passengerArray = (
                $vehicleSlip->passengers &&
                $vehicleSlip->passengers !== 'None'
            )
                ? explode("\n", $vehicleSlip->passengers)
                : [];

            return [
                'id' => $vehicleSlip->id,
                'date_request' => $vehicleSlip->created_at->format('F j, Y'),
                'purpose' => $vehicleSlip->purpose,
                'place_visited' => $vehicleSlip->place_visited,
                'date_arrival' => Carbon::parse($vehicleSlip->date_arrival)->format('F j, Y'),
                'time_arrival' => Carbon::parse($vehicleSlip->time_arrival)->format('g:i a'),
                'vehicle_type' => $vehicleSlip->vehicle_type,
                'driver' => $vehicleSlip->driver,
                'passengers' => count($passengerArray),
                'admin_approval' => $vehicleSlip->admin_approval,
                'requestor' => $vehicleSlip->user_name,
                'remarks' => $vehicleSlip->remarks,
            ];
        });

        return response()->json($VehDet);
    }

    /**
     *  Confirm Form
     */
    public function checkForm(Request $request){
        $now = Carbon::now();

        //Validation
        $checkVehicleInfo = $request->validate([
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
        $requestDateTime = Carbon::createFromFormat('Y-m-d H:i', $checkVehicleInfo['date_arrival'].' '.$checkVehicleInfo['time_arrival']);

        if ($requestDateTime < $currentDateTime) {
            return response()->json(['error' => 'invalidDate'], 400);
        } 

        if($request->input('remarks') === "Check"){
            return response()->json(['message' => 'Check'], 200);
        }
    }

    /**
     *  Submit Vehicle Slip Form
     */
    public function storeVehicleSlip(Request $request){
        $now = Carbon::now();

        // Get Data
        $submitVehicleInfo = [
            'user_id' => $request->input('user_id'),
            'user_name' => $request->input('user_name'),
            'type_of_slip' => $request->input('type_of_slip'),
            'purpose' => $request->input('purpose'),
            'passengers' => $request->input('passengers'),
            'place_visited' => $request->input('place_visited'),
            'date_arrival' => $request->input('date_arrival'),
            'time_arrival' => $request->input('time_arrival'),
            'vehicle_type' => $request->input('vehicle_type'),
            'driver_id' => $request->input('driver_id'),
            'driver' => $request->input('driver'),
            'admin_approval' => $request->input('admin_approval'),
            'remarks' => $request->input('remarks'),
            'notes' => $request->input('notes'),
        ];

        // Create and save the deployment data
        $deploymentVehicleData = VehicleSlipModel::create($submitVehicleInfo);

        if (!$deploymentVehicleData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // For the Notification

        // --- GSO --- //
        $GSORequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $gsoName = trim($GSORequest->firstname . ' ' . $GSORequest->middlename . '. ' . $GSORequest->lastname);

        // --- Admin -- //
        $AMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $adminName = trim($AMRequest->firstname . ' ' . $AMRequest->middlename . '. ' . $AMRequest->lastname);

        // --- Port Manager --- //
        $PMRequest = PPAEmployee::where('code_clearance', 'LIKE', "%PM%")->first();
        $pmName = trim($PMRequest->firstname . ' ' . $PMRequest->middlename . '. ' . $PMRequest->lastname);

        // --- Authority --- //
        $AuthorityRequests = PPAEmployee::where('code_clearance', 'LIKE', "%AUV%")->get();

        // --- Requestor --- //
        $Requestor = PPAEmployee::find($deploymentVehicleData->user_id);
        $requestorName = trim($Requestor->firstname . ' ' . $Requestor->middlename . '. ' . $Requestor->lastname);

        $receivers = [];

        // --- If GSO and Authority are the requestor (Direct to the Admin and PM) ---//
        $isAuthorityRequestor = $AuthorityRequests->contains('id', $deploymentVehicleData->user_id);

        if($deploymentVehicleData->user_id == $GSORequest->id || $isAuthorityRequestor){
            if ($submitVehicleInfo['type_of_slip'] === 'within'){
                // Send notification to the Admin
                $receivers = [
                    ['id' => $AMRequest->id, 'name' => $adminName]
                ];
            }else{
                // Send notification to the Port Manager
                $receivers = [
                    ['id' => $PMRequest->id, 'name' => $pmName]
                ];
            }

            $notiMessage = 'There is a request for ' . $requestorName . ' and needs your approval.';
        }else{
            // If Regular Requestor (Send to the GSO or Authority)
            $receivers = [
                ['id' => $GSORequest->id, 'name' => $gsoName],
            ];

            // For the Authorize Person
            foreach ($AuthorityRequests as $authority) {
                $authorityName = trim($authority->firstname . ' ' .$authority->middlename . '. ' .$authority->lastname);

                $receivers[] = [
                    'id' => $authority->id,
                    'name' => $authorityName
                ];
            }

            $notiMessage = 'There is a request for ' . $requestorName . '.';
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
                'status'           => 0,
                'form_location'    => 0,
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
        $track->remarks = $requestorName.' submitted a request.';
        $track->save();

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'FORM';
        $logs->message = $requestorName.' has submitted a Vehicle Slip request.';
        $logs->save();

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

        // Prev & Next IDs
        $prevId = VehicleSlipModel::where('id', '<', $id)->orderBy('id', 'desc')->value('id');
        $nextId = VehicleSlipModel::where('id', '>', $id)->orderBy('id', 'asc')->value('id');

        $respondData = [
            'next' => $nextId,
            'prev' => $prevId,
            'form' => $VehicleSlipForm,
        ];

        return response()->json($respondData);
    }

    /**
     *  Update Vehicle Slip Details
     */
    public function UpdateVehicleSlip(Request $request, $id){
        $now = Carbon::now();

        // Check if there is already assigned or approve form
        $checkData = VehicleSlipModel::where('id', $id)
            ->whereIn('admin_approval', [1, 2])
            ->first();

        //Validation
        $updateVehicleInfo = $request->validate([
            'purpose' => 'required|string',
            'passengers' => 'required|string',
            'place_visited' => 'required|string',
            'date_arrival' => 'required|date',
            'time_arrival' => 'required|date_format:H:i',
            'vehicle_type' => 'nullable|string',
            'driver_id' => 'nullable|numeric',
            'driver' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        $VehicleSlipData = VehicleSlipModel::find($id);

        if (!$VehicleSlipData) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Update first Vehicle and Driver Assignment
        if($checkData){
            // Update First Vehicle
            // Remove
            if (preg_match('/^(.*?)\s*\((.*?)\)$/', $VehicleSlipData->vehicle_type, $matches)) {
                $vehicleName = trim($matches[1]);
                $plateNumber = trim($matches[2]);
            }

            VehicleTypeModel::where('vehicle_name', $vehicleName)
            ->where('vehicle_plate', $plateNumber)
            ->update([
                'status' => 0,
                'date_used' => null,
            ]);

            // Replace
            if (preg_match('/^(.*?)\s*\((.*?)\)$/', $updateVehicleInfo['vehicle_type'], $matches)) {
                $vehicleName = trim($matches[1]);
                $plateNumber = trim($matches[2]);
            }

            VehicleTypeModel::where('vehicle_name', $vehicleName)
            ->where('vehicle_plate', $plateNumber)
            ->update([
                'status' => 2,
                'date_used' => $VehicleSlipData->date_arrival,
            ]);

            // Update Driver
            // Remove
            AssignPersonnelModel::where('personnel_id', $VehicleSlipData->driver_id)
            ->update([
                'status' => 0,
                'date_assigned' => null,
            ]);

            // Replace
            AssignPersonnelModel::where('personnel_id', $updateVehicleInfo['driver_id'])
            ->update([
                'status' => 2,
                'date_assigned' => $VehicleSlipData->date_arrival,
            ]);
        }

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

                NotificationModel::where('joms_id', $VehicleDataRequest->id)
                ->where('joms_type', 'JOMS_Vehicle')
                ->delete();

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
                }else{
                    // If Regular Requestor send a request
                    $remark = $assignName. " has assigned a vehicle and driver, and is waiting for the Admin Manager's approval.";
                    $approve = 4;
                }
            }else{
                if($Approval == 7) {
                    // If Port Manager send a request
                    $remark = $assignName. " has assigned both a vehicle and a driver.";
                    $approve = 1;
                }else{
                    $remark = $assignName. " has assigned a vehicle and driver, and is waiting for the Port Manager's approval.";
                    $approve = 5;
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
                    'status'           => 0,
                    'form_location'    => 0,
                    'joms_id'          => $VehicleDataRequest->id,
                    'created_at'       => $now,
                    'updated_at'       => $now
                ];

                // Insert notifications in bulk for efficiency
                NotificationModel::insert($notifications);

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
                    'status'           => 0,
                    'form_location'    => 0,
                    'joms_id'          => $VehicleDataRequest->id,
                    'created_at'       => $now,
                    'updated_at'       => $now
                ];
            }  

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

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
                    'status'           => 0,
                    'form_location'    => 0,
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

}