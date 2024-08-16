<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\LogsModel;
use App\Models\PPAEmployee;
use App\Http\Requests\InspectionFormRequest;
use Illuminate\Support\Facades\URL;

class InspectionController extends Controller
{

    /**
     * Legends on status on the database (supervisor_status, admin_status, inspector_status, form_status)
     * 
     * Code 1004 - Supervisor Approval
     * Code 2001 - Supervisor Disapproval
     * Code 1200 - GSO after submit Part B
     * Code 1130 - Admin Manager Approval
     * Code 1120 - Personnel after submit Part C
     * Code 1112 - Personnel after submit Part D / Request to Close
     * Code 1111 - Close Form
     * 
     */

    /**
     * Store Inspection Form (Part A)
     */
    public function storeInspectionRequest(InspectionFormRequest $request){
        $data = $request->validated();

        $deploymentData = InspectionModel::create($data);
        $deploymentData->save();

        if(!$deploymentData){
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Logs
        $logs = new LogsModel();
        $logs->category = 'JOMS';
        $logs->message = $data['user_name']. ' has submitted the request for Pre/Post Repair Inspection.';
        $logs->save();

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
    public function approveSupervisor(Request $request, $id){

        $ApproveRequest = InspectionModel::find($id);

        // Update Approve
        $ApproveRequest->supervisor_status = 1; // Code 1 means Supervisor approval
        $ApproveRequest->form_status = 4; 
        $ApproveRequest->form_remarks = "This form was approved by the supervisor.";

        // Save Update
        if ($ApproveRequest->save()) {

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
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

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Update Part A Form
     */
    public function updatePartA(Request $request, $id){

        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

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

    /**
     * Update Part B Form 
     */
    public function updatePartB(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

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

    /**
     * Update Part C Form 
     */
    public function updatePartC(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

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

    /**
     * Update Part D Form 
     */
    public function updatePartD(Request $request, $id){
        $InspectionRequest = InspectionModel::find($id);

        if (!$InspectionRequest) {
            return response()->json(['message' => 'User not found.'], 404);
        }

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
            'admin_status' => 2,
        ]);

        if($sPartB){
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

        // Validate the Part B Form
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

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

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
        $ApproveRequest->form_remarks = "This form is closed.";

        // Save Update
        if ($ApproveRequest->save()) {

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

}
