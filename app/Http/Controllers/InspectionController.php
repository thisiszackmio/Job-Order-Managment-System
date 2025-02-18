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
     * Code 1004 - Supervisor and Port Manager Approval
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
            'form_status' => $InspectionRequest->form_status,
            'admin_status' => $InspectionRequest->admin_status,
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
        $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%{$getAM}%")->first(); 

        $getGSO = 'GSO';
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

        $dataReq = PPAEmployee::where('id', $InspectionRequest->user_id)->first();

        $PersonnelDet = PPAEmployee::find($InspectionRequest->personnel_id);

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

            if($InspectionRequest->user_id === $dataAM->id){
                // If Admin (Send a notification)
                $notiAdmin = new NotificationModel();
                $notiAdmin->type_of_jlms = "JOMS";
                $notiAdmin->sender_avatar = $dataGSO->avatar;
                $notiAdmin->sender_id = $dataGSO->id;
                $notiAdmin->sender_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $notiAdmin->message = 'Your request has filled out the Part B by the GSO.' ;
                $notiAdmin->receiver_id = $dataAM->id;
                $notiAdmin->receiver_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
                $notiAdmin->joms_type = 'JOMS_Inspection';
                $notiAdmin->status = 2;
                $notiAdmin->joms_id = $InspectionRequest->id; 
                $notiAdmin->save();

                // Send to the Assign Personnel
                $notiPerso = new NotificationModel();
                $notiPerso->type_of_jlms = "JOMS";
                $notiPerso->sender_avatar = $dataAM->avatar;
                $notiPerso->sender_id = $dataAM->id;
                $notiPerso->sender_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
                $notiPerso->message = 'You have been assigned to this task.' ;
                $notiPerso->receiver_id = $PersonnelDet->id;
                $notiPerso->receiver_name = $PersonnelDet->firstname. ' ' .$PersonnelDet->middlename. '. ' .$PersonnelDet->lastname;
                $notiPerso->joms_type = 'JOMS_Inspection';
                $notiPerso->status = 2;
                $notiPerso->joms_id = $InspectionRequest->id; 
                $notiPerso->save();
            } else if($InspectionRequest->user_id === $dataGSO->id){
                // If GSO (Send to the Admin Manager)
                $notiAdmin = new NotificationModel();
                $notiAdmin->type_of_jlms = "JOMS";
                $notiAdmin->sender_avatar = $dataGSO->avatar;
                $notiAdmin->sender_id = $dataGSO->id;
                $notiAdmin->sender_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $notiAdmin->message = $InspectionRequest->user_name.' has filled out the Part B Form and is waiting for your approval.' ;
                $notiAdmin->receiver_id = $dataAM->id;
                $notiAdmin->receiver_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
                $notiAdmin->joms_type = 'JOMS_Inspection';
                $notiAdmin->status = 2;
                $notiAdmin->joms_id = $InspectionRequest->id; 
                $notiAdmin->save();
            } else {
                // If Division Manager, Port Manager, GSO and User Personnel (Send to the Admin Manager)
                $notiReq = new NotificationModel();
                $notiReq->type_of_jlms = "JOMS";
                $notiReq->sender_avatar = $dataGSO->avatar;
                $notiReq->sender_id = $dataGSO->id;
                $notiReq->sender_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $notiReq->message = 'The request for '.$InspectionRequest->user_name.' has filled out the form (Part B) by the GSO, and it needs your approval.';
                $notiReq->receiver_id = $dataAM->id;
                $notiReq->receiver_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
                $notiReq->joms_type = 'JOMS_Inspection';
                $notiReq->status = 2;
                $notiReq->joms_id = $InspectionRequest->id; 
                $notiReq->save();
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

        $getAM = 'AM';
        $data = PPAEmployee::where('code_clearance', 'LIKE', "%{$getAM}%")->first(); 

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
                'recommendations' => $request->input('recommendations'),
                'before_repair_date' => $request->input('today')
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

            if($InspectionRequest->user_id === $dataGSO->id){
                // Send back for the GSO
                $notiGSO = new NotificationModel();
                $notiGSO->type_of_jlms = "JOMS";
                $notiGSO->sender_avatar = $request->input('sender_avatar');
                $notiGSO->sender_id = $request->input('sender_id');
                $notiGSO->sender_name = $request->input('sender_name');
                $notiGSO->message = "Your request has been completed.";
                $notiGSO->receiver_id = $InspectionRequest->user_id;
                $notiGSO->receiver_name = $InspectionRequest->user_name;
                $notiGSO->joms_type = 'JOMS_Inspection';
                $notiGSO->status = 2;
                $notiGSO->joms_id = $InspectionRequest->id; 
                $notiGSO->save();
            } else if($InspectionRequest->user_id === $InspectionRequest->personnel_id){
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
                // Send for the Requestor
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('sender_avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = "Your request has been completed.";
                $noti->receiver_id = $InspectionRequest->user_id;
                $noti->receiver_name = $InspectionRequest->user_name;
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
     * Supervisor Approval Function 
     */
    public function approveSupervisor(Request $request, $id) {

        $ApproveRequest = InspectionModel::find($id);

        $getGSO = 'GSO';
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first(); // Get the GSO ID

        if (!$ApproveRequest) {
            return response()->json(['message' => 'Inspection request not found'], 404);
        }

        // Update a form for supervisor's approval
        $ApproveRequest->supervisor_status = 1; // Code 1 means Supervisor approval
        $ApproveRequest->form_status = 4; 
        $ApproveRequest->form_remarks = "This form was approved by the supervisor.";
        $ApproveRequest->save();

        if($ApproveRequest->user_id === $dataGSO->id){
            // Send Back to the GSO
            $notiGSO = new NotificationModel();
            $notiGSO->type_of_jlms = "JOMS";
            $notiGSO->sender_avatar = $request->input('sender_avatar');
            $notiGSO->sender_id = $request->input('sender_id');
            $notiGSO->sender_name = $request->input('sender_name');
            $notiGSO->message = 'Your request have been approved by ' . $request->input('sender_name') .'.';
            $notiGSO->receiver_id = $ApproveRequest->user_id;
            $notiGSO->receiver_name = $ApproveRequest->user_name;
            $notiGSO->joms_type = 'JOMS_Inspection';
            $notiGSO->status = 2;
            $notiGSO->joms_id = $ApproveRequest->id; 
            $notiGSO->save();
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
            $notiGSO->receiver_id = $dataGSO->id;
            $notiGSO->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
            $notiGSO->joms_type = 'JOMS_Inspection';
            $notiGSO->status = 2;
            $notiGSO->joms_id = $ApproveRequest->id; 
            $notiGSO->save();
        }

        // Logs
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

        // Send back to the GSO
        $checkQueryGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();

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

            if($DisapproveRequest->user_id === $checkQueryGSO->id){
                // Send to the GSO
                $notiGSO = new NotificationModel();
                $notiGSO->type_of_jlms = "JOMS";
                $notiGSO->sender_avatar = $request->input('sender_avatar');
                $notiGSO->sender_id = $request->input('sender_id');
                $notiGSO->sender_name = $request->input('sender_name');
                $notiGSO->message = 'Your request has been disapproved.';
                $notiGSO->receiver_id = $checkQueryGSO->id;
                $notiGSO->receiver_name = $checkQueryGSO->firstname . ' ' . $checkQueryGSO->middlename. '. ' . $checkQueryGSO->lastname;
                $notiGSO->joms_type = 'JOMS_Inspection';
                $notiGSO->status = 2;
                $notiGSO->joms_id = $DisapproveRequest->id; 
                $notiGSO->save();
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
                $noti->joms_id = $DisapproveRequest->id; 
                $noti->save();
                
                // Send to the GSO
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
            }

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

        $getAM = 'AM';
        $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%{$getAM}%")->first(); 

        // Update Approve
        $ApproveRequest->admin_status = 1;
        $ApproveRequest->inspector_status = 3; 
        $ApproveRequest->form_remarks = "This form was approved by the admin manager.";

        // Save Update
        if ($ApproveRequest->save()) {

            if($ApproveRequest->user_id === $ApproveRequest->personnel_id){
                $notiPer = new NotificationModel();
                $notiPer->type_of_jlms = "JOMS";
                $notiPer->sender_avatar = $dataAM->avatar;
                $notiPer->sender_id = $dataAM->id;
                $notiPer->sender_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
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
                $noti->sender_avatar = $dataAM->avatar;
                $noti->sender_id = $dataAM->id;
                $noti->sender_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
                $noti->message = 'Your request has been approved by the Admin Manager';
                $noti->receiver_id = $ApproveRequest->user_id;
                $noti->receiver_name = $ApproveRequest->user_name;
                $noti->joms_type = 'JOMS_Inspection';
                $noti->status = 2;
                $noti->joms_id = $ApproveRequest->id; 
                $noti->save();

                // Send to the Assign Personnel
                $notiPer = new NotificationModel();
                $notiPer->type_of_jlms = "JOMS";
                $notiPer->sender_avatar = $dataAM->avatar;
                $notiPer->sender_id = $dataAM->id;
                $notiPer->sender_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
                $notiPer->message = "You have been assigned to this task.";
                $notiPer->receiver_id = $ApproveRequest->personnel_id;
                $notiPer->receiver_name = $ApproveRequest->personnel_name;
                $notiPer->joms_type = 'JOMS_Inspection';
                $notiPer->status = 2;
                $notiPer->joms_id = $ApproveRequest->id; 
                $notiPer->save();
            }

            // Logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');


        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
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

            // Log only if saving the notification is successful
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();


        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Delete Form 
     */
    public function closeRequestForce(Request $request, $id){

        $ApproveRequest = InspectionModel::find($id);

        // Update Approve
        $ApproveRequest->supervisor_status = 2;
        $ApproveRequest->admin_status = 0;
        $ApproveRequest->inspector_status = 2;
        $ApproveRequest->form_status = 3;
        $ApproveRequest->form_remarks = "This form has been delete by the GSO.";

        // Save Update
        if ($ApproveRequest->save()) {

            $Noti = NotificationModel::where('joms_id', $ApproveRequest->id)->where('joms_type', 'JOMS_Inspection')->get();

            // Loop through each notification and update status
            foreach ($Noti as $notification) {
                $notification->status = 0;

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
