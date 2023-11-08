<?php

namespace App\Http\Controllers;

use App\Http\Requests\FacilityFormRequest;
use App\Models\Facility_Form;
use App\Models\PPAUser;
use Illuminate\Http\Request;

class FacilityFormController extends Controller
{
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
}
