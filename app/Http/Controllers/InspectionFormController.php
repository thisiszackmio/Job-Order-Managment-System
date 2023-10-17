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
     * Show My Request On Inpection.
     */
    public function myRequestInspec(Request $request, $id)
    {
        // Find the ID of the User
        $myRequest = PPAUser::find($id);

        // Get the ID
        //$user_id = $myRequest->id;

        // Query the Inspection Form using the user_id
        $getInspectionForm = Inspection_Form::where('user_id', $id)->get();

        //Display All the data
        $respondData = [
            'my_user' => $myRequest,
            'view_request' => $getInspectionForm
        ];

        return response()->json($respondData);

    }

    /**
     * Show data.
     */
    public function show(Request $request, $id)
    {

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
        // $notificationData = $notificationRequest->validated();
        $data['user_id'] = auth()->user()->id;

        // Get The sender name
        $userId = PPAUser::find($data['user_id']);
        $userSender = $userId->fname . ' ' . $userId->lname;
        
        // Create a notification message
        // $message = $userSender . ' has sent you a request for a Pre/Post Repair Inspection.';
        
        // Send the data on Inspection Form
        $deploymentData = Inspection_Form::create($data);

        if(!$deploymentData){
            return response()->json(['error' => 'Data Error'], 500);
        }

        // $storeNotification = GetNotification::create([
        //     'sender_id' => $notificationData['sender_id'],
        //     'receiver_id' => $notificationData['receiver_id'],
        //     'url' => $notificationData['url'],
        //     'subject' => $notificationData['subject'],
        //     'message' => $message, 
        //     'get_status' => $notificationData['get_status'],
        // ]);

        // if(!$storeNotification){
        //     return response()->json(['error' => 'Data Error'], 500);
        // }

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

        return response()->json(['message' => 'Record created successfully'], 200);

    }

    /**
     * View a Part B of the Form.
     */
    public function viewAdmin(Request $request, $id)
    {
        $viewAdminRequest = AdminInspectionForm::with('inspection_form')->find($id);

        if (!$viewAdminRequest) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        // Get the inspector ID
        $getInspectorId = $viewAdminRequest->assign_personnel;

        // Get the inspector details
        $getInspector = PPAUser::find($getInspectorId);

        // Concatenate the inspector's full name
        $InspectorFullName = $getInspector->fname . ' ' . $getInspector->mname . '. ' . $getInspector->lname;

        $respondData = [
            'partB' => $viewAdminRequest,
            'inspector_name' => $InspectorFullName,
        ];

        return response()->json($respondData);
    }

    /**
     * Admin manager List of Request.
     */
    public function AdminInspectView(Request $request)
    {
        $viewAdminRequest = AdminInspectionForm::with('inspection_form')->get();

        if (!$viewAdminRequest) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        //get the inspection form id
        $insId = $viewAdminRequest->pluck('inspection__form_id')->all();

        //get the Inspection Form by the Part B Form
        $insDet = Inspection_Form::whereIn('id', $insId)->get();

        //Get the Id sa nag Request
        $uid = $insDet->pluck('user_id')->first();

        // get assign personnel name
        $paId = $viewAdminRequest->pluck('assign_personnel')->first();

        //get the name of the assign personnel
        $paNames = PPAUser::where('id', $paId)->get();
        
        //Get the name sa nag request
        $userIds = PPAUser::find($uid);

        // Dispaly the name
        //$uName = $userIds->fname.' '.$userIds->mname.' '.$userIds->lname ;

        // Extract user_id from inspection_form relationship
        //$userIds = $viewAdminRequest->pluck('inspection_form.user_id');

        // Query Inspection_Form using the extracted user_ids
        //$getNames = Inspection_Form::whereIn('user_id', $userIds)->with('user')->get();

        //get the name data
        //$ppaNames = $getNames->user;

        $respondData = [
            'request_list' => $insDet->map(function ($inspectionForm) use ($userIds) {
                $uName = $userIds->fname.' '.$userIds->mname.' '.$userIds->lname ;
            
                return [
                    'id' => $inspectionForm->id,
                    'date_of_request' => $inspectionForm->date_of_request,
                    'full_name' => $uName,
                    'property_no' => $inspectionForm->property_number,
                    'complain' => $inspectionForm->complain,
                    'approval' => $inspectionForm->admin_approval
                ];
            }),
            'personnel' => $paNames->map(function ($personnelName){
                return [
                    'personnel_name' => $personnelName->fname . ' ' . $personnelName->mname . '. ' . $personnelName->lname,
                ];
            })
        ];

        return response()->json($respondData);
    }

    /**
     * Update the specified resource in storage.
     * For Supervisor Approval
     */
    public function updateApprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);
        
        // Update the Approval
        $approveRequest->update([
            'supervisor_approval' => 1,
        ]);

        // Get the ID and name of the supervisor
        $getUserId = $approveRequest->supervisor_name;   
        $findName = PPAUser::find($getUserId);
        $supervisorName =  $findName->fname . ' ' . $findName->lname;

        // Creating a notification
        $senderID = $approveRequest->supervisor_name;
        $receiverID = $approveRequest->user_id;
        $urlName = '/my_request/'.$receiverID;
        $subject = 'Your Request has been approved';
        $message = 'We will wait for the Admin Division to fill up the other forms';
        $getStatus = 0;

        // Store the Notification
        $storeNotification = GetNotification::create([
            'sender_id' => $senderID,
            'receiver_id' => $receiverID,
            'url' => $urlName,
            'subject' => $subject,
            'message' => $message,
            'get_status' => $getStatus,
        ]);

        if(!$storeNotification){
            return response()->json(['error' => 'Data Error'], 500);
        }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Update the specified resource in storage.
     * For Admin Approval
     */
    public function updateAdminApprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);
    
        $approveRequest->update([
            'admin_approval' => 1,
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
     * Update the specified resource in storage.
     * For Admin Disapproval
     */
    public function updateAdminDisapprove(Request $request, $id)
    {
        $approveRequest = Inspection_Form::find($id);
    
        $approveRequest->update([
            'admin_approval' => 2,
        ]);
    
        return $approveRequest;
    }
    
    /**
     * Input the Details on the Inspector on Part C
     */
    public function storeInspectorForm(Inspector_Form_Request $request, $id)
    {
        $data = $request->validated();

        $findInspection = Inspection_Form::find($id);

        $newRecord = $findInspection->ForInspector()->create([
            'inspection__form_id' => $data['inspection__form_id'],
            'before_repair_date' => $data['before_repair_date'],
            'findings' => $data['findings'],
            'recommendations' => $data['recommendations'],
        ]);

        return response()->json(['message' => 'Record created successfully'], 200);
    }

    /**
     * Show Part C and D data's
     */
    public function InspectorPartA(Request $request, $id)
    {

        $p1 = Inspector_Form::where('inspection__form_id', $id)->get();

        if($p1->isEmpty()) {
            return response()->json(['message' => 'No data'], 404);
        }

        $respondData = [
            'part_c' => $p1
        ];

        return response()->json($respondData);

    }

    /**
     * Input Final Data on Inspector on Part D
     */
    public function InspectorPartB(Request $request, $id)
    {
        $p2 = Inspector_Form::where('inspection__form_id', $id)->get();

        if($p2->isEmpty()) {
            return response()->json(['message' => 'No data'], 404);
        }

        foreach ($p2 as $record) {
            $record->update([
                'after_reapir_date' => $request->input('after_reapir_date'),
                'remarks' => $request->input('remarks'),
                'close' => 1,
            ]);
        }

        return response()->json($p2);

    }

}
