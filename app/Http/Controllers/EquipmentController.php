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
     * Show My Request
     */
    public function myRequestEquipment(Request $request, $id)
    {
        $myRequest = PPAUser::find($id);

        //Get the request
        $getEquipmentForm = EquipmentForm::where('user_id', $id)->get();

        //Display All the data
        $respondData = [
            'my_user' => $myRequest,
            'view_equipment' => $getEquipmentForm,
        ];

        return response()->json($respondData);
    }

    /**
     * View the form
     */
    public function show(Request $request, $id)
    {
        $equipmentForm = EquipmentForm::find($id);

        //Get the ID
        $divisionManagerId = $equipmentForm->division_manager_id;
        $userId = $equipmentForm->user_id;

        //Get the user 
        $userInfo = PPAUser::where('id', $userId)->first();
        $userMI = $userInfo->mname ? $userInfo->mname[0] . '. ' : '';  
        $userName = $userInfo->fname . ' ' . $userMI . $userInfo->lname;
        $userSig = URL::to('/storage/esignature/' . $userInfo->image);

        //Get the division manager
        $supInfo = PPAUser::where('id', $divisionManagerId)->first();
        $supervisorMI = $supInfo->mname ? $supInfo->mname[0] . '. ' : '';  
        $supervisorName = $supInfo->fname . ' ' . $supervisorMI . $supInfo->lname;
        $supervisorSig = URL::to('/storage/esignature/' . $supInfo->image);

        //Get the Admin Manager (Maam Daisy)
        $manInfo = PPAUser::where('code_clearance', '1')->first();
        $manMI = $manInfo->mname ? $manInfo->mname[0] . '. ' : '';  
        $manName = $manInfo->fname . ' ' . $manMI . $manInfo->lname;
        $manSig = URL::to('/storage/esignature/' . $manInfo->image);

        //Get Maam Sue ID
        $gsoInfo = PPAUser::where('id', '4')->first();
        $gsoMI = $gsoInfo->mname ? $gsoInfo->mname[0] . '. ' : ''; 
        $gsoName = $gsoInfo->fname . ' ' . $gsoMI . $gsoInfo->lname;
        $gsoSig = URL::to('/storage/esignature/' . $gsoInfo->image);
        $gsoPost = $gsoInfo->position;

        $respondData = [
            'equipment_form' => $equipmentForm,
            'userName' => $userName,
            'userSig' => $userSig,
            'supervisorName' => $supervisorName,
            'supervisorSig' => $supervisorSig,
            'adminName' => $manName,
            'adminSig' => $manSig,
            'gsoName' => $gsoName,
            'gsoSig' => $gsoSig,
            'gsoPost' => $gsoPost
        ];
        
        return response()->json($respondData);
    }

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
     * Manager's Approval
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

    /**
     * Admin Manager's Instruction
     */
    public function AdminInstruct(Request $request, $id)
    {
        $findEquipment = EquipmentForm::find($id);

        if ($findEquipment) {
            $findEquipment->update([
                'instructions' => $request->input('instructions') ?? 'N/A'
            ]);

            // Check if the update was successful (HTTP status code 200)
            if ($findEquipment->wasRecentlyCreated || $findEquipment->wasChanged()) {
                return response()->json(['message' => 'Update successful'], 200);
            } else {
                return response()->json(['message' => 'No changes made'], 200);
            }
        } else {
            // Handle the case where no record is found for the given $id
            return response()->json(['error' => 'Record not found'], 404);
        }
    }

    /**
     * GSO fill up form
     */
    public function GSOForm(Request $request, $id)
    {
        $findEquipment = EquipmentForm::find($id);

        if ($findEquipment) {
            $findEquipment->update([
                'driver' => $request->input('driver'),
                'operator' => $request->input('operator'),
                'status' => 2
            ]);

            // Check if the update was successful (HTTP status code 200)
            if ($findEquipment->wasRecentlyCreated || $findEquipment->wasChanged()) {
                return response()->json(['message' => 'Update successful'], 200);
            } else {
                return response()->json(['message' => 'No changes made'], 200);
            }
        } else {
            // Handle the case where no record is found for the given $id
            return response()->json(['error' => 'Record not found'], 404);
        }
    }

    /**
     * Close the Request
     */
    public function closeRequest(Request $request, $id)
    {
        // Update the close status for all EquipmentForms associated with the Inspection_Form
        EquipmentForm::where('id', $id)->update(['status' => 1]);

        return response()->json(['message' => 'Request closed successfully'], 200);
    }
}
