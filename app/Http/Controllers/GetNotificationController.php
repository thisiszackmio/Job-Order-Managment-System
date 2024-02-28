<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use App\Models\Inspection_Form;
use App\Models\PPAUser;
use App\Models\AdminInspectionForm;
use App\Models\Inspector_Form;
use App\Models\FacilityModel;
use App\Models\VehicleForm;

class GetNotificationController extends Controller
{
    /** 
     * Receive Notification by the Supervisor
     */
    public function GetNotification($id)
    {
        // ------------------------------- Is FOR SUPERVISOR ----------------------------------------------
        // For Inspection Form
        $supInspectNoti = Inspection_Form::where('supervisor_approval', 0)->where('supervisor_name', $id)->orderBy('updated_at', 'desc')->get();
        $iID = $supInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();
        $supInsDet = $supInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'sup_insp_form' => $inspectionForm,
                'insp_user' => $userName,
            ];
        });

        // Calculate the count after mapping
        $inspSupCount = $supInsDet->count();

        // Add count to each item
        $supInsDet = $supInsDet->map(function ($item) use ($inspSupCount) {
            $item['insp_sup_count'] = $inspSupCount;
            return $item;
        });

        // ------------------------------- Is FOR GSO ----------------------------------------------
        //For Inspection Form
        $gsoInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 4)->orderBy('updated_at', 'desc')->get();
        $iID = $gsoInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();
        $gsoInsDet = $gsoInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            $code = $user->code_clearance;
            return [
                'gso_insp_form' => $inspectionForm,
                'insp_user' => $userName,
                'code' => $code
            ];
        });

        // Calculate the count after mapping
        $inspGSOCount = $gsoInsDet->count();

        // Add count to each item
        $gsoInsDet = $gsoInsDet->map(function ($item) use ($inspGSOCount) {
            $item['insp_count'] = $inspGSOCount;
            return $item;
        });

        // ------------------------------- Is FOR Admin ----------------------------------------------
        // For Inspection Form
        $adminInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 3)->orderBy('updated_at', 'desc')->get();
        $iID = $adminInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();
        $adminInsDet = $adminInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'admin_insp_form' => $inspectionForm,
                'insp_user' => $userName,
            ];
        });

        // Calculate the count after mapping
        $inspAdminCount = $adminInsDet->count();

        // Add count to each item
        $adminInsDet = $adminInsDet->map(function ($item) use ($inspAdminCount) {
            $item['insp_count'] = $inspAdminCount;
            return $item;
        });

        // ------------------------------- Is FOR Personnel ----------------------------------------------
        //For Inspection Form
        $getInspector = Inspector_Form::whereIn('close', [3,4])->orderBy('updated_at', 'desc')->get();
        $pluckInsId = $getInspector->pluck('inspection__form_id')->all();
        $getPersonnel = AdminInspectionForm::whereIn('inspection__form_id', $pluckInsId)->where('assign_personnel', $id)->get();
        $stats = $getInspector->pluck('close')->all();

        // Calculate the count after mapping
        $inspPersonnelCount = $getPersonnel->count();

        // Add count to each item
        $getPersonnel = $getPersonnel->map(function ($item) use ($inspPersonnelCount) {
            $item['insp_count'] = $inspPersonnelCount;
            return $item;
        });
        

        // ------------------------------- Is FOR OUTPUT ----------------------------------------------
        $responseData = [
            'Sup_Not' => [
                    'supInsDet' => $supInsDet->isEmpty() ? null : $supInsDet,
                    'supInsCount' => $inspSupCount,
                ],
            'GSO_Not' => [
                    'gsoInsDet' => $gsoInsDet->isEmpty() ? null : $gsoInsDet,
                    'gsoInsCount' => $inspGSOCount,
                ],
            'Admin_Not' => [
                    'adminInsDet' => $adminInsDet->isEmpty() ? null : $adminInsDet,
                    'adminInsCount' => $inspAdminCount,
                ],
            'Personnel_Not' => [
                    'personnelInsDet' => $getPersonnel,
                    'personnelInspector' => $getInspector,
                    'personnelCount' => $inspPersonnelCount
                ]
        ];

        return response()->json($responseData);
    }

    

}
