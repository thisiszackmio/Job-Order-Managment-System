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

        //Get GSO ID on the database
        $gsoUser = PPAUser::find(5); // ID number of Maam Sue

        if (!$gsoUser) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $gsoName = $gsoUser->fname . ' ' . $gsoUser->mname. '. ' . $gsoUser->lname;
        $gsoSignature = URL::to('/storage/esignature/' . $gsoUser->image);


        //Get Admin Division Manager on the Database
        $ManagerUser = PPAUser::find(8); // ID Number of Maam Daisy

        if (!$ManagerUser) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $ManagerName = $ManagerUser->fname . ' ' . $ManagerUser->mname. '. ' . $ManagerUser->lname;
        $ManagerSignature = URL::to('/storage/esignature/' . $ManagerUser->image);


        // Create the response data
        $respondData = [
            'view_request' => $viewRequest,
            'user_details' => [
                'enduser' => $endUser,
                'supervisor' => $supervisorName,
                'requestor_signature' => $userSignature,
                'supervisor_signature' => $supervisorSignature,
            ],
            'gso_user_details' => [
                'gso_name' => $gsoName,
                'gso_signature' => $gsoSignature,
            ],
            'manager_user_details' => [
                'manager_name' => $ManagerName,
                'manager_signature' => $ManagerSignature,
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

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Store a Part B of the Form.
     */
    public function storeAdmin(Request $request, $id)
    {
        $datatwo = $request->validated();

        $findInspection = Inspection_Form::find($id);

        $newRecord = $findInspection->relatedModel()->create([
            'date_of_filling' => $datatwo['date_of_filling'],
            'date_of_last_repair' => $datatwo['date_of_last_repair'],
            'nature_of_last_repair' => $datatwo['nature_of_last_repair'],
            'assign_personnel' => $datatwo['assign_personnel'],
        ]);

        return response()->json(['message' => 'Record created successfully'], 200);

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
