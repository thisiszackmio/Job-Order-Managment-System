<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\LogsModel;
use App\Models\PPAEmployee;
use App\Models\NotificationModel;
use App\Http\Requests\InspectionFormRequest;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class InspectionController extends Controller
{

    /**
     * 
     * Code Number on each status request (Store it on Form Status)
     * 
     * 0 - Cancel Form
     * 1 - Form Closed (Auto after 24 hours) 
     * 2 - Inspection after input Part D information
     * 3 - Inspection after input Part C information
     * 4 - Admin Approval
     * 5 - GSO after input Part B
     * 6 - Supervisor Approval
     * 7 - Supervisor Disapproval
     * 8 - Port Manager Requestor
     * 9 - Admin Manager Requestor
     * 10 - Supervisor Requestor
     * 11 - Regaular Requestor
     * 12 - GSO Access the Part D
     * 13 - GSO Access the Part C
     * 
     */

    /**
     * Get all the Request List 
     */
    public function index(){
        // For Inspection Form
        $getInspectionFormData = InspectionModel::orderBy('created_at', 'desc')->get();

        $inspDet = $getInspectionFormData->map(function ($inspectionForm) {
            return[
                'id' => $inspectionForm->id,
                'date_request' => $inspectionForm->created_at,
                'property_number' => $inspectionForm->property_number,
                'acquisition_date' => $inspectionForm->acquisition_date,
                'acquisition_cost' => $inspectionForm->acquisition_cost,
                'brand_model' => $inspectionForm->brand_model,
                'serial_engine_no' => $inspectionForm->serial_engine_no,
                'type' => $inspectionForm->type_of_property,
                'description' => $inspectionForm->property_description,
                'location' => $inspectionForm->location,
                'complain' => $inspectionForm->complain,
                'requestor' => $inspectionForm->user_name,
                'remarks' => $inspectionForm->form_remarks
            ];
        });

        return response()->json($inspDet);
    }

    /**
     * Show Inspection Form 
     */
    public function showInspectionForm($id){
        // Root URL
        $rootUrl = URL::to('/');

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['error' => 'No-Form'], 404);
        }

        // Requestor Esig
        $RequestorEsigRequest = $SupervisorEsigRequest = PPAEmployee::where('id', $InspectionRequest->user_id)->first();
        $RequestorEsig = $rootUrl . '/storage/displayesig/' . $RequestorEsigRequest->esign;

        // Supervisor Esig
        $SupervisorEsigRequest = PPAEmployee::where('id', $InspectionRequest->supervisor_id)->first();
        $SupervisorEsig = $rootUrl . '/storage/displayesig/' . $SupervisorEsigRequest->esign;

        // Assign Personnel Esig
        $AssignEsigRequest = PPAEmployee::where('id', $InspectionRequest->personnel_id)->first();
        $AssignEsig = $AssignEsigRequest && $AssignEsigRequest->esign 
        ? $rootUrl . '/storage/displayesig/' . $AssignEsigRequest->esign 
        : null;

        // GSO Esig and Name
        $GSOEsigRequest = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $GSOName = $GSOEsigRequest->firstname . ' ' . $GSOEsigRequest->middlename. '. ' . $GSOEsigRequest->lastname;
        $GSOEsig = $rootUrl . '/storage/displayesig/' . $GSOEsigRequest->esign;

        // Admin Esig
        $AdminEsigRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $AdminName = $AdminEsigRequest->firstname . ' ' . $AdminEsigRequest->middlename. '. ' . $AdminEsigRequest->lastname;
        $AdminEsig = $rootUrl . '/storage/displayesig/' . $AdminEsigRequest->esign;

        // Custom form data with limited fields
        $form = [
            'id' => $InspectionRequest->id,
            'date_request' => $InspectionRequest->created_at, 
            'user_id' => $InspectionRequest->user_id,
            'user_name' => $InspectionRequest->user_name,
            'property_number' => $InspectionRequest->property_number,
            'acquisition_date' => $InspectionRequest->acquisition_date,
            'acquisition_cost' => $InspectionRequest->acquisition_cost,
            'brand_model' => $InspectionRequest->brand_model,
            'serial_engine_no' => $InspectionRequest->serial_engine_no,
            'type_of_property' => $InspectionRequest->type_of_property,
            'property_description' => $InspectionRequest->property_description,
            'location' => $InspectionRequest->location,
            'complain' => $InspectionRequest->complain,
            'date_of_filling' => $InspectionRequest->date_of_filling,
            'date_of_last_repair' => $InspectionRequest->date_of_last_repair,
            'nature_of_last_repair' => $InspectionRequest->nature_of_last_repair,
            'before_repair_date' => $InspectionRequest->before_repair_date,
            'findings' => $InspectionRequest->findings,
            'recommendations' => $InspectionRequest->recommendations,
            'after_reapir_date' => $InspectionRequest->after_reapir_date,
            'remarks' => $InspectionRequest->remarks,
            'personnel_id' => $InspectionRequest->personnel_id,
            'personnel_name' => $InspectionRequest->personnel_name,
            'supervisor_id' => $InspectionRequest->supervisor_id,
            'supervisor_name' => $InspectionRequest->supervisor_name,
            'form_remarks' => $InspectionRequest->form_remarks,
            'sup_status' => $InspectionRequest->supervisor_status,
            'admin_status' => $InspectionRequest->admin_status,
            'insp_status' => $InspectionRequest->inspector_status,
            'form_status' => $InspectionRequest->form_status,
        ];

        $respondData = [
            'form' => $form,
            'requestor_esig' => $RequestorEsig,
            'supervisor_esig' => $SupervisorEsig,
            'assign_esig' => $AssignEsig,
            'gso_name' => $GSOName,
            'gso_esig' => $GSOEsig,
            'admin_name' => $AdminName,
            'admin_esig' => $AdminEsig,
            'gso_id' => $GSOEsigRequest->id
        ];

        return response()->json($respondData);
    }

    /**
     * Submit A Request Inspection Form (Part A)
     */
    public function storeInspectionRequest(InspectionFormRequest $request){
        $data = $request->validated();

        if($request->input('form') === "Check"){
            return response()->json(['message' => 'Check'], 200);
        }else{
            // Get the Requestor Data to get the avatar
            $req = PPAEmployee::where('id', $data['user_id'])->first();
            $reqAvatar = $req->avatar;
            $reqCode = $req->code_clearance;
            $codeClearance = array_map('trim', explode(',', $reqCode));

            // Get GSO Information
            $getGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
            $GSOId = $getGSO->id;
            $GSOName = $getGSO->firstname. ' ' .$getGSO->middlename. '. ' .$getGSO->lastname;

            // Create and save the deployment data
            $deploymentData = InspectionModel::create($data);
        
            if (!$deploymentData) {
                return response()->json(['error' => 'Data Error'], 500);
            }

            // Condition Area
            $allowedCodes = ["AM", "DM", "PM"];
            $notiMessage = '';
            $receiverId = '';
            $receiverName = '';

            if(!empty(array_intersect($allowedCodes, $codeClearance))){
                $notiMessage = $data['user_name']." has submitted a request.";
                $receiverId = $GSOId;
                $receiverName = $GSOName;
            } else {
                $notiMessage = $data['user_name']." has submitted a request and needs your approval.";
                $receiverId = $data['supervisor_id'];
                $receiverName = $data['supervisor_name'];
            }

            // Create the notification
            $noti = new NotificationModel();
            $noti->type_of_jlms = "JOMS";
            $noti->sender_avatar = $reqAvatar;
            $noti->sender_id = $data['user_id'];
            $noti->sender_name = $data['user_name'];
            $noti->message = $notiMessage;
            $noti->receiver_id = $receiverId;
            $noti->receiver_name = $receiverName;
            $noti->joms_type = 'JOMS_Inspection';
            $noti->status = 2;
            $noti->form_location = $data['form_status'];
            $noti->joms_id = $deploymentData->id;

            // Save the notification and create logs if successful
            if ($noti->save()) {
                // Create logs
                $logs = new LogsModel();
                $logs->category = 'INSP';
                $logs->message = $data['user_name'] . ' has submitted the request for Pre/Post Repair Inspection.';
                $logs->save();
            } else {
                return response()->json(['error' => 'Failed to save notification'], 500);
            }

            
            return response()->json(['message' => 'Deployment data created successfully'], 200);
            }
    }
    
    /**
     * Update Part A Form
     */
    public function updatePartA(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);
        $codeClearance = explode(', ', $request->input('code'));

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($InspectionRequest->supervisor_status === 1 && !in_array("GSO", $codeClearance)) {
            return response()->json(['message' => 'Closed'], 408);
        }

        if ($InspectionRequest->form_status === 1) {
            return response()->json(['message' => 'Request is already close'], 409);
        } else {
            $uPartA = $InspectionRequest->update([
                'property_number' => $request->input('property_number'),
                'acquisition_date' => $request->input('acquisition_date'),
                'acquisition_cost' => $request->input('acquisition_cost'),
                'brand_model' => $request->input('brand_model'),
                'serial_engine_no' => $request->input('serial_engine_no'),
                'type_of_property' => $request->input('type_of_property'),
                'property_description' => $request->input('property_description'),
                'location' => $request->input('location'),
                'complain' => $request->input('complain')
            ]);

            if($uPartA){
                // Logs
                $logs = new LogsModel();
                $logs->category = 'INSP';
                $logs->message = $request->input('user_name').' has updated Part A of the Pre/Post Repair Inspection Form (Control No. '.$InspectionRequest->id.').';
                $logs->save();

                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['message' => 'There area some missing.'], 204);
            }
        }

        return response()->json($InspectionRequest);
    }

    /**
     * Supervisor Approval Function 
     */
    public function approveSupervisor(Request $request, $id) {
        // Get the current timestamp
        $now = Carbon::now();

        $ApproveRequest = InspectionModel::find($id);

        // Get GSO Employee
        $GSOData = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

        if (!$ApproveRequest) {
            return response()->json(['message' => 'Inspection request not found'], 404);
        }

        // Update a form for supervisor's approval
        $ApproveRequest->form_status = 6; 
        $ApproveRequest->form_remarks = "The form has been approved by the supervisor.";
        $ApproveRequest->save();

        // Condition Area
        $notifications = [];

        $notiMessage = 'Your request has been approved.';
        $receiverId = $ApproveRequest->user_id;
        $receiverName = $ApproveRequest->user_name;

        // Check if the requestor is the GSO
        $isRequestorGSO = $ApproveRequest->user_id === $GSOData->id;

        // Get the Supervisor Data to get the avatar
        $supId = PPAEmployee::where('id', $ApproveRequest->supervisor_id)->where('code_clearance', 'LIKE', "%DM%")->first();
        $supAvatar = $supId->avatar;

        // If the requestor is NOT GSO, include the supervisor’s name in the message
        if ($ApproveRequest->user_id !== $GSOData->id) {
            $notiMessage = 'Your request has been approved by ' . $ApproveRequest->supervisor_name. '.';
        }

        // Create a Notification if the Requestor is GSO
        if ($GSOData->id === $ApproveRequest->user_id) {
            $requestorGSOnotif = 'Your request has been approved by ' . $ApproveRequest->supervisor_name. '.';
        } else {
            $requestorGSOnotif = 'The request for ' . $ApproveRequest->user_name . ' has been approved by ' . $ApproveRequest->supervisor_name . '.';
        }

        if ($ApproveRequest->save()) {
            // Send to the Requestor
            if (!$isRequestorGSO) {
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $supAvatar,
                    'sender_id' => $ApproveRequest->supervisor_id,
                    'sender_name' => $ApproveRequest->supervisor_name,
                    'message' => $notiMessage,
                    'receiver_id' => $receiverId,
                    'receiver_name' => $receiverName,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => 6,
                    'joms_id' => $ApproveRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Send to the GSO
            $notifications[] = [
                'type_of_jlms' => "JOMS",
                'sender_avatar' => $supAvatar,
                'sender_id' => $ApproveRequest->supervisor_id,
                'sender_name' => $ApproveRequest->supervisor_name,
                'message' => $requestorGSOnotif,
                'receiver_id' => $GSOData->id,
                'receiver_name' => trim($GSOData->firstname . ' ' . $GSOData->middlename . '. ' . $GSOData->lastname),
                'joms_type' => 'JOMS_Inspection',
                'status' => 2,
                'form_location' => 6,
                'joms_id' => $ApproveRequest->id,
                'created_at' => $now,
                'updated_at' => $now
            ];

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $ApproveRequest->id)
            ->where('form_location', 11)
            ->update(['status' => 0]); // Change to 0 for delete the Notification

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

        $logs = new LogsModel();
        $logs->category = 'INSP';
        $logs->message = $ApproveRequest->supervisor_name. ' has approved the request on the Pre/Post Repair Inspection Form (Control No. '. $ApproveRequest->id.').';
        $logs->save();
        
        return response()->json(['message' => 'Form has been approved!'], 200);
    }

    /**
     * Supervisor Disapproval Function 
     */
    public function disapproveSupervisor(Request $request, $id){
        // Get the current timestamp
        $now = Carbon::now();

        // Validate the Part B Form
        $SupReason = $request->validate([
            'reason' => 'required|string',
        ]);

        $DisapproveRequest = InspectionModel::find($id);

        if (!$DisapproveRequest) {
            return response()->json(['message' => 'Inspection request not found'], 404);
        }

        // Send back to the GSO
        $checkQueryGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

        // Get the Requestor Data to get the avatar
        $req = PPAEmployee::where('id', $DisapproveRequest->user_id)->first();
        $reqAvatar = $req->avatar;

        // Get the Supervisor Data to get the avatar
        $supId = PPAEmployee::where('id', $DisapproveRequest->supervisor_id)->where('code_clearance', 'LIKE', "%DM%")->first();
        $supAvatar = $supId->avatar;

        // Condition Area
        $notifications = [];

        $notiMessage = 'Your request has been disapproved.';
        $receiverId = $DisapproveRequest->user_id;
        $receiverName = $DisapproveRequest->user_name;

        // If the requestor is NOT GSO, include the supervisor’s name in the message
        if ($DisapproveRequest->user_id !== $checkQueryGSO->id) {
            $notiMessage = 'Your request has been disapproved by ' . $DisapproveRequest->supervisor_name. '.';
        }

        // Create a Notification if the Requestor is GSO
        if ($checkQueryGSO->id === $DisapproveRequest->user_id) {
            $requestorGSOnotif = 'Your request has been disapproved by ' . $DisapproveRequest->supervisor_name. '.';
        } else {
            $requestorGSOnotif = 'The request for ' . $DisapproveRequest->user_name . ' has been disapproved by ' . $DisapproveRequest->supervisor_name . '.';
        }

        // Check if the requestor is the GSO
        $isRequestorGSO = $DisapproveRequest->user_id === $checkQueryGSO->id;

        // Update Approve
        $DisapproveRequest->form_status = 7; 
        $DisapproveRequest->form_remarks = 'Disapproved by the Supervisor (Reason: '.$SupReason['reason'].').';

        // Notification Function
        if ($DisapproveRequest->save()) {
            // Send back to the Requestor
            if (!$isRequestorGSO) {
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $supAvatar,
                    'sender_id' => $DisapproveRequest->supervisor_id,
                    'sender_name' => $DisapproveRequest->supervisor_name,
                    'message' => $notiMessage,
                    'receiver_id' => $receiverId,
                    'receiver_name' => $receiverName,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => 0,
                    'joms_id' => $DisapproveRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Receive Notification by the GSO
            $notifications[] = [
                'type_of_jlms' => "JOMS",
                'sender_avatar' => $supAvatar,
                'sender_id' => $DisapproveRequest->supervisor_id,
                'sender_name' => $DisapproveRequest->supervisor_name,
                'message' => $requestorGSOnotif,
                'receiver_id' => $checkQueryGSO->id,
                'receiver_name' => trim($checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename . '. ' . $checkQueryGSO->lastname),
                'joms_type' => 'JOMS_Inspection',
                'status' => 2,
                'form_location' => 0,
                'joms_id' => $DisapproveRequest->id,
                'created_at' => $now,
                'updated_at' => $now
            ];

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $DisapproveRequest->id)
            ->where('form_location', '!=', 0)
            ->update(['status' => 0]); // Change to 0 for delete the Notification

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
        
        // Logs
        $logs = new LogsModel();
        $logs->category = 'INSP';
        $logs->message = $DisapproveRequest->supervisor_name. ' has disapproved the request on the Pre/Post Repair Inspection Form (Control No. '. $DisapproveRequest->id.').';
        $logs->save();

        return response()->json(['message' => 'Form has been disapproved!'], 200);
    }

    /**
     * Submit Part B Form 
     */
    public function submitPartB(Request $request, $id){
        // Get the current timestamp
        $now = Carbon::now();

        // Validate the Part B Form
        $validatePartB = $request->validate([
            'date_of_filling' => 'required|date',
            'date_of_last_repair' => 'nullable|date',
            'nature_of_last_repair' => 'nullable|string',
            'personnel_id' => 'required|numeric',
            'personnel_name' => 'required|string',
        ]);

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Get Admin Manager
        $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first(); 
        $idAM = $dataAM->id;
        $avatarAM = $dataAM->avatar;
        $nameAM = $dataAM->firstname.' '.$dataAM->middlename.'. '.$dataAM->lastname;

        // Get GSO
        $dataGSO = PPAEmployee::where('id', $request->input('gsoId'))->where('code_clearance', 'LIKE', "%GSO%")->first();
        $idGSO = $dataGSO->id;
        $avatarGSO = $dataGSO->avatar;
        $nameGSO = $dataGSO->firstname.' '.$dataGSO->middlename.'. '.$dataGSO->lastname;

        // Create a Form Remarks
        if($InspectionRequest->user_id === $dataAM->id){
            $FormRemarks = 'The GSO has filled out Part B of the form and assigned personnel to check it.';
            $FormStat = 4;
        } else {
            $FormRemarks = "The GSO has filled out Part B of the form and is waiting for the admin manager's approval.";
            $FormStat = 5;
        }

        // Update Data
        $sPartB = $InspectionRequest->update([
            'date_of_filling' =>  $validatePartB['date_of_filling'],
            'date_of_last_repair' => $validatePartB['date_of_last_repair'],
            'nature_of_last_repair' => $validatePartB['nature_of_last_repair'],
            'personnel_id' => $validatePartB['personnel_id'],
            'personnel_name' => $validatePartB['personnel_name'],
            'form_remarks' => $FormRemarks,
            'form_status' => $FormStat
        ]);

        // Condition Area
        $notifications = [];

        // If Regular Requestor (Receives the request after submit the Part B Form)
        if($InspectionRequest->user_id == $idAM){
            $receiverID = $InspectionRequest->user_id;
            $receiverName = $InspectionRequest->user_name;
            $notiMessage = "Your request has filled out the Part B by the GSO.";
            $form = 4;
        }else{
            $receiverID = $InspectionRequest->user_id;
            $receiverName = $InspectionRequest->user_name;
            $notiMessage = "The GSO has completed Part B of your request. It is now pending approval from the Admin Manager.";
            $form = 5;
        }   


        if($sPartB){
            // Send back to the Requestor
            if($InspectionRequest->user_id != $idGSO){
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $avatarGSO,
                    'sender_id' => $idGSO,
                    'sender_name' => $nameGSO,
                    'message' => $notiMessage,
                    'receiver_id' => $receiverID,
                    'receiver_name' => $receiverName,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => $form,
                    'joms_id' => $InspectionRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Send to the Admin Mananger
            if($InspectionRequest->user_id != $idAM){
                // Admin not the requestor
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $avatarGSO,
                    'sender_id' => $idGSO,
                    'sender_name' => $nameGSO,
                    'message' => 'The GSO has filled out Part B and is now waiting for your approval.',
                    'receiver_id' => $idAM,
                    'receiver_name' => $nameAM,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => $form,
                    'joms_id' => $InspectionRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }else{
                // Send to the Assign Personnel
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $avatarGSO,
                    'sender_id' => $idGSO,
                    'sender_name' => $nameGSO,
                    'message' => 'You are assigned to this task.',
                    'receiver_id' => $InspectionRequest->personnel_id,
                    'receiver_name' => $InspectionRequest->personnel_name,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => $form,
                    'joms_id' => $InspectionRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }
            

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $InspectionRequest->id)
            ->whereIn('form_location', [6, 8, 9, 10])
            ->update(['status' => 0]); // Change to 0 for delete the Notification

        } else {
            return response()->json(['message' => 'There area some missing.'], 204);
        }

        // Logs
        $logs = new LogsModel();
        $logs->category = 'INSP';
        $logs->message = $nameGSO.' has filled out Part B of the Pre/Post Repair Inspection Form (Control No. '. $InspectionRequest->id.')';
        $logs->save();
    }

    /**
     * Update Part B Form 
     */
    public function updatePartB(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($InspectionRequest->form_status === 1) {
            return response()->json(['message' => 'Request is already close'], 409);
        } else if(in_array($InspectionRequest->form_status, [2, 3, 4, 12, 13]) && $request->input('personnel_id') != $InspectionRequest->personnel_id) {
            return response()->json(['message' => 'Cannot Update'], 408);
        } else {
            $uPartB = $InspectionRequest->update([
                'date_of_filling' => $request->input('date_of_filling'),
                'date_of_last_repair' => $request->input('date_of_last_repair'),
                'nature_of_last_repair' => $request->input('nature_of_last_repair'),
                'personnel_id' => $request->input('personnel_id'),
                'personnel_name' => $request->input('personnel_name')
            ]);

            if($uPartB){
                // Logs
                $logs = new LogsModel();
                $logs->category = 'INSP';
                $logs->message = $request->input('user_name').' has updated Part B of the Pre/Post Repair Inspection Form (Control No. '.$InspectionRequest->id.').';
                $logs->save();
    
                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['message' => 'There area some missing.'], 204);
            }
        }
    }

    /**
     * Admin Approval Function 
     */
    public function approveAdmin(Request $request, $id){
        // Get the current timestamp
        $now = Carbon::now();

        $ApproveRequest = InspectionModel::find($id);

        // Get GSO Employee
        $GSOData = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

        if (!$ApproveRequest) {
            return response()->json(['message' => 'Inspection request not found'], 404);
        }

        // Get the admin data
        $AMData = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%AM%")->first();

        if (!$AMData) {
            return response()->json(['message' => 'Not AM'], 408);
        }

        // Update Approve
        $ApproveRequest->form_status = 4;
        $ApproveRequest->form_remarks = "This form was approved by the admin manager.";

        // Condition Area
        $notifications = [];

        // Check if the requestor is the GSO
        $isRequestorGSO = $ApproveRequest->user_id === $GSOData->id;
        $assignPersonnel = $ApproveRequest->user_id === $ApproveRequest->personnel_id;

        if($ApproveRequest->user_id === $ApproveRequest->personnel_id){
            $notiMessage = 'Your request has been approved, and you are to assign for this.';
            $receiverId = $ApproveRequest->personnel_id;
            $receiverName = $ApproveRequest->personnel_name;
        } else {
            $notiMessage = 'Your request has been approved by the Admin Manager';
            $receiverId = $ApproveRequest->user_id;
            $receiverName = $ApproveRequest->user_name;
        }

        if ($ApproveRequest->save()){
            // Send back to the Requestor
            if (!$isRequestorGSO){
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $AMData->avatar,
                    'sender_id' => $AMData->id,
                    'sender_name' => trim($AMData->firstname . ' ' . $AMData->middlename . '. ' . $AMData->lastname),
                    'message' => $notiMessage,
                    'receiver_id' => $receiverId,
                    'receiver_name' => $receiverName,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => 4,
                    'joms_id' => $ApproveRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }  

            // Send to the Assign Personnel
            if(!$assignPersonnel){
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $AMData->avatar,
                    'sender_id' => $AMData->id,
                    'sender_name' => trim($AMData->firstname . ' ' . $AMData->middlename . '. ' . $AMData->lastname),
                    'message' => 'You have been assigned to this task.',
                    'receiver_id' => $ApproveRequest->personnel_id,
                    'receiver_name' => $ApproveRequest->personnel_name,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => 4,
                    'joms_id' => $ApproveRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Send to the GSO
            if($ApproveRequest->user_id == $GSOData->id){
                $GSOnoti = 'Your request has been approved by the Admin Manager';
            }else{
                $GSOnoti = 'The request for '.$ApproveRequest->user_name.' has been approved by the Admin Manager.';
            }

            $notifications[] = [
                'type_of_jlms' => "JOMS",
                'sender_avatar' => $AMData->avatar,
                'sender_id' => $AMData->id,
                'sender_name' => trim($AMData->firstname . ' ' . $AMData->middlename . '. ' . $AMData->lastname),
                'message' => $GSOnoti,
                'receiver_id' => $GSOData->id,
                'receiver_name' => trim($GSOData->firstname . ' ' . $GSOData->middlename . '. ' . $GSOData->lastname),
                'joms_type' => 'JOMS_Inspection',
                'status' => 2,
                'form_location' => 4,
                'joms_id' => $ApproveRequest->id,
                'created_at' => $now,
                'updated_at' => $now
            ];

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $ApproveRequest->id)
            ->where('form_location', 5)
            ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Logs
            $logs = new LogsModel();
            $logs->category = 'INSP';
            $logs->message = trim($AMData->firstname . ' ' . $AMData->middlename . '. ' . $AMData->lastname). ' has approved the request on the Pre/Post Repair Inspection Form (Control No. '. $ApproveRequest->id.').';
            $logs->save();
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Submit Part C Form 
     */
    public function submitPartC(Request $request, $id){
        // Get the current timestamp
        $now = Carbon::now();

        // Validate the Part C Form
        $validatePartC = $request->validate([
            'before_repair_date' => 'required|date',
            'findings' => 'required|string',
            'recommendations' => 'required|string',
        ]);

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if($InspectionRequest->form_status == 13){
            $formStatus = 12;
            $formRemarks = 'The GSO will fill out the form on Part C.';
        }else{
            $formStatus = 3;
            $formRemarks = $request->input('user_name').' has completed Part C.';
        }

        // Update Data
        $sPartC = $InspectionRequest->update([
            'before_repair_date' =>  $validatePartC['before_repair_date'],
            'findings' => $validatePartC['findings'],
            'recommendations' => $validatePartC['recommendations'],
            'form_remarks' => $formRemarks,
            'form_status' => $formStatus,
        ]);

        if($sPartC){

            // Get the Assign Personnel Avatar
            $dataAss = PPAEmployee::where('id', $InspectionRequest->personnel_id)->first();
            $avatarAss = $dataAss->avatar;

            // Get GSO
            $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
            $idGSO = $dataGSO->id;
            $nameGSO = $dataGSO->firstname.' '.$dataGSO->middlename.'. '.$dataGSO->lastname;

            // Condition Area
            $notifications = [];

            // Send to the GSO
            $notifications[] = [
                'type_of_jlms' => "JOMS",
                'sender_avatar' => $avatarAss,
                'sender_id' => $InspectionRequest->personnel_id,
                'sender_name' => $InspectionRequest->personnel_name,
                'message' => $InspectionRequest->personnel_name.' has finished filling out the Part C.',
                'receiver_id' => $idGSO,
                'receiver_name' => $nameGSO,
                'joms_type' => 'JOMS_Inspection',
                'status' => 2,
                'form_location' => 3,
                'joms_id' => $InspectionRequest->id,
                'created_at' => $now,
                'updated_at' => $now
            ];

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $InspectionRequest->id)
            ->where('form_location', 4)
            ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Logs
            $logs = new LogsModel();
            $logs->category = 'INSP';
            $logs->message = $request->input('user_name').' has filled out Part C of the Pre/Post Repair Inspection Form (Control No. '.$InspectionRequest->id.').';
            $logs->save();

            return response()->json(['message' => 'User details updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'There area some missing.'], 204);
        }
    }

    /**
     * Update Part C Form 
     */
    public function updatePartC(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($InspectionRequest->form_status === 1) { 
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            $uPartC = $InspectionRequest->update([
                'findings' => $request->input('findings'),
                'recommendations' => $request->input('recommendations')
            ]);
    
            if($uPartC){
                // Logs
                $logs = new LogsModel();
                $logs->category = 'INSP';
                $logs->message = $request->input('user_name').' has updated Part C of the Pre/Post Repair Inspection Form (Control No. '.$InspectionRequest->id.').';
                $logs->save();
    
                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['message' => 'There area some missing.'], 204);
            }
        }

    }

    /**
     * Submit Part D Form 
     */
    public function submitPartD(Request $request, $id){
        // Get the current timestamp
        $now = Carbon::now();

        // Validate the Part B Form
        $validatePartD = $request->validate([
            'after_reapir_date' => 'required|date',
            'remarks' => 'required|string',
        ]);

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if($InspectionRequest->form_status == 12){
            $formRemarks = 'The GSO will fill out the form on Part D.';
        }else{
            $formRemarks = $request->input('user_name').' has completed Part D.';
        }

        // Update Data
        $sPartD = $InspectionRequest->update([
            'after_reapir_date' =>  $validatePartD['after_reapir_date'],
            'remarks' => $validatePartD['remarks'],
            'form_remarks' => $formRemarks,
            'form_status' => 2
        ]);

        // Get GSO
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $idGSO = $dataGSO->id;
        $nameGSO = $dataGSO->firstname.' '.$dataGSO->middlename.'. '.$dataGSO->lastname;

        // Get Personnel Avatar
        $dataAP = PPAEmployee::where('id', $InspectionRequest->personnel_id)->first();
        $avatarAP = $dataAP->avatar;

        // Check if the requestor is the GSO
        $isRequestorGSO = $InspectionRequest->user_id === $dataGSO->id;
        $isPersonnel = $InspectionRequest->user_id === $InspectionRequest->personnel_id;

        // For the Requestor
        if($isPersonnel){
            $notiMessage = 'The request for '.$InspectionRequest->user_name.' is complete.';
            $receiverId = $idGSO;
            $receiverName = $nameGSO;
        } else {
            $notiMessage = 'Your request has been completed.';
            $receiverId = $InspectionRequest->user_id;
            $receiverName = $InspectionRequest->user_name;
        }

        // For the GSO
        if($isRequestorGSO){
            $notiMessageGSO = 'Your request has been completed.';
        }else{
            $notiMessageGSO = 'The request for '.$InspectionRequest->user_name.' is complete.';
        }

        // Condition Area
        $notifications = [];

        if($sPartD){
            if ($isRequestorGSO || !$isPersonnel){
                // Send back to the GSO
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $avatarAP,
                    'sender_id' => $InspectionRequest->personnel_id,
                    'sender_name' => $InspectionRequest->personnel_name,
                    'message' => $notiMessageGSO,
                    'receiver_id' => $idGSO,
                    'receiver_name' => $nameGSO,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => 2,
                    'joms_id' => $InspectionRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Send to the Requestor
            if(!$isRequestorGSO){
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $avatarAP,
                    'sender_id' => $InspectionRequest->personnel_id,
                    'sender_name' => $InspectionRequest->personnel_name,
                    'message' => $notiMessage,
                    'receiver_id' => $receiverId,
                    'receiver_name' => $receiverName,
                    'joms_type' => 'JOMS_Inspection',
                    'status' => 2,
                    'form_location' => 2,
                    'joms_id' => $InspectionRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $InspectionRequest->id)
            ->where('form_location', 3)
            ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Logs
            $logs = new LogsModel();
            $logs->category = 'INSP';
            $logs->message = $request->input('user_name').' has filled out Part D of the Pre/Post Repair Inspection Form (Control No. '.$InspectionRequest->id.').';
            $logs->save();

            return response()->json(['message' => 'User details updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'There area some missing.'], 204);
        }
    }

    /**
     * Update Part D Form 
     */
    public function updatePartD(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($InspectionRequest->form_status === 1) { 
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            $uPartC = $InspectionRequest->update([
                'remarks' => $request->input('remarks')
            ]);
    
            if($uPartC){
                // Logs
                $logs = new LogsModel();
                $logs->category = 'INSP';
                $logs->message = $request->input('user_name').' has updated Part D of the Pre/Post Repair Inspection Form (Control No. '.$InspectionRequest->id.').';
                $logs->save();
    
                return response()->json(['message' => 'User details updated successfully.'], 200);
            } else {
                return response()->json(['message' => 'There area some missing.'], 204);
            }
        }


    }

    /**
     * Idle for 24 hours on Assign Personnel 
     */
    public function personnelIdle(Request $request, $id){
        $twentyFourHoursAgo = Carbon::now()->subHours(24);

        $ApproveRequest = InspectionModel::where('id', $id)
                                        ->whereIn('form_status', [3, 4])
                                        ->where('updated_at', '<', $twentyFourHoursAgo)
                                        ->first();

        if ($ApproveRequest) {
            $ApproveRequest->form_status = 13;
            $ApproveRequest->save();

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $ApproveRequest->id)
            ->whereIn('form_location', [4, 3])
            ->update(['status' => 0]); // Change to 0 for delete the Notification
        }

        return response()->json(['message' => 'Idle Activate'], 200);
    }

    /**
     * Close Request 
     */
    public function closeRequest(Request $request, $id){
        $twentyFourHoursAgo = Carbon::now()->subHours(24);

        $ApproveRequest = InspectionModel::where('id', $id)
                                        ->where('form_status', 2)
                                        ->where('updated_at', '<', $twentyFourHoursAgo)
                                        ->first();

        if ($ApproveRequest) {
            // Update the record
            $ApproveRequest->form_status = 1;
            $ApproveRequest->form_remarks = 'Form is closed';
            
            if($ApproveRequest->save()){

                // Update Notification (Para ma wala sa notifacion list)
                NotificationModel::where('joms_type', 'JOMS_Inspection')
                ->where('joms_id', $ApproveRequest->id)
                ->where('form_location', 2)
                ->update(['status' => 0]); // Change to 0 for delete the Notification

                // Log the action
                $logs = new LogsModel();
                $logs->category = 'INSP';
                $logs->message = 'The system has closed the Pre/Post Repair Inspection Form (Control No. ' . $ApproveRequest->id . ').';
                $logs->save();
            }
        
        }

        return response()->json(['message' => 'Form is finished and closed'], 200);
    }

    /**
     * Cancel Form
     */
    public function cancelRequest(Request $request, $id){

        $ApproveRequest = InspectionModel::find($id);

        // Update Approve
        $ApproveRequest->form_status = 0;
        $ApproveRequest->form_remarks = $request->input('user_name'). ' canceled the form request.';

        // Save Update
        if ($ApproveRequest->save()) {

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('joms_type', 'JOMS_Inspection')
            ->where('joms_id', $ApproveRequest->id)
            ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Log only if saving the notification is successful
            $logs = new LogsModel();
            $logs->category = 'INSP';
            $logs->message = $request->input('user_name').' has canceled the request for the Pre/Post Repair Inspection Form (Control No. '.$ApproveRequest->id.').';
            $logs->save();

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

}