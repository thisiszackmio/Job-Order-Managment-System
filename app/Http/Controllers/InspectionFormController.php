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
        $inspectionForms = Inspection_Form::with('user')->orderBy('date_of_request', 'desc')->get();

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
     * Show data.
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
     * Show My Request On Inspection.
     */
    public function myRequestInspec(Request $request, $id)
    {
        //Find the ID of the User
        $myRequest = PPAUser::find($id);

        //Get the request
        $getInspectionForm = Inspection_Form::where('user_id', $id)->get(); 
        $inspR = $getInspectionForm->pluck('id')->all();


        //Get the Inspector View
        $inspector = Inspector_Form::where('inspection__form_id', $inspR)->get();      

        //Display All the data
        $respondData = [
            'my_user' => $myRequest,
            'view_request' => $getInspectionForm,
            'inspector' => $inspector, 
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
        // $notificationData = $notificationRequest->validated();
        $data['user_id'] = auth()->user()->id;

        // Get The sender name
        $userId = PPAUser::find($data['user_id']);
        $userSender = $userId->fname . ' ' . $userId->lname;

        $remarks = "Your form has been submitted and waiting for Supervisor Approval";
        
        // Send the data on Inspection Form
        $deploymentData = Inspection_Form::create($data);
        $deploymentData->remarks = $remarks;
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
        $findInspection->remarks = "Your Request has been received by GSO and waiting for Admin Manager approval";

        if ($findInspection->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

    }

    /**
     * Input the Details on the Inspector on Part C
     */
    public function storeInspectorForm(Request $request, $id)
    {
        $findInspection = Inspection_Form::find($id);

        $findInspector = Inspector_Form::where('inspection__form_id', $id)->get();

        foreach ($findInspector as $record) {
            $record->update([
                'before_repair_date' => $request->input('before_repair_date'),
                'findings' => $request->input('findings'),
                'recommendations' => $request->input('recommendations')
            ]);
        }

        $findInspection->remarks = "Your Request has been checked by the Inspector";

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
            $findInspection->remarks = "The Inspector has completed your request. Waiting for GSO to close the request to view the form.";
            $findInspection->save();
            return response()->json(['message' => 'Update successful'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }

    }

     /**
     * Update the specified resource in storage.
     * For Supervisor Approval
     */
    public function updateApprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);

        // if (!$approveRequest) {
        //     return response()->json(['message' => 'Request not found'], 404);
        // }

        $approveRequest->supervisor_approval = 1;
        $approveRequest->remarks = "Your Request has been approved by your Supervisor";

        if ($approveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * For Supervisor Disapproval
     */
    public function updateDisapprove(Request $request, $id)
    {
        $disapproveRequest = Inspection_Form::find($id);

        // if (!$disapproveRequest) {
        //     return response()->json(['message' => 'Request not found'], 404);
        // }

        $disapproveRequest->supervisor_approval = 2;
        $disapproveRequest->remarks = "Your Request has been disapproved by your Supervisor";

        if ($disapproveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * For Admin Approval
     */
    public function updateAdminApprove(Request $request, $id)
    {
        $approveAdminRequest = Inspection_Form::find($id);
        $getInspectorStat = Inspector_Form::where('inspection__form_id', $id)->first();

        if ($approveAdminRequest) {
            $approveAdminRequest->admin_approval = 1;
            $approveAdminRequest->remarks = "Your Request has been approved by Admin Manager";

            if ($approveAdminRequest->save()) {
                // Successfully updated Inspection_Form, now update Inspector_Form
                if ($getInspectorStat) {
                    $getInspectorStat->close = 3;
                    $getInspectorStat->save();
                }

                return response()->json(['message' => 'Deployment data created successfully'], 200);
            }
        }

        return response()->json(['message' => 'Failed to update the request'], 500);
    
    }

    /**
     * Update the specified resource in storage.
     * For Admin Disapproval
     */
    public function updateAdminDisapprove(Request $request, $id)
    {
        $disapproveAdminRequest = Inspection_Form::find($id);
    
        // if (!$disapproveAdminRequest) {
        //     return response()->json(['message' => 'Request not found'], 404);
        // }

        $disapproveAdminRequest->supervisor_approval = 2;
        $disapproveAdminRequest->remarks = "Your Request has been disapproved by Admin Manager";

        if ($disapproveAdminRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Preview Inspection Form on Supervisor Page (Not Approved)
     * Part A
     */
    public function getInspectionDetails(Request $request, $id)
    {

        $inspectiondata = Inspection_Form::where('supervisor_name', $id)
        ->where('supervisor_approval', 0)->get();

        // if ($inspectiondata->isEmpty()) {
        //     return response()->json(['message' => 'No data found'], 404);
        // }

        //Get the Requestor Details
        $inspR = $inspectiondata->pluck('user_id')->all();
        $inspRD = PPAUSER::whereIn('id', $inspR)->get();

        $responseData = [
            'inspection_form_details' => $inspectiondata->map(function ($showDetail) use ($inspRD) {
                $requesters = $inspRD->where('id', $showDetail->user_id)->map(function ($user) {
                    $fullName = "{$user->fname} ";
                    if ($user->mname) { $fullName .= "{$user->mname}. "; }
                    $fullName .= $user->lname;
                    return $fullName; })
                    ->implode(', ');

                    return[
                        'id' => $showDetail->id,
                        'requester' => $requesters,
                        'date_requested' => $showDetail->date_of_request,
                        'property_no' => $showDetail->property_number,
                        'description' => $showDetail->property_description,
                        'location' => $showDetail->location,
                        'complain' => $showDetail->complain,
                        'supervisor_approval' => $showDetail->supervisor_approval
                    ];

            })
        ];

        return response()->json($responseData);
    }

    /**
     * View a Part B of the Form.
     */
    public function viewAdmin(Request $request, $id)
    {
        $viewAdminRequest = Inspection_Form::find($id);

        $formId = $viewAdminRequest->id;

        $viewAdminRequestForm = AdminInspectionForm::where('inspection__form_id', $formId)->get();

        $respondData = [
            'partB' => $viewAdminRequestForm
        ];

        return response()->json($respondData);
    }

    /**
     * Show Part C and D data's
     */
    public function InspectorPartA(Request $request, $id)
    {

        $p1 = Inspector_Form::where('inspection__form_id', $id)->get();

        // if($p1->isEmpty()) {
        //     return response()->json(['message' => 'No data'], 404);
        // }

        $respondData = [
            'part_c' => $p1
        ];

        return response()->json($respondData);

    }

    /**
     * Preview Inspection Form on GSO or Authorize Person Page
     */
    public function getInspectionDetailsAuth()
    {

        $inspectiondata = Inspection_Form::where('supervisor_approval', 1)
        ->where('admin_approval', 0)->get();

        // if ($inspectiondata->isEmpty()) {
        //     return response()->json(['message' => 'No data found'], 404);
        // }

        //Get the Requestor Details
        $inspR = $inspectiondata->pluck('user_id')->all();
        $inspRD = PPAUSER::whereIn('id', $inspR)->get();

        $responseData = [
            'inspection_details' => $inspectiondata->map(function ($showDetail) use ($inspRD) {
                $requesters = $inspRD->where('id', $showDetail->user_id)->map(function ($user) {
                    $fullName = "{$user->fname} ";
                    if ($user->mname) { $fullName .= "{$user->mname}. "; }
                    $fullName .= $user->lname;
                    return $fullName; })
                    ->implode(', ');

                    return[
                        'id' => $showDetail->id,
                        'requester' => $requesters,
                        'date_requested' => $showDetail->date_of_request,
                        'property_no' => $showDetail->property_number,
                        'description' => $showDetail->property_description,
                        'location' => $showDetail->location,
                        'complain' => $showDetail->complain,
                        'supervisor_approval' => $showDetail->supervisor_approval,
                        'admin_approval' => $showDetail->admin_approval
                    ];

            })
        ];

        return response()->json($responseData);
    }

    /**
     * Preview Inspection Form on Admin Division Manager
     */
    public function getInspectionDetailAdmin()
    {

        $inspectiondata = Inspection_Form::where('supervisor_approval', 1)
        ->where('admin_approval', 3)->get();

        // if ($inspectiondata->isEmpty()) {
        //     return response()->json(['message' => 'No data found'], 404);
        // }

        //Get the Requestor Details
        $inspR = $inspectiondata->pluck('user_id')->all();
        $inspRD = PPAUSER::whereIn('id', $inspR)->get();

        $responseData = [
            'inspection_details' => $inspectiondata->map(function ($showDetail) use ($inspRD) {
                $requesters = $inspRD->where('id', $showDetail->user_id)->map(function ($user) {
                    $fullName = "{$user->fname} ";
                    if ($user->mname) { $fullName .= "{$user->mname}. "; }
                    $fullName .= $user->lname;
                    return $fullName; })
                    ->implode(', ');

                    return[
                        'id' => $showDetail->id,
                        'requester' => $requesters,
                        'date_requested' => $showDetail->date_of_request,
                        'property_no' => $showDetail->property_number,
                        'description' => $showDetail->property_description,
                        'location' => $showDetail->location,
                        'complain' => $showDetail->complain,
                        'supervisor_approval' => $showDetail->supervisor_approval,
                        'admin_approval' => $showDetail->admin_approval
                    ];

            })
        ];

        return response()->json($responseData);
    }

    /**
     * Close the Request
     */
    public function closeRequest(Request $request, $id)
    {
        // Find the Inspector_Form records associated with the Inspection_Form
        $inspectorForms = Inspector_Form::where('inspection__form_id', $id)->get();

        // Update the close status for each Inspector_Form
        foreach ($inspectorForms as $inspectorForm) {
            $inspectorForm->close = 1;
            $inspectorForm->save();
        }

        // Find the Inspection_Form
        $findInspection = Inspection_Form::find($id);

        // Update remarks for the Inspection_Form
        $findInspection->remarks = "The Request has been close you can view it now";
        $findInspection->save();
        
        return response()->json(['message' => 'Request closed successfully'], 200);
    }

}
