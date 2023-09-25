<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionFormRequest;
use App\Models\Inspection_Form;
use App\Models\PPAUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class InspectionFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inspectionForms = Inspection_Form::with('user')->get();

        if ($inspectionForms->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
        }

        $responseData = [];

        foreach ($inspectionForms as $inspectionForm) {
            // Access the related PPAUser data
            $ppaUser = $inspectionForm->user;
    
            // You can now access PPAUser properties like fname, lname, etc.
            $userName = $ppaUser->fname;
            $userMiddleInitial = $ppaUser->mname;
            $userLastName = $ppaUser->lname;
            $userclearance = $ppaUser->code_clearance;
    
            // Add the Inspection_Form data along with related PPAUser data to the response
            $responseData[] = [
                'inspection_form' => $inspectionForm,
                'user_details' => [
                    'fname' => $userName,
                    'mname' => $userMiddleInitial,
                    'lname' => $userLastName,
                    'code_clearance' => $userclearance,
                ],
            ];
        }

        return response()->json($responseData);
    }

    /**
     * Show data.
     */
    public function show(Request $request, $id){

        $viewRequest = Inspection_Form::with('user')->find($id);

        if (!$viewRequest) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        // Access the related PPAUser data
        $ppaUser = $viewRequest->user;

        // You can now access PPAUser properties like fname, lname, etc.
        $endUser = $ppaUser->fname . ' ' . $ppaUser->mname. '. ' . $ppaUser->lname;
        $userSignature = URL::to('/storage/esignature/' . $ppaUser->image);
        //$userSignature = $ppaUser->image;

        // On supervisor Detetails
        // Access supervisor details
        $supervisorId = $viewRequest->supervisor_name;

        if ($supervisorId) {
            $supervisor = PPAUser::find($supervisorId);

            if ($supervisor) {
                $supervisorName = $supervisor->fname . ' ' . $supervisor->mname. '. ' . $supervisor->lname;
                $supervisorSignature = URL::to('/storage/esignature/' . $supervisor->image);
            } else {
                $supervisorName = 'Supervisor Not Found'; // Handle the case where supervisor not found
            }
        } else {
            $supervisorName = 'No Supervisor Assigned'; // Handle the case where supervisor_id is empty
        }


        // Create the response data
        $respondData = [
            'view_request' => $viewRequest,
            'user_details' => [
                'enduser' => $endUser,
                'supervisor' => $supervisorName,
                'requestor_signature' => $userSignature,
                'supervisor_signature' => $supervisorSignature,
            ],
        ];

        return response()->json($respondData);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InspectionFormRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        $deploymentData = Inspection_Form::create($data);

        return response()->json(['message' => 'Deployment data created successfully'], 201);
    }

    /**
     * Update the specified resource in storage.
     * For Supervisor Approval
     */
    public function updateApprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);
    
        $approveRequest->update([
            'supervisor_approval' => 1,
        ]);
    
        return $approveRequest;
    }

    /**
     * Update the specified resource in storage.
     * For Supervisor Disapproval
     */
    public function updateDisapprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);
    
        $approveRequest->update([
            'supervisor_approval' => 2,
        ]);
    
        return $approveRequest;
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inspection_Form $inspection_Form)
    {
        //
    }
}
