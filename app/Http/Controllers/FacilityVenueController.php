<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FacilityVenueModel;
use App\Models\NotificationModel;
use App\Models\PPAEmployee;
use App\Models\LogsModel;
use App\Http\Requests\FacilityFormRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;

class FacilityVenueController extends Controller
{
    /**
     *  Legend
     * 
     *  1 - Admin Approval
     *  2 - Disapprove
     *  3 - Pending Approval
     * 
     */

    public function index(){
        // For Facility Form
        $getFacilityFormData = FacilityVenueModel::orderBy('created_at', 'desc')->get();

        $facDet = $getFacilityFormData->map(function ($facilityForm) {
            return[
                'id' => $facilityForm->id,
                'date_request' => $facilityForm->created_at,
                'request_office' => $facilityForm->request_office,
                'title_activity' => $facilityForm->title_of_activity,
                'date_start' => $facilityForm->date_start,
                'time_start' => $facilityForm->time_start,
                'date_end' => $facilityForm->date_end,
                'time_end' => $facilityForm->time_end,
                'mph' => $facilityForm->mph,
                'conference' => $facilityForm->conference,
                'dorm' => $facilityForm->dorm,
                'other' => $facilityForm->other,
                'requestor' => $facilityForm->user_name,
                'remarks' => $facilityForm->remarks,
            ];
        });

        return response()->json($facDet);
    }

    /**
     *  Check Availability
     */
    public function checkAvailability(Request $request){
        // Validate the form
        $validateAvailability = $request->validate([
            'request_office' => 'required|string',
            'title_of_activity' => 'required|string',
            'date_start' => 'required|date',
            'time_start' => 'required|date_format:H:i',
            'date_end' => 'required|date',
            'time_end' => 'required|date_format:H:i',
        ]);
    
        $currentDateTime = Carbon::now();
    
        // Combine date and time
        $startDateTime = Carbon::createFromFormat('Y-m-d H:i', $validateAvailability['date_start'].' '.$validateAvailability['time_start']);
        $endDateTime = Carbon::createFromFormat('Y-m-d H:i', $validateAvailability['date_end'].' '.$validateAvailability['time_end']);
    
        // Check if at least one facility is selected
        if (!$request->input('mph') && !$request->input('conference') && !$request->input('dorm') && !$request->input('other')) {
            return response()->json(['error' => 'facility'], 422);
        }
    
        // Check if the start date is in the past
        if ($startDateTime < $currentDateTime) {
            return response()->json(['error' => 'invalidDate'], 422);
        }
    
        // Check if the end date is before the start date
        if ($endDateTime < $startDateTime) {
            return response()->json(['error' => 'checkDate'], 422);
        }
    
        // Query to check facility availability
        $facilityRequest = FacilityVenueModel::query()->where('date_start', $validateAvailability['date_start']);
    
        if ($request->input('mph')) { $facilityRequest->where('mph', true); }
        if ($request->input('conference')) { $facilityRequest->where('conference', true); }
        if ($request->input('dorm')) { $facilityRequest->where('dorm', true); }
        if ($request->input('other')) { $facilityRequest->where('other', true); }
    
        $getDataFacs = $facilityRequest->get();
    
        // Loop through and check for availability
        foreach ($getDataFacs as $facility) {
            $facilityStartDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $facility->date_start.' '.$facility->time_start);
            $facilityEndDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $facility->date_end.' '.$facility->time_end);
    
            if ($facility->admin_approval === 3) { 
                return response()->json(['message' => 'Pending']);
            }
    
            if ($facility->admin_approval === 1 || $facility->admin_approval === 2 || 
                ($startDateTime >= $facilityStartDateTime && $startDateTime <= $facilityEndDateTime) ||
                ($endDateTime >= $facilityStartDateTime && $endDateTime <= $facilityEndDateTime)) {
                return response()->json(['message' => 'Not Vacant']);
            }
        }
    
        // If no conflicts, return 'Vacant'
        return response()->json(['message' => 'Vacant']);
    }

    /**
     *  Submit Form
     */
    public function storeFacilityRequest(FacilityFormRequest $request){
        $data = $request->validated();

        // Create and save the deployment data
        $deploymentData = FacilityVenueModel::create($data);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // Get Admin Manager
        $getAdmin = 'AM';
        $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%{$getAdmin}%")->first();

        // Get GSO
        $getGSO = 'GSO';
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

        if($dataAM->id === $deploymentData->user_id){
            // Send to the Admin
            $noti = new NotificationModel();
            $noti->type_of_jlms = "JOMS";
            $noti->sender_avatar = $request->input('sender_avatar');
            $noti->sender_id = $request->input('sender_id');
            $noti->sender_name = $request->input('sender_name');
            $noti->message = $request->input('sender_name') . ' has submitted a request.';
            $noti->receiver_id = $dataGSO->id;
            $noti->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
            $noti->joms_type = 'JOMS_Facility';
            $noti->status = 2;
            $noti->joms_id = $deploymentData->id; 
            $noti->save();
        }else{
            // Send to the Admin
            $noti = new NotificationModel();
            $noti->type_of_jlms = "JOMS";
            $noti->sender_avatar = $request->input('sender_avatar');
            $noti->sender_id = $request->input('sender_id');
            $noti->sender_name = $request->input('sender_name');
            $noti->message = $request->input('sender_name') . ' has submitted a request and is waiting for your approval.';
            $noti->receiver_id = $dataAM->id;
            $noti->receiver_name = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname;
            $noti->joms_type = 'JOMS_Facility';
            $noti->status = 2;
            $noti->joms_id = $deploymentData->id; 
            $noti->save();
        }

        // Save the notification and create logs if successful
        if ($noti->save()) {
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $data['user_name']. ' has submitted the request for Facility/Venue Request Form (Control No. '.$deploymentData->id.')';
            $logs->save();
        } else {
            return response()->json(['error' => 'Failed to save notification'], 500);
        }
    
        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     *  Show Facility / Venue Form
     */
    public function showFacilityVenueForm($id){

        // Root URL
        $rootUrl = URL::to('/');

        $FacilityRequest = FacilityVenueModel::find($id);

        // Check if the facility request exists
        if (!$FacilityRequest) {
            return response()->json(['message' => 'Facility request not found.'], 404);
        }

        // Get Requestor Detail
        $RequestorRequest = PPAEmployee::where('id', $FacilityRequest->user_id)->first();
        $RequestorName = $RequestorRequest->firstname . ' ' . $RequestorRequest->middlename. '. ' . $RequestorRequest->lastname;
        $RequestorEsig = $rootUrl . '/storage/displayesig/' . $RequestorRequest->esign;
        $RequestorPosition = $RequestorRequest->position;

        // Get Admin Manager's Detail
        $AdminEsigRequest = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $AdminName = $AdminEsigRequest->firstname . ' ' . $AdminEsigRequest->middlename. '. ' . $AdminEsigRequest->lastname;
        $AdminEsig = $rootUrl . '/storage/displayesig/' . $AdminEsigRequest->esign;

        $respondData = [
            'form' => $FacilityRequest,
            'admin_name' => $AdminName,
            'admin_esig' => $AdminEsig,
            'req_name' => $RequestorName,
            'req_esig' => $RequestorEsig,
            'req_position' => $RequestorPosition
        ];
        
        return response()->json($respondData);

    }

    /**
     *  Input OPR Instruction
     */
    public function submitOPRInstruction(Request $request, $id) {

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
    
        // Check if the facility request exists
        if (!$facilityRequest) {
            return response()->json(['message' => 'Facility request not found.'], 404);
        }
    
        // Update the OPR instruction
        $facilityRequest->obr_instruct = $request->input('oprInstruct');
    
        // Save the updated facility request
        if ($facilityRequest->save()) {

            $getAdmin = 'AM';
            $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%{$getAdmin}%")->first();

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $dataAM->firstname. ' ' .$dataAM->middlename. '. ' .$dataAM->lastname . ' has entered the OPR instruction on the Facility/Venue Request Form (Control No. '.$facilityRequest->id.').  ';
            $logs->save();

            return response()->json(['message' => 'OPR instruction updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'Failed to update OPR instruction.'], 400);
        }
    }

    /**
     *  Input OPR Action
     */
    public function submitOPRAction(Request $request, $id) {

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
    
        // Check if the facility request exists
        if (!$facilityRequest) {
            return response()->json(['message' => 'Facility request not found.'], 404);
        }
    
        // Update the OPR instruction
        $facilityRequest->obr_comment = $request->input('oprAction');
    
        // Save the updated facility request
        if ($facilityRequest->save()) {

            $getGSO = 'GSO';
            $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname . ' has entered the OPR Action on the Facility/Venue Request Form (Control No. '.$facilityRequest->id.')';
            $logs->save();

            return response()->json(['message' => 'OPR instruction updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'Failed to update OPR instruction.'], 400);
        }
    }

    /**
     *  Admin Approval
     */
    public function adminApproval(Request $request, $id){
        $facilityRequest = FacilityVenueModel::find($id);

        $facilityRequest->admin_approval = 1;
        $facilityRequest->date_approve = today();
        $facilityRequest->remarks = "The Admin Manager has approved this request.";
        
        if($facilityRequest->save()){

            // Get Admin Manager
            $getGSO = 'GSO';
            $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

            // Check if the Requestor is a GSO to avoid double notifications
            if($facilityRequest->user_id === $dataGSO->id){
                
                // Send to the GSO
                $noti1 = new NotificationModel();
                $noti1->type_of_jlms = "JOMS";
                $noti1->sender_avatar = $request->input('sender_avatar');
                $noti1->sender_id = $request->input('sender_id');
                $noti1->sender_name = $request->input('sender_name');
                $noti1->message = 'Your request has been approved by the Admin Manager.';
                $noti1->receiver_id = $dataGSO->id;
                $noti1->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $noti1->joms_type = 'JOMS_Facility';
                $noti1->status = 2;
                $noti1->joms_id = $facilityRequest->id;
                $noti1->save();

            } else {

                // Send to the Requestor
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('sender_avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = 'Your request has been approved by the Admin Manager';
                $noti->receiver_id = $facilityRequest->user_id;
                $noti->receiver_name = $facilityRequest->user_name;
                $noti->joms_type = 'JOMS_Facility';
                $noti->status = 2;
                $noti->joms_id = $facilityRequest->id;
                $noti->save();
                
                // Send to the GSO
                $noti2 = new NotificationModel();
                $noti2->type_of_jlms = "JOMS";
                $noti2->sender_avatar = $request->input('sender_avatar');
                $noti2->sender_id = $request->input('sender_id');
                $noti2->sender_name = $request->input('sender_name');
                $noti2->message = 'This request has been approved by the Admin Manager';
                $noti2->receiver_id = $dataGSO->id;
                $noti2->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $noti2->joms_type = 'JOMS_Facility';
                $noti2->status = 2;
                $noti2->joms_id = $facilityRequest->id;
                $noti2->save();  

            }

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('sender_name') . ' has approved the request on the Facility/Venue Request Form (Control No. '.$facilityRequest->id.').';
            $logs->save();
        
            return response()->json(['message' => 'Approve'], 200);
            
        }else{
            return response()->json(['message' => 'There is something wrong.'], 500);
        }
    }

    /**
     *  Admin Disapproval
     */
    public function adminDisapproval(Request $request, $id){
        $facilityRequest = FacilityVenueModel::find($id);

        $facilityRequest->admin_approval = 2;
        $facilityRequest->date_approve = today();
        $facilityRequest->remarks = "Disapproved (Reason: ".$request->input('remarks'). ")";
        
        if($facilityRequest->save()){

            // Get Admin Manager
            $getGSO = 'GSO';
            $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();

            // Check if the Requestor is a GSO to avoid double notifications
            if($facilityRequest->user_id === $dataGSO->id){
                
                // Send to the GSO
                $noti1 = new NotificationModel();
                $noti1->type_of_jlms = "JOMS";
                $noti1->sender_avatar = $request->input('sender_avatar');
                $noti1->sender_id = $request->input('sender_id');
                $noti1->sender_name = $request->input('sender_name');
                $noti1->message = 'Your request has been disapproved by the Admin Manager.';
                $noti1->receiver_id = $dataGSO->id;
                $noti1->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $noti1->joms_type = 'JOMS_Facility';
                $noti1->status = 2;
                $noti1->joms_id = $facilityRequest->id;
                $noti1->save();

            } else {

                // Send to the Requestor
                $noti = new NotificationModel();
                $noti->type_of_jlms = "JOMS";
                $noti->sender_avatar = $request->input('sender_avatar');
                $noti->sender_id = $request->input('sender_id');
                $noti->sender_name = $request->input('sender_name');
                $noti->message = 'Your request has been disapproved by the Admin Manager';
                $noti->receiver_id = $facilityRequest->user_id;
                $noti->receiver_name = $facilityRequest->user_name;
                $noti->joms_type = 'JOMS_Facility';
                $noti->status = 2;
                $noti->joms_id = $facilityRequest->id;
                $noti->save();
                
                // Send to the GSO
                $noti2 = new NotificationModel();
                $noti2->type_of_jlms = "JOMS";
                $noti2->sender_avatar = $request->input('sender_avatar');
                $noti2->sender_id = $request->input('sender_id');
                $noti2->sender_name = $request->input('sender_name');
                $noti2->message = 'This request has been disapproved by the Admin Manager';
                $noti2->receiver_id = $dataGSO->id;
                $noti2->receiver_name = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;
                $noti2->joms_type = 'JOMS_Facility';
                $noti2->status = 2;
                $noti2->joms_id = $facilityRequest->id;
                $noti2->save();  

            }

            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('logs');
            $logs->save();
        
            return response()->json(['message' => 'Approve'], 200);
            
        }else{
            return response()->json(['message' => 'There is something wrong.'], 500);
        }
    }

}
