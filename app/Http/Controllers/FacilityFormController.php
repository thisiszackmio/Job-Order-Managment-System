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

class FacilityFormController extends Controller
{
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

        // Create the response data
        $respondData = [
            'main_form' => $viewRequest
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

}
