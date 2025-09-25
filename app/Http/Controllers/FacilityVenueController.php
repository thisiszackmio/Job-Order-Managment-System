<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FacilityVenueModel;
use App\Models\NotificationModel;
use App\Models\PPAEmployee;
use App\Models\LogsModel;
use App\Models\FormTracker;
use App\Http\Requests\FacilityFormRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;

class FacilityVenueController extends Controller
{
    /**
     *  Legend
     * 
     *  0 - Form Cancel
     *  1 - Form Close
     *  2 - GSO Filed the OPR Comment
     *  3 - Form Aproved
     *  4 - Form Disapproved
     *  5 - Port Manager Request
     *  6 - Admin Manager Request
     *  7 - Regular Request
     * 
     */

     /**
     *  Form List (Shows on the Request List)
     */
    public function index(){
        // For Facility Form
        $FacilityFormData = FacilityVenueModel::orderBy('created_at', 'desc')->get();

        // Check if the facility request exists
        if (!$FacilityFormData) {
            return response()->json(['error' => 'Data not found'], 404);
        }

        $facDet = $FacilityFormData->map(function ($facilityForm) {
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
            return response()->json(['message' => 'facility'], 201);
        }
    
        // Check if the start date is in the past
        if ($startDateTime < $currentDateTime) {
            return response()->json(['message' => 'invalidDate'], 201);
        }
    
        // Check if the end date is before the start date
        if ($endDateTime < $startDateTime) {
            return response()->json(['message' => 'checkDate'], 201);
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

            if($facility->admin_approval === 5 || $facility->admin_approval === 6 || $facility->admin_approval === 7){
                if(($startDateTime >= $facilityStartDateTime && $startDateTime <= $facilityEndDateTime) ||
                ($endDateTime >= $facilityStartDateTime && $endDateTime <= $facilityEndDateTime)){
                    return response()->json(['message' => 'Pending'], 201);
                }
            }

            if($facility->admin_approval === 2 || $facility->admin_approval === 1){
                if(($startDateTime >= $facilityStartDateTime && $startDateTime <= $facilityEndDateTime) ||
                ($endDateTime >= $facilityStartDateTime && $endDateTime <= $facilityEndDateTime)){
                    return response()->json(['message' => 'Not Vacant'], 201);
                }
            }
    
        }
    
        // If no conflicts, return 'Vacant'
        return response()->json(['message' => 'Vacant'], 200);
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
        if (!$deploymentData) { return response()->json(['error' => 'Something wrong'], 406); }

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
        } else {
            $notiMessage = $nameReq.' has submitted a request and is waiting for your approval.';
            $receiverId = $IdAM;
            $receiverName = $nameAM;
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
            'form_location' => $data['admin_approval'],
            'joms_id' => $deploymentData->id,
            'created_at' => $now,
            'updated_at' => $now
        ];

        // Insert notifications in bulk for efficiency
        NotificationModel::insert($notifications);

        // Add to the Trackers
        $track = new FormTracker();
        $track->form_id = $deploymentData->id;
        $track->type_of_request = 'Facility/Venue';
        $track->remarks = $request->input('user_name').' submitted a request.';
        $track->save();

        // Create logs
        $logs = new LogsModel();
        $logs->category = 'FORM';
        $logs->message = $nameReq. ' has submitted a request.';
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
            'date_start' => 'required|date',
            'time_start' => 'required|date_format:H:i:s',
            'date_end' => 'required|date',
            'time_end' => 'required|date_format:H:i:s',
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

        // If the Admin Manager Cancel the Form
        if($facilityData->admin_approval == 0){
            return response()->json(['message' => 'Cancel'], 201);
        }

        // If the Admin Manager Closed the form
        if($facilityData->admin_approval == 1){
            return response()->json(['message' => 'Closed'], 201);
        } 
        
        // If the Admin Manager disapproves the form
        if($facilityData->admin_approval == 4){
            return response()->json(['message' => 'Disapproved'], 201);
        } 

        // Check if the end datetime is before start datetime
        if (
            Carbon::parse($CheckForm['date_start'] . ' ' . $CheckForm['time_start'])
                ->greaterThan(
                    Carbon::parse($CheckForm['date_end'] . ' ' . $CheckForm['time_end'])
                )
        ) {
            return response()->json(['message' => 'Invalid Date'], 201);
        }

        // Update the Data
        $facilityData->request_office = $CheckForm['request_office'];
        $facilityData->title_of_activity = $CheckForm['title_of_activity'];
        $facilityData->date_start = $CheckForm['date_start'];
        $facilityData->time_start = $CheckForm['time_start'];
        $facilityData->date_end = $CheckForm['date_end'];
        $facilityData->time_end = $CheckForm['time_end'];
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
            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityData->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = $request->input('user_name').' updated the form.';
            $track->save();

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'FORM';
            $logs->message = $request->input('user_name'). ' has update the form on Facility/Venue Form (Control No. '.$facilityData->id.').';
            $logs->save();

            return response()->json(['message' => 'Form update successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the form'], 406);
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
            return response()->json(['error' => 'Data Not Found'], 404);
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
            return response()->json(['error' => 'Data not found'], 404); 
        }

        // check if the request form was already deleted
        if($facilityRequest->admin_approval == 4 || $facilityRequest->admin_approval == 0){
            return response()->json(['message' => 'Deleted'], 201);
        }

        // Check if the Approver is the Admin (For Security)
        $checkAM = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%AM%")->first();
        if (!$checkAM) {
            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = 'Unauthorized approval attempt by ' .$checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname;
            $track->save();

            return response()->json(['message' => 'Not Admin'], 201);
        }

        // GSO Details 
        $dataGSO = PPAEmployee::where('code_clearance', 'LIKE', "%GSO%")->first();
        $nameGSO = $dataGSO->firstname. ' ' .$dataGSO->middlename. '. ' .$dataGSO->lastname;

        // Update the OPR instruction
        $facilityRequest->obr_instruct = $CheckOPR['oprInstruct'];
        $facilityRequest->admin_approval = 3;
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
                'form_location' => 3,
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
                    'form_location' => 3,
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
                        ->whereIn('form_location', [5, 6, 7])
                        ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = $checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname .' input the OPR instruction and approved the request.';
            $track->save();
            
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'FORM';
            $logs->message = $checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname . ' has approved the request on Facility/Venue Form (Control No. '.$facilityRequest->id.').';
            $logs->save();

           return response()->json(['message' => 'OPR instruction updated successfully.'], 200);
        } else {
            return response()->json(['error' => 'Failed to update OPR instruction.'], 406);
        }
    }   

    /**
     *  Edit OPR Instruction for the Admin
     */
    public function editOPRInstruction(Request $request, $id){
        $CheckOPR = $request->validate([
            'oprInstruct' => 'required|string'
        ]);

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['message' => 'Data not found'], 404); }

        // Check if the Approver is the Admin (For Security)
        $checkAM = PPAEmployee::where('id', $request->input('user_id'))
        ->whereRaw("code_clearance LIKE '%AM%' OR code_clearance LIKE '%HACK%'")
        ->first();
        if (!$checkAM) {
            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = 'Unauthorized OPR update attempt by ' .$checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname;
            $track->save();

            return response()->json(['message' => 'Not Admin'], 201);
        }
        
        // Update the OPR instruction
        $facilityRequest->obr_instruct = $CheckOPR['oprInstruct'];

        // Save the updated facility request
        if ($facilityRequest->save()) {
            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = $checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname .' updated the OPR instruction.';
            $track->save();

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'FORM';
            $logs->message = $checkAM->firstname. ' ' .$checkAM->middlename. '. ' .$checkAM->lastname . ' has updated the OPR Instruction on Facility/Venue Form (Control No. '.$facilityRequest->id.').';
            $logs->save();
        } else {
            return response()->json(['error' => 'Failed to update OPR instruction.'], 406);
        }

    }

    /**
     *  Input OPR Action
     */
    public function submitOPRAction(Request $request, $id) {
        // Get the current timestamp
        $now = Carbon::now();

        $CheckOPR = $request->validate([
            'oprAction' => 'required|string'
        ]);

        // Get the sender's data (If GSO)
        $sender = PPAEmployee::where('id', $request->input('user_id'))->where('code_clearance', 'LIKE', "%GSO%")->first();
        $senderId = $sender->id;
        $senderAvatar = $sender->avatar;
        $senderName = trim($sender->firstname . ' ' . $sender->middlename . '. ' . $sender->lastname);

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['error' => 'Data not found'], 404); }

        // Update the OPR comment
        $facilityRequest->obr_comment = $CheckOPR['oprAction'];
        $facilityRequest->admin_approval = 2;

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
                        ->where('form_location', 3)
                        ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = $senderName .' submitted the OPR action.';
            $track->save();

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'FORM';
            $logs->message = $senderName.' has entered the OPR Action on the Facility/Venue Request Form (Control No. '.$facilityRequest->id.').';
            $logs->save();

        }else{
            return response()->json(['error' => 'Failed to update OPR instruction.'], 406);
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
        $checkGSO = PPAEmployee::where('id', $request->input('user_id'))->whereRaw("code_clearance LIKE '%AM%' OR code_clearance LIKE '%HACK%'")->first();

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['error' => 'Data not found'], 404); }

        // Update the OPR comment
        $facilityRequest->obr_comment = $CheckOPR['oprAction'];

        if($facilityRequest->save()){
            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = $checkGSO->firstname. ' ' .$checkGSO->middlename. '. ' .$checkGSO->lastname .' updated the OPR action.';
            $track->save();

            // Create logs
            $logs = new LogsModel();
            $logs->category = 'FORM';
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

        // Find the facility request by ID
        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['error' => 'Data not found'], 404); }

        $facilityRequest->admin_approval = 4;
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
                            ->whereIn('form_location', [5, 6, 7])
                            ->update(['status' => 0]); // Change to 0 for delete the Notification

            // Add to the Trackers
            $track = new FormTracker();
            $track->form_id = $facilityRequest->id;
            $track->type_of_request = 'Facility/Venue';
            $track->remarks = $nameAM.'  disapproved the request.';
            $track->save();

            // Logs
            $logs = new LogsModel();
            $logs->category = 'FORM';
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
    function closeRequest(Request $request, $id){
        $twentyFourHoursAgo = Carbon::now()->subHours(24);

        $FacilityRequest = FacilityVenueModel::where('id', $id)
                                        ->where('admin_approval', 2)
                                        ->where('updated_at', '<', $twentyFourHoursAgo)
                                        ->first();

        if (!$FacilityRequest) { return response()->json(['message' => 'No changes has made'], 201); }

        if ($FacilityRequest) {
            // Update the record
            $FacilityRequest->admin_approval = 1;
            $FacilityRequest->remarks = 'Form is closed';

            if($FacilityRequest->save()){
                // Add to the Trackers
                $track = new FormTracker();
                $track->form_id = $FacilityRequest->id;
                $track->type_of_request = 'Facility/Venue';
                $track->remarks = 'The form was closed by the system.';
                $track->save();

                // Log the action
                $logs = new LogsModel();
                $logs->category = 'FORM';
                $logs->message = 'The system has closed the Facility / Venue Request Form (Control No. ' . $FacilityRequest->id . ').';
                $logs->save();
            }

        }
    }

    /**
     * Cancel Form
     */
    public function cancelRequest(Request $request, $id){

        $facilityRequest = FacilityVenueModel::find($id);
        if (!$facilityRequest) { return response()->json(['error' => 'Data not found'], 404); }

        // Check if the Request is already approve
        if($facilityRequest->admin_approval == 0){
            return response()->json(['message' => 'Cancel'], 201);
        }else if($facilityRequest->admin_approval == 1){
            return response()->json(['message' => 'Approve'], 201);
        }else if($facilityRequest->admin_approval == 4){
            return response()->json(['message' => 'Disapproved'], 201);
        }

        // Update Approve
        $facilityRequest->admin_approval = 0;
        $facilityRequest->remarks = $request->input('user_name'). ' canceled the form request.';

        // Save Update
        if ($facilityRequest->save()) {

            $Noti = NotificationModel::where('joms_id', $facilityRequest->id)->where('joms_type', 'JOMS_Facility')->get();

            // Loop through each notification and update status
            foreach ($Noti as $notification) {
                $notification->status = 0;

                if ($notification->save()) {
                    // Add to the Trackers
                    $track = new FormTracker();
                    $track->form_id = $facilityRequest->id;
                    $track->type_of_request = 'Facility/Venue';
                    $track->remarks = $request->input('user_name').' canceled the form.';
                    $track->save();

                    // Log only if saving the notification is successful
                    $logs = new LogsModel();
                    $logs->category = 'FORM';
                    $logs->message = $request->input('user_name').' has canceled the form on Facility / Venue Request Form (Control Number:'.$facilityRequest->id.').';
                    $logs->save();
                }
            }

        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }


    }

}
