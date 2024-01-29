<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionFormRequest;
use App\Http\Requests\GetNotificationRequest;
use App\Http\Requests\StoreAdminInspectionRequest;
use App\Http\Requests\Inspector_Form_Request;
use App\Models\Inspection_Form;
use App\Models\PPAUser;
use App\Models\Inspector_Form;
use App\Models\AdminInspectionForm;
use App\Models\GetNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class InspectionFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inspectionForms = Inspection_Form::with('user')->orderBy('id', 'desc')->get();

        // if ($inspectionForms->isEmpty()) {
        //     return response()->json(['message' => 'No data found'], 404);
        // }

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
                ]
            ];
        }

        return response()->json($responseData);
    }

    /**
     * Show data on Part A.
     */
    public function show(Request $request, $id)
    {

        $viewRequest = Inspection_Form::find($id);

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
        $gsoUser = PPAUser::where('code_clearance', 3)->where('lname', 'Sade')->first(); // ID number of Maam Sue

        if (!$gsoUser) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $gsoName = $gsoUser->fname . ' ' . $gsoUser->mname. '. ' . $gsoUser->lname;
        $gsoSignature = URL::to('/storage/esignature/' . $gsoUser->image);


        //Get Admin Division Manager on the Database
        $ManagerUser = PPAUser::where('code_clearance', 1)->first(); // ID Number of Maam Daisy

        if (!$ManagerUser) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $ManagerName = $ManagerUser->fname . ' ' . $ManagerUser->mname. '. ' . $ManagerUser->lname;
        $ManagerSignature = URL::to('/storage/esignature/' . $ManagerUser->image);


        // Create the response data
        $respondData = [
            'view_request' => $viewRequest,
            'user_details' => [
                'id' =>  $ppaUser->id,
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
     * Show data on Part B.
     */
    public function viewAdmin(Request $request, $id)
    {
        $viewAdminRequest = Inspection_Form::find($id);

        $formId = $viewAdminRequest->id;

        $viewAdminRequestForm = AdminInspectionForm::where('inspection__form_id', $formId)->first();

        $respondData = [
            'partB' => $viewAdminRequestForm
        ];

        return response()->json($respondData);
    }

    /**
     * Show Part C and D data's
     */
    public function InspectorSide(Request $request, $id)
    {

        $p1 = Inspector_Form::where('inspection__form_id', $id)->first();

        $respondData = [
            'part_c' => $p1
        ];

        return response()->json($respondData);

    }

    /**
     * Show My Request On Inspection.
     */
    public function myRequestInspec(Request $request, $id)
    {
        //Find the ID of the User
        $myRequest = PPAUser::find($id);

        //Get the request
        $getInspectionForm = Inspection_Form::where('user_id', $id)
        ->orderBy('id', 'desc')
        ->get(); 

        //Display All the data
        $respondData = [
            'my_user' => $myRequest,
            'view_request' => $getInspectionForm,
        ];

        return response()->json($respondData);

    }

   /**
     * Store a newly created resource in storage.
     * Part A
     */
    public function store(InspectionFormRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        // Get The sender name
        $userId = PPAUser::find($data['user_id']);
        $userSender = $userId->fname . ' ' . $userId->lname;

        
        // Send the data on Inspection Form
        $deploymentData = Inspection_Form::create($data);
        $deploymentData->save();

        
        if(!$deploymentData){
            return response()->json(['error' => 'Data Error'], 500);
        }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
        
    }

    /**
     * Store a Part B of the Form.
     */
    public function storeAdmin(StoreAdminInspectionRequest $request, $id)
    {
        $datatwo = $request->validated();

        $findInspection = Inspection_Form::find($id);

        $newRecord = $findInspection->relatedModels()->create([
            'date_of_filling' => $datatwo['date_of_filling'],
            'date_of_last_repair' => $datatwo['date_of_last_repair'],
            'nature_of_last_repair' => $datatwo['nature_of_last_repair'],
            'assign_personnel' => $datatwo['assign_personnel'],
        ]);

        Inspector_Form::create([
            'inspection__form_id' => $findInspection->id,
            'before_repair_date' => '1970/01/01',
            'findings' => 'no data',
            'recommendations' => 'no data',
            'close' => 0
        ]);

        // After creating the related model, update the admin_approval to 2
        $findInspection->admin_approval = 3;
        $findInspection->inspector_status = 3;

        if ($findInspection->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

    }

    /**
     * Store a Part C of the Form.
     */
    public function storeInspectorForm(Request $request, $id)
    {
        $findInspection = Inspection_Form::find($id);

        $findInspector = Inspector_Form::where('inspection__form_id', $id)->get();

        foreach ($findInspector as $record) {
            $record->update([
                'before_repair_date' => $request->input('before_repair_date'),
                'findings' => $request->input('findings'),
                'recommendations' => $request->input('recommendations'),
                'close' => 3
            ]);
        }

        $findInspection->inspector_status = 2;

        if ($findInspection->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

    }

    /**
     * Input Final Data on Inspector on Part D
     */
    public function InspectorPartB(Request $request, $id)
    {
        $p2 = Inspector_Form::where('inspection__form_id', $id)->get();

        // if($p2->isEmpty()) {
        //     return response()->json(['message' => 'No data'], 404);
        // }

        foreach ($p2 as $record) {
            $record->update([
                'after_reapir_date' => $request->input('after_reapir_date'),
                'remarks' => $request->input('remarks'),
                'close' => 2,
            ]);
        }

        $inspR = $p2->first()->inspection__form_id;
    
        $findInspection = Inspection_Form::find($inspR);

        if ($findInspection) {
            $findInspection->inspector_status = 1;
            $findInspection->save();
            return response()->json(['message' => 'Update successful'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

    }

    /**
     * For Supervisor Approval
     */
    public function updateApprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);

        $approveRequest->supervisor_approval = 1;

        
        if ($approveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
        
    }

    /**
     * For Supervisor Disapproval
     */
    public function updateDisapprove(Request $request, $id)
    {
        $disapproveRequest = Inspection_Form::find($id);

        $disapproveRequest->supervisor_approval = 2;

        if ($disapproveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * For Admin Approval
     */
    public function updateAdminApprove(Request $request, $id)
    {
        $approveAdminRequest = Inspection_Form::find($id);
        $getInspectorStat = Inspector_Form::where('inspection__form_id', $id)->first();

        if ($approveAdminRequest) {
            $approveAdminRequest->admin_approval = 1;

            if ($approveAdminRequest->save()) {
                if ($getInspectorStat) {
                    $getInspectorStat->close = 4;
                    $getInspectorStat->save();
                }

                return response()->json(['message' => 'Deployment data created successfully'], 200);
            }
        }

        return response()->json(['message' => 'Failed to update the request'], 500);
    
    }

    /**
     * For Admin Disapproval
     */
    public function updateAdminDisapprove(Request $request, $id)
    {
        $disapproveAdminRequest = Inspection_Form::find($id);
    
        $disapproveAdminRequest->admin_approval = 2;

        if ($disapproveAdminRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Close the Request
     */
    public function closeRequest(Request $request, $id)
    {
        // Find the Inspector_Form records associated with the Inspection_Form
        $inspectorForms = Inspector_Form::where('inspection__form_id', $id)->first();
        $inspectorForms->close = 1;
        $inspectorForms->save();
        
        return response()->json(['message' => 'Request closed successfully'], 200);
    }
}
