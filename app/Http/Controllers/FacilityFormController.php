<?php

namespace App\Http\Controllers;

use App\Http\Requests\FormMPHFacilityRequest;
use App\Http\Requests\FacilityFormRequest;
use App\Http\Requests\FormConferenceFacilityRequest;
use App\Http\Requests\FormDormFacilityRequest;
use App\Models\Facility_Form;
use App\Models\Facility_Mph;
use App\Models\Facility_Conference;
use App\Models\Facility_Dorm;
use App\Models\PPAUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class FacilityFormController extends Controller
{

    /**
     * Display the information
     */
    public function index()
    {
        $facilityForms = Facility_Form::with('user')->get();

        $responseData = [];

        foreach ($facilityForms as $facilityForm){
            // Access the related PPAUser data
            $ppaUser = $facilityForm->user;

            // You can now access PPAUser properties like fname, lname, etc.
            $userName = $ppaUser->fname;
            $userMiddleInitial = $ppaUser->mname;
            $userLastName = $ppaUser->lname;
            $userclearance = $ppaUser->code_clearance;

            $responseData[] = [
                'inspection_form' => $facilityForm,
                'user_details' => [
                    'fname' => $userName,
                    'mname' => $userMiddleInitial,
                    'lname' => $userLastName,
                    'code_clearance' => $userclearance,
                ]
            ];
        }

        return response()->json($responseData);
    }


    /**
     * Display the information on myRequest
     */
    public function myRequest(Request $request, $id)
    {
        $myRequest = PPAUser::find($id);

        $getfacilityForm = Facility_Form::where('user_id', $id)->get(); 

        $respondData = [
            'my_user' => $myRequest,
            'view_facility' => $getfacilityForm
        ];

        return response()->json($respondData);
    }

    /**
     * Store a newly created resource in storage.
     * Request Facility and Venue
     */
    public function store(FacilityFormRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        $userId = PPAUser::find($data['user_id']);

        $deploymentData = Facility_Form::create($data);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // return a response, for example:
        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Show data on Facility Form page
     */
    public function show(Request $request, $id)
    {
        $viewRequest = Facility_Form::find($id);

        $ppaUser = $viewRequest->user;

        $endUser = $ppaUser->fname . ' ' . $ppaUser->mname. '. ' . $ppaUser->lname;
        $userSignature = URL::to('/storage/esignature/' . $ppaUser->image);

        $ManagerUser = PPAUser::where('code_clearance', 1)->first();
        $ManagerName = $ManagerUser->fname . ' ' . $ManagerUser->mname. '. ' . $ManagerUser->lname;
        $ManagerSignature = URL::to('/storage/esignature/' . $ManagerUser->image);

        // Create the response data
        $respondData = [
            'main_form' => $viewRequest,
            'requestor' => [
                'name' => $endUser,
                'signature' => $userSignature,
            ],
            'manager' => [
                'name' => $ManagerName,
                'signature' => $ManagerSignature,
            ]
        ];

        return response()->json($respondData);
    }

    /**
     * Show MPH Info
     */
    public function showMPH(Request $request, $id)
    {
        $viewRequest = Facility_Mph::where('facility__form_id', $id)->first();

        // Create the response data
        $respondData = [
            'mph_form' => $viewRequest
        ];

        return response()->json($respondData);
    }

    /**
     * MPH Facility data store
     */
    public function storeMPH(FormMPHFacilityRequest $request, $id)
    {
        $data = $request->validated();

        $findFacility = Facility_Form::find($id);

        $newRecord = $findFacility->relatedModels()->create([
            'table' => $data['table'],
            'no_table' => $data['no_table'],
            'chair' => $data['chair'],
            'no_chair' => $data['no_chair'],
            'microphone' => $data['microphone'],
            'no_microphone' => $data['no_microphone'],
            'others' => $data['others'],
            'specify' => $data['specify'],
            'projector' => $data['projector'],
            'projector_screen' => $data['projector_screen'],
            'document_camera' => $data['document_camera'],
            'laptop' => $data['laptop'],
            'television' => $data['television'],
            'sound_system' => $data['sound_system'],
            'videoke' => $data['videoke']
        ]);

        $findFacility->remarks = "Done fillup the MPH Form";

        if ($findFacility->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Show Conference Info
     */
    public function showConference(Request $request, $id)
    {
        $viewRequest = Facility_Conference::where('facility__form_id', $id)->first();

        // Create the response data
        $respondData = [
            'conference_form' => $viewRequest
        ];

        return response()->json($respondData);
    }

    /**
     * Conference Facility data store
     */
    public function storeConference(FormConferenceFacilityRequest $request, $id)
    {
        $data = $request->validated();

        $findFacility = Facility_Form::find($id);

        $newRecord = $findFacility->relatedModelsConference()->create([
            'table' => $data['table'],
            'no_table' => $data['no_table'],
            'chair' => $data['chair'],
            'no_chair' => $data['no_chair'],
            'microphone' => $data['microphone'],
            'no_microphone' => $data['no_microphone'],
            'others' => $data['others'],
            'specify' => $data['specify'],
            'projector' => $data['projector'],
            'projector_screen' => $data['projector_screen'],
            'document_camera' => $data['document_camera'],
            'laptop' => $data['laptop'],
            'television' => $data['television'],
            'sound_system' => $data['sound_system'],
            'videoke' => $data['videoke']
        ]);
    }

    /**
     * Show Conference Info
     */
    public function showDorm(Request $request, $id)
    {
        $viewRequest = Facility_Dorm::where('facility__form_id', $id)->first();

        // Create the response data
        $respondData = [
            'dorm_form' => $viewRequest
        ];

        return response()->json($respondData);
    }

    /**
     * Dormitory Facility data store
     */
    public function storeDorm(FormDormFacilityRequest $request, $id)
    {
        $data = $request->validated();

        $findFacility = Facility_Form::find($id);

        $newRecord = $findFacility->relatedModelsDorm()->create([
            'name_male' => $data['name_male'],
            'name_female' => $data['name_female'],
            'other_details' => $data['other_details']
        ]);

        return response()->json(['message' => 'Data stored successfully'], 200);

    }

    /**
     * For OPR Instruction
     */
    public function StoreOPRInstruction(Request $request, $id)
    {
        // Find the facility by ID
        $facility = Facility_Form::find($id);

        // Check if the facility exists
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        // Update the obr_instruct field
        $facility->update([
            'obr_instruct' => $request->input('obr_instruct'),
        ]);

        return response()->json(['message' => 'OPR instruction stored successfully'], 200);

    }

    /**
     * For OPR Action
     */
    public function StoreOPRAction(Request $request, $id)
    {
        // Find the facility by ID
        $facility = Facility_Form::find($id);

        // Check if the facility exists
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        // Update the obr_instruct field
        $facility->update([
            'obr_comment' => $request->input('obr_comment'),
        ]);

        return response()->json(['message' => 'OPR instruction stored successfully'], 200);

    }

    /**
     * For Approve Form
     */
    public function AdminApproval(Request $request, $id)
    {
        // Find the facility by ID
        $facility = Facility_Form::find($id);

        // Check if the facility exists
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        // Update the obr_instruct field
        $facility->update([
            'admin_approval' => 1,
            'date_approve' => today(),
        ]);

        $facility->remarks = "The Admin Manager has approve your request";

        if ($facility->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

        return response()->json(['message' => 'OPR instruction stored successfully'], 200);

    }

    /**
     * For Dispprove Form
     */
    public function AdminDispprove(Request $request, $id)
    {
        // Find the facility by ID
        $facility = Facility_Form::find($id);

        // Check if the facility exists
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        // Update the obr_instruct field
        $facility->update([
            'admin_approval' => 2,
            'date_approve' => today(),
        ]);

        return response()->json(['message' => 'OPR instruction stored successfully'], 200);

    }

}
