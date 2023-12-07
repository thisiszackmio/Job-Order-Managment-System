<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use App\Models\Inspection_Form;
use App\Models\AdminInspectionForm;
use App\Models\Inspector_Form;

class GetNotificationController extends Controller
{
    /** 
     * Receive Notification by the Supervisor
     */
    public function SupervisorNoti($id)
    {
        $supInspectNoti = Inspection_Form::where('supervisor_name', $id)->where('supervisor_approval', 0)->get();

        $responseData = [
            'supDet' => $supInspectNoti
        ];

        return response()->json($responseData);
    }

    /** 
     * Receive Notification by the GSO
     */
    public function GSONoti()
    {
        $gsoInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 0)->get();

        $responseData = [
            'gsoDet' => $gsoInspectNoti
        ];

        return response()->json($responseData);
    }

    /** 
     * Receive Notification by the Admin
     */
    public function AdminNoti()
    {
        $adminInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 3)->get();

        $responseData = [
            'adminDet' => $adminInspectNoti
        ];

        return response()->json($responseData);
    }

    /** 
     * Receive Notification by the Assign Personnel
     */
    public function PersonnelNoti($id)
    {
        //Get Form Admin (Part B)
        $pID = AdminInspectionForm::where('assign_personnel', $id)->get();
        $iID = $pID->pluck('inspection__form_id')->all();
        $apID = $pID->pluck('assign_personnel')->first();

        if($pID->isEmpty()) {
            return response()->json(['message' => 'No Assign Personnel Found'], 404);
        }

        //Get Inspector Form
        $specForm = Inspector_Form::whereIn('inspection__form_id', $iID)->whereIn('close', [3,4])->get();

        $responseData = [
            'inspectorDet' => $specForm,
            'assignID' => $apID
        ];

        return response()->json($responseData);
    }

}
