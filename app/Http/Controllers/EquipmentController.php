<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EquipmentForm;
use App\Models\PPAUser;
use App\Http\Requests\EquipmentRequest;
use Illuminate\Support\Facades\URL;

class EquipmentController extends Controller
{

    /**
     * Submit the information
     */
    public function store(EquipmentRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        $deploymentData = EquipmentForm::create([
            'user_id' => $data['user_id'],
            'type_of_equipment' => $data['type_of_equipment'],
            'date_request' => $data['date_request'],
            'title_of_activity' => $data['title_of_activity'],
            'date_of_activity' => $data['date_of_activity'],
            'time_start' => $data['time_start'],
            'time_end' => $data['time_end'],
            'instructions' => null,
            'driver' => null,
            'operator' => null,
            'rescue_members' => null,
            'opr' => null,
            'division_manager_id' => $data['division_manager_id'],
            'division_manager_approval' => $data['division_manager_approval'],
            'admin_manager_approval' => $data['admin_manager_approval'],
            'harbor_master_approval' => $data['harbor_master_approval'],
            'port_manager_approval' => $data['port_manager_approval'],
        ]);

        $deploymentData->save();

        if(!$deploymentData){
            return response()->json(['error' => 'Data Error'], 500);
        }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Show MyRequest List
     */
    public function myRequestEquipment(Request $request, $id)
    {
        //Get the request
        $getEquipmentForm = EquipmentForm::where('user_id', $id)->get();

        // Sup Details
        $sup_id = $getEquipmentForm->pluck('division_manager_id')->first();
        $ppaID = PPAUser::find($sup_id);
        $supName = $ppaID->fname . ' ' . $ppaID->mname . '. ' . $ppaID->lname;


        //Display All the data
        $respondData = [
            'view_equipment' => $getEquipmentForm,
            'sup_name' => $supName
        ];

        return response()->json($respondData);
    }

    /**
     * View Equipement List
     */
    public function showList()
    {
        $equipmentForm = EquipmentForm::orderBy('created_at', 'desc')->get();
        $requestor_ID = $equipmentForm->pluck('user_id')->all();
        $requestorQuerry = PPAUser::whereIn('id', $requestor_ID)->get();

        // Display all the Form Request on Equipment including Requestor
        $equipmentFormDet = $equipmentForm->map(function ($equipmentForm) use ($requestorQuerry) {
            $user = $requestorQuerry->where('id', $equipmentForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->mname . '. ' . $user->lname;

            return [
                'equipmentForm' => $equipmentForm,
                'requestorName' => $userName
            ];
        });
        
        return response()->json($equipmentFormDet);
    }

    /**
     * View Equipment Form
     */
    public function equipmentForm(Request $request, $id){
        
        //Get the request
        $getEquipmentForm = EquipmentForm::find($id);

        //Get the Requestor
        $userId = $getEquipmentForm->user_id;
        $userInfo = PPAUser::where('id', $userId)->first();
        $userName = $userInfo->fname . ' ' . $userInfo->mname . '. ' . $userInfo->lname;
        $userSig = URL::to('/storage/esignature/' . $userInfo->image);

        //Get the Division Manager
        $divisionManagerId = $getEquipmentForm->division_manager_id;
        $supInfo = PPAUser::where('id', $divisionManagerId)->first();
        $supName = $supInfo->fname . ' ' . $supInfo->mname . '. ' . $supInfo->lname;
        $supSig = URL::to('/storage/esignature/' . $supInfo->image);

        //Get the Admin Manager
        $AdminInfo = PPAUser::where('code_clearance', '1')->first();
        $AdminName = $AdminInfo->fname . ' ' . $AdminInfo->mname . '. ' . $AdminInfo->lname;
        $AdminSig = URL::to('/storage/esignature/' . $AdminInfo->image);

        //Get the Harbor Master
        $HarborInfo = PPAUser::where('position', 'Harbor Master')->first();
        $HarborName = $HarborInfo->fname . ' ' . $HarborInfo->mname . '. ' . $HarborInfo->lname;
        $HarborSig = URL::to('/storage/esignature/' . $HarborInfo->image);

        //Get the Port Manager
        $PMInfo = PPAUser::where('code_clearance', '2')->first();
        $PMName = $PMInfo->fname . ' ' . $PMInfo->mname . '. ' . $PMInfo->lname;
        $PMSig = URL::to('/storage/esignature/' . $PMInfo->image);

        $respondData = [
            'view_equipment' => $getEquipmentForm,
            'requestor' => $userName,
            'requestor_sign' => $userSig,
            'div_manager_name' => $supName,
            'div_manager_sign' => $supSig,
            'admin_manager_name' => $AdminName,
            'admin_manager_sign' => $AdminSig,
            'harbor_master' => $HarborName,
            'harbor_sign' => $HarborSig,
            'port_manager' => $PMName,
            'port_sign' => $PMSig
        ];

        return response()->json($respondData);

    }

    /**
     * Division Manager's Approval
     */
    public function SupAp(Request $request, $id)
    {
        $approveRequest = EquipmentForm::find($id);
        $approveRequest->division_manager_approval = 1;
        if ($approveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Manager's Dispproval
     */
    public function SupDp(Request $request, $id)
    {
        $disapproveRequest = EquipmentForm::find($id);
        $disapproveRequest->division_manager_approval = 2;
        if ($disapproveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Admin Instructions
     */
    public function AdminInstruct(Request $request, $id)
    {
        // Validation rules
        $validatedData = $request->validate([
            'instructions' => 'required|string',
        ]);

        // Find the Equipment Form
        $Eform = EquipmentForm::find($id);

        //Update the Form
        $Eform->update([
            'instructions' => $validatedData['instructions'],
        ]);
    }

    /**
     * Admin Manager's Approval
     */
    public function ManAp(Request $request, $id)
    {
        $approveRequest = EquipmentForm::find($id);
        $approveRequest->admin_manager_approval = 1;
        if ($approveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Admin Manager's Dispproval
     */
    public function ManDp(Request $request, $id)
    {
        $disapproveRequest = EquipmentForm::find($id);
        $disapproveRequest->admin_manager_approval = 2;
        if ($disapproveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }
}
