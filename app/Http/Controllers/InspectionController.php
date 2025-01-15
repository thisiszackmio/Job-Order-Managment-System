<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\LogsModel;
use App\Models\PPAEmployee;
use App\Models\NotificationModel;
use App\Http\Requests\InspectionFormRequest;
use Illuminate\Support\Facades\URL;

class InspectionController extends Controller
{

    /**
     * Legends on status on the database (supervisor_status, admin_status, inspector_status, form_status)
     * 
     * Code 1004 - Supervisor Approval
     * Code 1005 - Admin Manager Submit the Form
     * Code 2001 - Supervisor Disapproval
     * Code 1200 - GSO after submit Part B
     * Code 1130 - Admin Manager Approval
     * Code 1120 - Personnel after submit Part C
     * Code 1112 - Personnel after submit Part D / Request to Close
     * Code 1111 - Close Form
     * Code 2023 - Force Close Form
     * 
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
     * Store Inspection Form (Part A)
     */
    public function storeInspectionRequest(InspectionFormRequest $request) {
        $data = $request->validated();
    
        // Create and save the deployment data
        $deploymentData = InspectionModel::create($data);
    
        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }
    
        // Create the notification
        $noti = new NotificationModel();
        $noti->type_of_jlms = "JOMS";
        $noti->sender_avatar = $request->input('sender_avatar');
        $noti->sender_id = $request->input('sender_id');
        $noti->sender_name = $request->input('sender_name');
        $noti->message = $request->input('notif_message');
        $noti->receiver_id = $request->input('receiver_id');
        $noti->receiver_name = $request->input('receiver_name');
        $noti->joms_type = 'JOMS_Inspection';
        $noti->status = 2;
        $noti->joms_id = $deploymentData->id;
    
        // Save the notification and create logs if successful
        if ($noti->save()) {
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $data['user_name'] . ' has submitted the request for Pre/Post Repair Inspection (Control No. '.$deploymentData->id.')';
            $logs->save();
        } else {
            return response()->json(['error' => 'Failed to save notification'], 500);
        }
    
        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Show Inspection Form 
     */
    public function showInspectionForm($id){

        // Root URL
        $rootUrl = URL::to('/');

        $InspectionRequest = InspectionModel::find($id);

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
            'form_status' => $InspectionRequest->form_status,
            'status' => $InspectionRequest->supervisor_status.''.$InspectionRequest->admin_status.''.$InspectionRequest->inspector_status.''.$InspectionRequest->form_status,
        ];

        $respondData = [
            'form' => $form,
            'requestor_esig' => $RequestorEsig,
            'supervisor_esig' => $SupervisorEsig,
            'assign_esig' => $AssignEsig,
            'gso_name' => $GSOName,
            'gso_esig' => $GSOEsig,
            'admin_name' => $AdminName,
            'admin_esig' => $AdminEsig
        ];

        return response()->json($respondData);
    }

    /**
     * Supervisor Approval Function 
     */
    public function approveSupervisor(Request $request, $id) {

        $ApproveRequest = InspectionModel::find($id);
        $getGSO = 'GSO';
        $data = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first(); // Get the GSO ID

        if (!$ApproveRequest) {
            return response()->json(['message' => 'Inspection request not found'], 404);
        }

        // Update a form for supervisor's approval
        $ApproveRequest->supervisor_status = 1; // Code 1 means Supervisor approval
        $ApproveRequest->form_status = 4; 
        $ApproveRequest->form_remarks = "This form was approved by the supervisor.";
        $ApproveRequest->save();

        // Once save it will create a notifications
        if($data->id === $request->input('receiver_id')){

            // Send to the GSO
            $notiGSO2 = new NotificationModel();
            $notiGSO2->type_of_jlms = "JOMS";
            $notiGSO2->sender_avatar = $request->input('sender_avatar');
            $notiGSO2->sender_id = $request->input('sender_id');
            $notiGSO2->sender_name = $request->input('sender_name');
            $notiGSO2->message = 'Your request have been approved by ' . $request->input('sender_name') .'.';
            $notiGSO2->receiver_id = $data->id;
            $notiGSO2->receiver_name = $data->firstname. ' ' .$data->middlename. '. ' .$data->lastname;
            $notiGSO2->joms_type = 'JOMS_Inspection';
            $notiGSO2->status = 2;
            $notiGSO2->joms_id = $ApproveRequest->id; 
            $notiGSO2->save();

        } else {

            // Send to the Requestor
            $noti = new NotificationModel();
            $noti->type_of_jlms = "JOMS";
            $noti->sender_avatar = $request->input('sender_avatar');
            $noti->sender_id = $request->input('sender_id');
            $noti->sender_name = $request->input('sender_name');
            $noti->message = $request->input('notif_message');
            $noti->receiver_id = $request->input('receiver_id');
            $noti->receiver_name = $request->input('receiver_name');
            $noti->joms_type = 'JOMS_Inspection';
            $noti->status = 2;
            $noti->joms_id = $ApproveRequest->id; 
            $noti->save();

            // Send to the GSO
            $notiGSO = new NotificationModel();
            $notiGSO->type_of_jlms = "JOMS";
            $notiGSO->sender_avatar = $request->input('sender_avatar');
            $notiGSO->sender_id = $request->input('sender_id');
            $notiGSO->sender_name = $request->input('sender_name');
            $notiGSO->message = 'The request for ' .$ApproveRequest->user_name. ' was approved by ' .$ApproveRequest->supervisor_name. '.' ;
            $notiGSO->receiver_id = $data->id;
            $notiGSO->receiver_name = $data->firstname. ' ' .$data->middlename. '. ' .$data->lastname;
            $notiGSO->joms_type = 'JOMS_Inspection';
            $notiGSO->status = 2;
            $notiGSO->joms_id = $ApproveRequest->id; 
            $notiGSO->save();

        }

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('sender_name') . ' has approved the request for Pre/Post Repair Inspection (Control No. ' . $ApproveRequest->id . ').';
            $logs->save();

        return response()->json(['message' => 'Supervisor approval and notification saved successfully'], 200);
    }
    
    /**
     * Supervisor Disapproval Function 
     */
    public function disapproveSupervisor(Request $request, $id){

        $DisapproveRequest = InspectionModel::find($id);

        // Update Approve
        $DisapproveRequest->supervisor_status = 2; // Code 2 means Supervisor disapproval
        $DisapproveRequest->form_status = 1; // Code 4 means Supervisor disapproval
        $reason = $request->input('reason');
        if($reason == 'Others'){
            $DisapproveRequest->form_remarks = "Disapproved by Supervisor (Reason: " .$request->input('otherReason'). ")";
        }else{
            $DisapproveRequest->form_remarks = "Disapproved by Supervisor (Reason: " .$request->input('reason'). ")";
        }

        if ($DisapproveRequest->save()) {

            // Send to the Requestor
            $noti = new NotificationModel();
            $noti->type_of_jlms = "JOMS";
            $noti->sender_avatar = $request->input('sender_avatar');
            $noti->sender_id = $request->input('sender_id');
            $noti->sender_name = $request->input('sender_name');
            $noti->message = $request->input('notif_message');
            $noti->receiver_id = $request->input('receiver_id');
            $noti->receiver_name = $request->input('receiver_name');
            $noti->joms_type = 'JOMS_Inspection';
            $noti->status = 2;
            $noti->joms_id = $DisapproveRequest->id; 
            $noti->save();

            // Send back to the GSO
            $checkQueryGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

            $noti1 = new NotificationModel();
            $noti1->type_of_jlms = "JOMS";
            $noti1->sender_avatar = $request->input('sender_avatar');
            $noti1->sender_id = $request->input('sender_id');
            $noti1->sender_name = $request->input('sender_name');
            $noti1->message = 'The request for '.$DisapproveRequest->user_name.' has been disapproved by '.$request->input('sender_name').'. Please see the reason.';
            $noti1->receiver_id = $checkQueryGSO->id;
            $noti1->receiver_name = $checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename. '. ' . $checkQueryGSO->lastname;
            $noti1->joms_type = 'JOMS_Inspection';
            $noti1->status = 2;
            $noti1->joms_id = $DisapproveRequest->id; 
            $noti1->save();

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

    }

     /**
     * Admin Approval Function 
     */
    public function approveAdmin(Request $request, $id){

        $ApproveRequest = InspectionModel::find($id);

        // Update Approve
        $ApproveRequest->admin_status = 1;
        $ApproveRequest->inspector_status = 3; 
        $ApproveRequest->form_remarks = "This form was approved by the admin manager.";

        // Save Update
        if ($ApproveRequest->save()) {

            if($ApproveRequest->user_id === $ApproveRequest->personnel_id){

                $notiPer = new NotificationModel();
                $notiPer->type_of_jlms = "JOMS";
                $notiPer->sender_avatar = $request->input('sender_avatar');
                $notiPer->sender_id = $request->input('sender_id');
                $notiPer->sender_name = $request->input('sender_name');
                $notiPer->message = "Your request has been approved, and you are to assign for this.";
                $notiPer->receiver_id = $ApproveRequest->personnel_id;
                $notiPer->receiver_name = $ApproveRequest->	personnel_name;
                $notiPer->joms_type = 'JOMS_Inspection';
                $notiPer->status = 2;
                $notiPer->joms_id = $ApproveRequest->id; 
                $notiPer->save();

            } else {

                // Send to the Requestor
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('sender_avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = 'Your request has been approved by the Admin Manager';
                $noti->receiver_id = $request->input('receiver_id');
                $noti->receiver_name = $request->input('receiver_name');
                $noti->joms_type = 'JOMS_Inspection';
                $noti->status = 2;
                $noti->joms_id = $ApproveRequest->id; 
                $noti->save();

                // Send to the Assign Personnel
                $notiPer = new NotificationModel();
                $notiPer->type_of_jlms = "JOMS";
                $notiPer->sender_avatar = $request->input('sender_avatar');
                $notiPer->sender_id = $request->input('sender_id');
                $notiPer->sender_name = $request->input('sender_name');
                $notiPer->message = "You have been assigned to this task.";
                $notiPer->receiver_id = $ApproveRequest->personnel_id;
                $notiPer->receiver_name = $ApproveRequest->	personnel_name;
                $notiPer->joms_type = 'JOMS_Inspection';
                $notiPer->status = 2;
                $notiPer->joms_id = $ApproveRequest->id; 
                $notiPer->save();

            }

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

        // Logs
        $logs = new LogsModel();
        $logs->category = 'JOMS';
        $logs->message = $request->input('logs');
        $logs->save();
    }

    /**
     * Update Part A Form
     */
    public function updatePartA(Request $request, $id){

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($InspectionRequest->form_status === 1) {
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            $uPartA = $InspectionRequest->update([
                'property_number' => $request->input('property_number'),
                'acquisition_date' => $request->input('acquisition_date'),
                'acquisition_cost' => $request->input('acquisition_cost'),
                'brand_model' => $request->input('brand_model'),
                'serial_engine_no' => $request->input('serial_engine_no')
            ]);

            if($uPartA){
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
     * Update Part B Form 
     */
    public function updatePartB(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($InspectionRequest->form_status === 1) { 
            return response()->json(['message' => 'Request is already close'], 409);
        } else {

            $uPartB = $InspectionRequest->update([
                'date_of_last_repair' => $request->input('date_of_last_repair'),
                'nature_of_last_repair' => $request->input('nature_of_last_repair'),
                'personnel_id' => $request->input('personnel_id'),
                'personnel_name' => $request->input('personnel_name')
            ]);
    
            if($uPartB){
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
                'remarks' => $request->input('remarks'),
            ]);
    
            if($uPartC){
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
     * Submit Part B Form 
     */
    public function submitPartB(Request $request, $id){

        // Validate the Part B Form
        $validatePartB = $request->validate([
            'date_of_filling' => 'required|date',
            'date_of_last_repair' => 'nullable|date',
            'nature_of_last_repair' => 'nullable|string',
            'personnel_id' => 'required|numeric',
            'personnel_name' => 'required|string',
            'form_remarks' => 'required|string',
        ]);

        $InspectionRequest = InspectionModel::find($id);

        $getAM = 'AM';
        $data = PPAEmployee::where('code_clearance', 'LIKE', "%{$getAM}%")->first(); 

        $getGSO = 'GSO';
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update Data
        $sPartB = $InspectionRequest->update([
            'date_of_filling' =>  $validatePartB['date_of_filling'],
            'date_of_last_repair' => $validatePartB['date_of_last_repair'],
            'nature_of_last_repair' => $validatePartB['nature_of_last_repair'],
            'personnel_id' => $validatePartB['personnel_id'],
            'personnel_name' => $validatePartB['personnel_name'],
            'form_remarks' => $validatePartB['form_remarks'],
            'form_status' => 0,
            'admin_status' => $request->input('admin_status'),
            'inspector_status' => $request->input('inspector_status'),
        ]);

        if($sPartB){

            if($dataGSO->id === $InspectionRequest->user_id) { 

                // If the GSO Submits the Request
                $notiAdmin = new NotificationModel();
                $notiAdmin->type_of_jlms = "JOMS";
                $notiAdmin->sender_avatar = $request->input('sender_avatar');
                $notiAdmin->sender_id = $request->input('sender_id');
                $notiAdmin->sender_name = $request->input('sender_name');
                $notiAdmin->message = $request->input('sender_name').' has filled out the Part B Form and is waiting for your approval.';
                $notiAdmin->receiver_id = $data->id;
                $notiAdmin->receiver_name = $data->firstname. ' ' .$data->middlename. '. ' .$data->lastname;
                $notiAdmin->joms_type = 'JOMS_Inspection';
                $notiAdmin->status = 2;
                $notiAdmin->joms_id = $InspectionRequest->id; 
                $notiAdmin->save();

            } else if($data->id === $InspectionRequest->user_id){

                $PersonnelDet = PPAEmployee::find($InspectionRequest->personnel_id);

                // If the Admin Submits the Request
                $notiAdmin = new NotificationModel();
                $notiAdmin->type_of_jlms = "JOMS";
                $notiAdmin->sender_avatar = $request->input('sender_avatar');
                $notiAdmin->sender_id = $request->input('sender_id');
                $notiAdmin->sender_name = $request->input('sender_name');
                $notiAdmin->message = 'Your request has filled out the Part B by the GSO.' ;
                $notiAdmin->receiver_id = $data->id;
                $notiAdmin->receiver_name = $data->firstname. ' ' .$data->middlename. '. ' .$data->lastname;
                $notiAdmin->joms_type = 'JOMS_Inspection';
                $notiAdmin->status = 2;
                $notiAdmin->joms_id = $InspectionRequest->id; 
                $notiAdmin->save();

                // It sends to the Personnel
                $notiPerso = new NotificationModel();
                $notiPerso->type_of_jlms = "JOMS";
                $notiPerso->sender_avatar = $dataGSO->avatar;
                $notiPerso->sender_id = $dataGSO->id;
                $notiPerso->sender_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $notiPerso->message = 'You have been assigned to this task.' ;
                $notiPerso->receiver_id = $PersonnelDet->id;
                $notiPerso->receiver_name = $PersonnelDet->firstname. ' ' .$PersonnelDet->middlename. '. ' .$PersonnelDet->lastname;
                $notiPerso->joms_type = 'JOMS_Inspection';
                $notiPerso->status = 2;
                $notiPerso->joms_id = $InspectionRequest->id; 
                $notiPerso->save();
            
            }else{

                // Other sends the request
                $notiAdmin = new NotificationModel();
                $notiAdmin->type_of_jlms = "JOMS";
                $notiAdmin->sender_avatar = $request->input('sender_avatar');
                $notiAdmin->sender_id = $request->input('sender_id');
                $notiAdmin->sender_name = $request->input('sender_name');
                $notiAdmin->message = 'The request for '.$InspectionRequest->user_name.' has filled out the form (Part B) by the GSO, and it needs your approval.';
                $notiAdmin->receiver_id = $data->id;
                $notiAdmin->receiver_name = $data->firstname. ' ' .$data->middlename. '. ' .$data->lastname;
                $notiAdmin->joms_type = 'JOMS_Inspection';
                $notiAdmin->status = 2;
                $notiAdmin->joms_id = $InspectionRequest->id; 
                $notiAdmin->save();

            }

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

    /**
     * Submit Part C Form 
     */
    public function submitPartC(Request $request, $id){

        // Validate the Part C Form
        $validatePartC = $request->validate([
            'before_repair_date' => 'required|date',
            'findings' => 'required|string',
            'recommendations' => 'required|string',
            'form_remarks' => 'required|string',
        ]);

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update Data
        $sPartC = $InspectionRequest->update([
            'before_repair_date' =>  $validatePartC['before_repair_date'],
            'findings' => $validatePartC['findings'],
            'recommendations' => $validatePartC['recommendations'],
            'form_remarks' => $validatePartC['form_remarks'],
            'inspector_status' => 2,
        ]);

        if($sPartC){

            // Send to the Assign Perosnnel for Part D
            $notiPer = new NotificationModel();
            $notiPer->type_of_jlms = "JOMS";
            $notiPer->sender_avatar = $request->input('sender_avatar');
            $notiPer->sender_id = $request->input('sender_id');
            $notiPer->sender_name = $request->input('sender_name');
            $notiPer->message = "You still need to fill out the Part D.";
            $notiPer->receiver_id = $request->input('sender_id');
            $notiPer->receiver_name = $request->input('sender_name');
            $notiPer->joms_type = 'JOMS_Inspection';
            $notiPer->status = 2;
            $notiPer->joms_id = $InspectionRequest->id; 
            $notiPer->save();

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

    /**
     * Submit Part D Form 
     */
    public function submitPartD(Request $request, $id){

        // Validate the Part B Form
        $validatePartD = $request->validate([
            'after_reapir_date' => 'required|date',
            'remarks' => 'required|string',
            'form_remarks' => 'required|string',
        ]);

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update Data
        $sPartD = $InspectionRequest->update([
            'after_reapir_date' =>  $validatePartD['after_reapir_date'],
            'remarks' => $validatePartD['remarks'],
            'form_remarks' => $validatePartD['form_remarks'],
            'inspector_status' => 1,
            'form_status' => 2
        ]);

        if($sPartD){

            $getGSO = 'GSO';
            $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

            if($dataGSO->id === $request->input('receiver_id')){

                // Send for the Requestor
                $notiGSO = new NotificationModel();
                $notiGSO->type_of_jlms = "JOMS";
                $notiGSO->sender_avatar = $request->input('sender_avatar');
                $notiGSO->sender_id = $request->input('sender_id');
                $notiGSO->sender_name = $request->input('sender_name');
                $notiGSO->message = "Your request is finished.";
                $notiGSO->receiver_id = $dataGSO->id;
                $notiGSO->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $notiGSO->joms_type = 'JOMS_Inspection';
                $notiGSO->status = 2;
                $notiGSO->joms_id = $InspectionRequest->id; 
                $notiGSO->save();

            }else{

                if($InspectionRequest->user_id != $InspectionRequest->personnel_id){
                    // Send for the Requestor
                    $noti = new NotificationModel();
                    $noti->type_of_jlms = "JOMS";
                    $noti->sender_avatar = $request->input('sender_avatar');
                    $noti->sender_id = $request->input('sender_id');
                    $noti->sender_name = $request->input('sender_name');
                    $noti->message = "Your request has been completed. Please check it here.";
                    $noti->receiver_id = $request->input('receiver_id');
                    $noti->receiver_name = $request->input('receiver_name');
                    $noti->joms_type = 'JOMS_Inspection';
                    $noti->status = 2;
                    $noti->joms_id = $InspectionRequest->id; 
                    $noti->save();

                    // Send for the GSO
                    $notiGSO = new NotificationModel();
                    $notiGSO->type_of_jlms = "JOMS";
                    $notiGSO->sender_avatar = $request->input('sender_avatar');
                    $notiGSO->sender_id = $request->input('sender_id');
                    $notiGSO->sender_name = $request->input('sender_name');
                    $notiGSO->message = "The request for ".$InspectionRequest->user_name." is complete.";
                    $notiGSO->receiver_id = $dataGSO->id;
                    $notiGSO->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                    $notiGSO->joms_type = 'JOMS_Inspection';
                    $notiGSO->status = 2;
                    $notiGSO->joms_id = $InspectionRequest->id; 
                    $notiGSO->save();
                } else {

                    // Send for the GSO
                    $notiGSO = new NotificationModel();
                    $notiGSO->type_of_jlms = "JOMS";
                    $notiGSO->sender_avatar = $request->input('sender_avatar');
                    $notiGSO->sender_id = $request->input('sender_id');
                    $notiGSO->sender_name = $request->input('sender_name');
                    $notiGSO->message = "The request for ".$InspectionRequest->user_name." is complete.";
                    $notiGSO->receiver_id = $dataGSO->id;
                    $notiGSO->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                    $notiGSO->joms_type = 'JOMS_Inspection';
                    $notiGSO->status = 2;
                    $notiGSO->joms_id = $InspectionRequest->id; 
                    $notiGSO->save();

                }


            }

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

     /**
     * Close Request 
     */
    public function closeRequest(Request $request, $id){

        $ApproveRequest = InspectionModel::find($id);

        // Update Approve
        $ApproveRequest->form_status = 1;
        $ApproveRequest->form_remarks = "This form is closed.";

        // Save Update
        if ($ApproveRequest->save()) {

            $Noti = NotificationModel::where('joms_id', $ApproveRequest->id)->where('joms_type', 'JOMS_Inspection')->get();

            // Loop through each notification and update status
            foreach ($Noti as $notification) {
                $notification->status = 1;

                if ($notification->save()) {
                    // Log only if saving the notification is successful
                    $logs = new LogsModel();
                    $logs->category = 'JOMS';
                    $logs->message = $request->input('logs');
                    $logs->save();
                }
            }

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Close Force Request 
     */
    public function closeRequestForce(Request $request, $id){

        $ApproveRequest = InspectionModel::find($id);

        // Update Approve
        $ApproveRequest->supervisor_status = 2;
        $ApproveRequest->admin_status = 0;
        $ApproveRequest->inspector_status = 2;
        $ApproveRequest->form_status = 3;
        $ApproveRequest->form_remarks = "This form has been closed by the GSO.";

        // Save Update
        if ($ApproveRequest->save()) {

            $Noti = NotificationModel::where('joms_id', $ApproveRequest->id)->where('joms_type', 'JOMS_Inspection')->get();

            // Loop through each notification and update status
            foreach ($Noti as $notification) {
                $notification->status = 3;

                if ($notification->save()) {
                    // Log only if saving the notification is successful
                    $logs = new LogsModel();
                    $logs->category = 'JOMS';
                    $logs->message = $request->input('logs');
                    $logs->save();
                }
            }

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

}
