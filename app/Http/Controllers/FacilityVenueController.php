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
     *  0 - Form Closed
     *  1 - GSO
     *  2 - Admin Approval
     *  3 - Admin Disapprovel
     *  4 - Pending Approval
     *  5 - Deleted
     * 
     *  For the Notification (form_location)
     *  3 - Form submit if not Admin Manager
     *  2 - Admin Manager (Form submit and OPR Instruct)
     *  1 - GSO (OPR Action)
     *  0 - Form Closed
     * 
     */

     /**
     *  Form List 
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

            if($facility->admin_approval === 4){
                if(($startDateTime >= $facilityStartDateTime && $startDateTime <= $facilityEndDateTime) ||
                ($endDateTime >= $facilityStartDateTime && $endDateTime <= $facilityEndDateTime)){
                    return response()->json(['message' => 'Pending']);
                }
            }

            if($facility->admin_approval === 1 || $facility->admin_approval === 0){
                if(($startDateTime >= $facilityStartDateTime && $startDateTime <= $facilityEndDateTime) ||
                ($endDateTime >= $facilityStartDateTime && $endDateTime <= $facilityEndDateTime)){
                    return response()->json(['message' => 'Not Vacant']);
                }
            }
    
        }
    
        // If no conflicts, return 'Vacant'
        return response()->json(['message' => 'Vacant']);
    }

    /**
     *  Submit Form
     */
    public function storeFacilityRequest(FacilityFormRequest $request){
        // Get the current timestamp
        $now = Carbon::now();

        $data = $request->validated();

        // Create and save the deployment data
        $deploymentData = FacilityVenueModel::create($data);
        if (!$deploymentData) { return response()->json(['error' => 'Data Error'], 500); }

        // Get Your Avatar
        $dataReq = PPAEmployee::where('id', $data['user_id'])->first(); 
        $avatarReq = $dataReq->avatar;
        $IdReq = $dataReq->id;
        $nameReq = trim($dataReq->firstname . ' ' . $dataReq->middlename . '. ' . $dataReq->lastname);

        // Get Admin Manager
        $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
        $avatarAM = $dataAM->avatar;
        $IdAM = $dataAM->id;
        $nameAM = trim($dataAM->firstname . ' ' . $dataAM->middlename . '. ' . $dataAM->lastname);

        // Get GSO
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $avatarGSO = $dataGSO->avatar;
        $IdGSO = $dataGSO->id;
        $nameGSO = trim($dataGSO->firstname . ' ' . $dataGSO->middlename . '. ' . $dataGSO->lastname);

        // Condition Area
        $notifications = [];

        if($deploymentData->user_id == $dataAM->id){
            $notiMessage = $nameReq.' has submitted a request.';
            $receiverId = $IdGSO;
            $receiverName = $nameGSO;
            $form = 2;
        } else {
            $notiMessage = $nameReq.' has submitted a request and is waiting for your approval.';
            $receiverId = $IdAM;
            $receiverName = $nameAM;
            $form = 3;
        }

        $notifications[] = [
            'type_of_jlms' => "JOMS",
            'sender_avatar' => $avatarReq,
            'sender_id' => $IdReq,
            'sender_name' => $nameReq,
            'message' => $notiMessage,
            'receiver_id' => $receiverId,
            'receiver_name' => $receiverName,
            'joms_type' => 'JOMS_Facility',
            'status' => 2,
            'form_location' => $form,
            'joms_id' => $deploymentData->id,
            'created_at' => $now,
            'updated_at' => $now
        ];

        // Insert notifications in bulk for efficiency
        NotificationModel::insert($notifications);

        // Create logs
        $logs = new LogsModel();
        $logs->category = 'JOMS';
        $logs->message = $nameReq. ' has submitted the request for Facility/Venue Request Form (Control No. '.$deploymentData->id.').';
        $logs->save();

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     *  Edit Form
     */
    public function editFacilityRequest(Request $request, $id){
        $CheckForm = $request->validate([
            'request_office' => 'required|string',
            'title_of_activity' => 'required|string',
            'table' => 'required|boolean',
            'no_table' => 'nullable|numeric',
            'chair' => 'required|boolean',
            'no_chair' => 'nullable|numeric',
            'microphone' => 'required|boolean',
            'no_microphone' => 'nullable|numeric',
            'projector' => 'required|boolean',
            'projector_screen' => 'required|boolean',
            'document_camera' => 'required|boolean',
            'laptop' => 'required|boolean',
            'television' => 'required|boolean',
            'sound_system' => 'required|boolean',
            'videoke' => 'required|boolean',
            'others' => 'required|boolean',
            'specify'  => 'nullable|string',
            'name_male' => 'nullable|string',
            'name_female' => 'nullable|string',
            'other_details' => 'nullable|string',
        ]);

        $facilityData = FacilityVenueModel::find($id);

        // If the Admin Manager approves the form
        if($facilityData->admin_approval == 2){
            return response()->json(['message' => 'Approve'], 204);
        }

        // If the Admin Manager disapproves the form
        if($facilityData->admin_approval == 3){
            return response()->json(['error' => 'Disapprove'], 408);
        } 
        
        // If the Admin Manager disapproves the form
        if($facilityData->admin_approval == 5){
            return response()->json(['error' => 'Deleted'], 408);
        } 

        // Update the Data
        $facilityData->request_office = $CheckForm['request_office'];
        $facilityData->title_of_activity = $CheckForm['title_of_activity'];
        $facilityData->table = $CheckForm['table'];
        $facilityData->no_table = $CheckForm['no_table'];
        $facilityData->chair = $CheckForm['chair'];
        $facilityData->no_chair = $CheckForm['no_chair'];
        $facilityData->microphone = $CheckForm['microphone'];
        $facilityData->no_microphone = $CheckForm['no_microphone'];
        $facilityData->projector = $CheckForm['projector'];
        $facilityData->projector_screen = $CheckForm['projector_screen'];
        $facilityData->document_camera = $CheckForm['document_camera'];
        $facilityData->laptop = $CheckForm['laptop'];
        $facilityData->television = $CheckForm['television'];
        $facilityData->sound_system = $CheckForm['sound_system'];
        $facilityData->videoke = $CheckForm['videoke'];
        $facilityData->others = $CheckForm['others'];
        $facilityData->specify = $CheckForm['specify'];
        $facilityData->name_male = $CheckForm['name_male'];
        $facilityData->name_female = $CheckForm['name_female'];
        $facilityData->other_details = $CheckForm['other_details'];

        if($facilityData->save()){
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('user_name'). ' has update the form on Facility/Venue Form (Control No. '.$facilityData->id.').';
            $logs->save();

            return response()->json(['message' => 'Form update successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the form'], 400);
        }

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
            return response()->json(['error' => 'No-Form'], 404);
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
     *  Input Admin Manager OPR Instruction and Approve the Form
     */
    public function submitOPRInstruction(Request $request, $id) {
        // Get the current timestamp
        $now = Carbon::now();

        $CheckOPR = $request->validate([
            'oprInstruct' => 'required|string'
        ]);

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { 
            return response()->json(['message' => 'Facility request not found.'], 404); 
        }

        // check if the request form was already deleted
        if($facilityRequest->admin_approval == 5){
            return response()->json(['error' => 'Deleted'], 408);
        }

        // Check if the Approver is the Admin (For Security)
        $checkAM = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%AM%")->first();
        if (!$checkAM) {
            return response()->json(['message' => 'Not Admin'], 408);
        }

        // GSO Details 
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $nameGSO = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;

        // Update the OPR instruction
        $facilityRequest->obr_instruct = $CheckOPR['oprInstruct'];
        $facilityRequest->admin_approval = 2;
        $facilityRequest->date_approve = today();
        $facilityRequest->remarks = "The Admin Manager has approved this request.";

        // Save the updated facility request
        if ($facilityRequest->save()) {

            // Condition Area
            $notifications = [];

            // Check if the Requestor is GSO
            $gsoReq = $facilityRequest->user_id === $dataGSO->id;

            if($gsoReq){
                $notiMessage = 'Your request has been approved by the Admin Manager.';
            } else {
                $notiMessage = 'The request of '.$facilityRequest->user_name.' has been approved by the Admin Manager';
            }

            // Send to the GSO
            $notifications[] = [
                'type_of_jlms' => "JOMS",
                'sender_avatar' => $checkAM->avatar,
                'sender_id' => $checkAM->id,
                'sender_name' => trim($checkAM->firstname . ' ' . $checkAM->middlename . '. ' . $checkAM->lastname),
                'message' => $notiMessage,
                'receiver_id' => $dataGSO->id,
                'receiver_name' => $nameGSO,
                'joms_type' => 'JOMS_Facility',
                'status' => 2,
                'form_location' => 2,
                'joms_id' => $facilityRequest->id,
                'created_at' => $now,
                'updated_at' => $now
            ];

            // Send to the Requestor
            if(!$gsoReq){
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $checkAM->avatar,
                    'sender_id' => $checkAM->id,
                    'sender_name' => trim($checkAM->firstname . ' ' . $checkAM->middlename . '. ' . $checkAM->lastname),
                    'message' => 'Your request has been approved by the Admin Manager.',
                    'receiver_id' => $facilityRequest->user_id,
                    'receiver_name' => $facilityRequest->user_name,
                    'joms_type' => 'JOMS_Facility',
                    'status' => 2,
                    'form_location' => 2,
                    'joms_id' => $facilityRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

           // Insert notifications in bulk for efficiency
           NotificationModel::insert($notifications);

           // Update Notification (Para ma wala sa notifacion list)
           NotificationModel::where('receiver_id', $checkAM->id)
                        ->where('joms_type', 'JOMS_Facility')
                        ->where('joms_id', $facilityRequest->id)
                        ->where('form_location', 3)
                        ->update(['status' => 0]); // Change to 0 for delete the Notification

           // Create logs
           $logs = new LogsModel();
           $logs->category = 'JOMS';
           $logs->message = $checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname . ' has approved the request on Facility/Venue Form (Control No. '.$facilityRequest->id.').';
           $logs->save();

           return response()->json(['message' => 'OPR instruction updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'Failed to update OPR instruction.'], 400);
        }
    }   

    /**
     *  Edit OPR Instruction for the Admin
     */
    public function editOPRInstruction(Request $request, $id){
        $CheckOPR = $request->validate([
            'oprInstruct' => 'required|string'
        ]);

        // Check if the Approver is the Admin (For Security)
        $checkAM = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%AM%")->first();
        if (!$checkAM) {
            return response()->json(['message' => 'Not Admin.'], 408);
        }

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['message' => 'Facility request not found.'], 404); }

        // Update the OPR instruction
        $facilityRequest->obr_instruct = $CheckOPR['oprInstruct'];

        // Save the updated facility request
        if ($facilityRequest->save()) {
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname . ' has updated the OPR Instruction on Facility/Venue Form (Control No. '.$facilityRequest->id.').';
            $logs->save();
        } else {
            return response()->json(['message' => 'Failed to update OPR instruction.'], 400);
        }

    }

    /**
     *  Input OPR Action
     */
    public function submitOPRAction(Request $request, $id) {
        // Get the current timestamp
        $now = Carbon::now();

        // Get the sender's data (If GSO)
        $sender = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%GSO%")->first();
        if (!$sender) { 
            return response()->json(['message' => 'Not Admin.'], 408);
        }else{
            $senderId = $sender->id;
            $senderAvatar = $sender->avatar;
            $senderName = trim($sender->firstname . ' ' . $sender->middlename . '. ' . $sender->lastname);
        }

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['message' => 'Facility request not found.'], 404); }

        // Update the OPR comment
        $facilityRequest->obr_comment = $request->input('oprAction');
        $facilityRequest->admin_approval = 1;

        $reqGSO = $senderId === $facilityRequest->user_id;

        // Save the updated facility request
        if ($facilityRequest->save()) {
            // Condition Area
            $notifications = [];

            // Send to the Requestor
            if(!$reqGSO){
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $senderAvatar,
                    'sender_id' => $senderId,
                    'sender_name' => $senderName,
                    'message' => 'Your request has been received by the GSO.',
                    'receiver_id' => $facilityRequest->user_id,
                    'receiver_name' => $facilityRequest->user_name,
                    'joms_type' => 'JOMS_Facility',
                    'status' => 2,
                    'form_location' => 1,
                    'joms_id' => $facilityRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::whereIn('receiver_id', [$senderId, $facilityRequest->user_id])
                        ->where('joms_type', 'JOMS_Facility')
                        ->where('joms_id', $facilityRequest->id)
                        ->where('form_location', 2)
                        ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $senderName.' has entered the OPR Action on the Facility/Venue Request Form (Control No. '.$facilityRequest->id.').';
            $logs->save();

        }else{
            return response()->json(['message' => 'Failed to update OPR instruction.'], 400);
        }

    }

    /**
     *  Edit OPR Action
     */
    public function editOPRAction(Request $request, $id){
        $CheckOPR = $request->validate([
            'oprAction' => 'required|string'
        ]); 

        // Check if this is GSO (For Security)
        $checkGSO = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%GSO%")->first();
        if (!$checkGSO) {
            return response()->json(['message' => 'Not GSO'], 408);
        }

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['message' => 'Facility request not found.'], 404); }

        // Update the OPR comment
        $facilityRequest->obr_comment = $CheckOPR['oprAction'];

        if($facilityRequest->save()){
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $checkGSO->firstname. ' ' .$checkGSO->middlename. '. ' .$checkGSO->lastname . ' has updated the OPR Action on Facility/Venue Form (Control No. '.$facilityRequest->id.').';
            $logs->save();
        }
    }

    /**
     *  Admin Manager Disapproval
     */
    public function adminDisapproval(Request $request, $id){
        // Get the current timestamp
        $now = Carbon::now();

        $facilityRequest = FacilityVenueModel::find($id);

        $facilityRequest->admin_approval = 3;
        $facilityRequest->date_approve = today();
        $facilityRequest->remarks = "Disapproved (Reason: ".$request->input('remarks'). ")";
        
        if($facilityRequest->save()){

            // Get AM
            $dataAM = PPAEmployee::where('code_clearance', 'LIKE', "%AM%")->first();
            $avatarAM = $dataAM->avatar;
            $idAM = $dataAM->id;
            $nameAM = trim($dataAM->firstname . ' ' . $dataAM->middlename . '. ' . $dataAM->lastname);

            // Get GSO
            $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
            $idGSO = $dataGSO->id;
            $nameGSO = trim($dataGSO->firstname . ' ' . $dataGSO->middlename . '. ' . $dataGSO->lastname);

            $reqGSO = $facilityRequest->user_id === $dataGSO->id;

            // Check if the GSO is the requestor
            if($reqGSO){
                $notiMessage = 'Your request has been disapproved by the Admin Manager.';
                $receiverId = $facilityRequest->user_id;
                $receiverName = $facilityRequest->user_name;
            } else {
                $notiMessage = 'The request for '.$facilityRequest->user_name.' has been disapproved by the Admin Manager.';
                $receiverId = $idGSO;
                $receiverName = $nameGSO;
            }

            // Condition Area
            $notifications = [];

            // Send Notification on the GSO
            $notifications[] = [
                'type_of_jlms' => "JOMS",
                'sender_avatar' => $avatarAM,
                'sender_id' => $idAM,
                'sender_name' => $nameAM,
                'message' => $notiMessage,
                'receiver_id' => $receiverId,
                'receiver_name' => $receiverName,
                'joms_type' => 'JOMS_Facility',
                'status' => 2,
                'form_location' => 0,
                'joms_id' => $facilityRequest->id,
                'created_at' => $now,
                'updated_at' => $now
            ];

            // Send Notification on the GSO
            if(!$reqGSO){ // Avoid from receiving double notification on the GSO
                $notifications[] = [
                    'type_of_jlms' => "JOMS",
                    'sender_avatar' => $avatarAM,
                    'sender_id' => $idAM,
                    'sender_name' => $nameAM,
                    'message' => 'Your request has been disapproved by the Admin Manager.',
                    'receiver_id' => $facilityRequest->user_id,
                    'receiver_name' => $facilityRequest->user_name,
                    'joms_type' => 'JOMS_Facility',
                    'status' => 2,
                    'form_location' => 0,
                    'joms_id' => $facilityRequest->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            // Insert notifications in bulk for efficiency
            NotificationModel::insert($notifications);

            // Update Notification (Para ma wala sa notifacion list)
            NotificationModel::where('receiver_id', $idAM)
                            ->where('joms_type', 'JOMS_Facility')
                            ->where('joms_id', $facilityRequest->id)
                            ->where('form_location', 3)
                            ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $nameAM.' has disapproved the request on the Facility / Venue Request Form (Control No. '.$facilityRequest->id.').';
            $logs->save();
        
            return response()->json(['message' => 'Approve'], 200);
        }else{
            return response()->json(['message' => 'There is something wrong.'], 500);
        }
    }

    /**
     * Close Request 
     */
    function closeForce(Request $request, $id){
        $facilityRequest = FacilityVenueModel::find($id);

        // Update Approve
        $facilityRequest->admin_approval = 0;
        $facilityRequest->remarks = "Form Closed";

        if ($facilityRequest->save()) {
            // Log only if saving the notification is successful
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $request->input('user_name').' has closed the request on Facility / Venue Request Form (Control No. '.$facilityRequest->id.')';
            $logs->save();
        }
    }

    /**
     * Delete Form
     */
    public function closeRequestForce(Request $request, $id){

        $facilityRequest = FacilityVenueModel::find($id);

        // Check if the Request is already approve
        if($facilityRequest->admin_approval == 2){
            return response()->json(['message' => 'Already'], 408);
        }

        // Update Approve
        $facilityRequest->admin_approval = 5;
        $facilityRequest->remarks = "Deleted by the GSO: Reason(".$request->input('deleteReason').").";

        // Save Update
        if ($facilityRequest->save()) {

            $Noti = NotificationModel::where('joms_id', $facilityRequest->id)->where('joms_type', 'JOMS_Facility')->get();

            // Loop through each notification and update status
            foreach ($Noti as $notification) {
                $notification->status = 0;

                if ($notification->save()) {
                    // Log only if saving the notification is successful
                    $logs = new LogsModel();
                    $logs->category = 'JOMS';
                    $logs->message = $request->input('user_name').' has deleted the form on Facility / Venue Request Form (Control Number:'.$facilityRequest->id.').';
                    $logs->save();
                }
            }

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }


    }

}
