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
        // For Inspection Request
        $supInspectNoti = Inspection_Form::where('supervisor_approval', 0)->where('supervisor_name', $id)->orderBy('updated_at', 'desc')->get();
        $iID = $supInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();
        $supInsDet = $supInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'repair_id' => $inspectionForm->id,
                'repair_date' => $inspectionForm->updated_at,
                'repair_reqID' => $inspectionForm->user_id,
                'repair_supID' => $inspectionForm->supervisor_name,
                'repair_requestor' => $userName,
            ];
        });

        // Calculate the count after mapping
        $inspSupCount = $supInsDet->count();

        $SupervisorNotificationCount = $inspSupCount;



        // ------------------------------- Is FOR GSO ----------------------------------------------
        //For Inspection Request
        $gsoInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 4)->orderBy('updated_at', 'desc')->get();
        $iID = $gsoInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();
        $gsoInsDet = $gsoInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            $code = $user->code_clearance;
            return [
                'repair_id' => $inspectionForm->id,
                'repair_date' => $inspectionForm->updated_at,
                'repair_requestor' => $userName,
                'requestor_code' => $code
            ];
        });

        //For Facility Request
        $adminGSONoti = FacilityModel::where('admin_approval', 2)->get();
        $fID = $adminGSONoti->pluck('user_id')->all();
        $getFReq = PPAUser::whereIn('id', $fID)->get();
        $gsoFDet = $adminGSONoti->map(function ($facilityForm) use ($getFReq) {
            $user = $getFReq->where('id', $facilityForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'facility_id' => $facilityForm->id,
                'facility_date' => $facilityForm->updated_at,
                'requestor' => $userName,
                'requestor_code' => $user->code_clearance,
            ];
        });

        // Calculate the count after mapping
        $inspGSOCount = $gsoInsDet->count();
        $facility = $gsoFDet->count();

        $GSONotificationCount = $inspGSOCount + $facility;


        // ------------------------------- Is FOR Admin ----------------------------------------------
        // For Inspection Request
        $adminInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 3)->orderBy('updated_at', 'desc')->get();
        $iID = $adminInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();
        $adminInsDet = $adminInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'repair_id' => $inspectionForm->id,
                'repair_date' => $inspectionForm->updated_at,
                'repair_supID' => $inspectionForm->supervisor_name,
                'repair_requestor' => $userName,
            ];
        });

        // For Facility Request
        $adminFacilityNoti = FacilityModel::where('admin_approval', 4)->get();
        $fID = $adminFacilityNoti->pluck('user_id')->all();
        $getFReq = PPAUser::whereIn('id', $fID)->get();
        $adminFDet = $adminFacilityNoti->map(function ($facilityForm) use ($getFReq) {
            $user = $getFReq->where('id', $facilityForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'facility_id' => $facilityForm->id,
                'facility_date' => $facilityForm->updated_at,
                'requestor' => $userName,
            ];
        });

        // Calculate the count after mapping
        $inspAdminCount = $adminInsDet->count();
        $facility = $adminFDet->count();

        $AdminNotificationCount = $inspAdminCount + $facility;
        


        // ------------------------------- Is FOR Personnel ----------------------------------------------
        //For Inspection Request
        $getInspector = Inspector_Form::whereIn('close', [3,4])->orderBy('updated_at', 'desc')->get();
        $pluckInsId = $getInspector->pluck('inspection__form_id')->all();
        $getPersonnel = AdminInspectionForm::whereIn('inspection__form_id', $pluckInsId)->where('assign_personnel', $id)->get();
        $adminInspectNoti = Inspection_Form::whereIn('id', $pluckInsId)->get();
        $pID = $adminInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $pID)->get();

        $getInspectorDetails = $getInspector->map(function ($inspectionForm) use ($getReq, $adminInspectNoti, $getPersonnel) {
            $matchingForm = $adminInspectNoti->where('id', $inspectionForm->inspection__form_id)->first();
            $getP = $getPersonnel->where('inspection__form_id', $inspectionForm->inspection__form_id)->first();
            $user = $getReq->where('id', $matchingForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'repair_id' => $inspectionForm->inspection__form_id,
                'repair_date' => $inspectionForm->updated_at,
                'requestor' => $userName,
                'close' => $inspectionForm->close,
                'assign_personnel' => $getP->assign_personnel ?? null
            ];
        });

        // Calculate the count after mapping
        $inspPersonnelCount = $getPersonnel->count();


        // ------------------------------- Is FOR OUTPUT ----------------------------------------------
        $responseData = [
            'Sup_Not' => [
                    'supRepairDetail' => $supInsDet->isEmpty() ? null : $supInsDet,
                    'supCount' => $SupervisorNotificationCount,
                ],
            'GSO_Not' => [
                    'gsoRepairDet' => $gsoInsDet->isEmpty() ? null : $gsoInsDet,
                    'gsoFacilityDet' => $gsoFDet,
                    'gsoCount' => $GSONotificationCount,
                ],
            'Admin_Not' => [
                    'adminRepairDet' => $adminInsDet->isEmpty() ? null : $adminInsDet,
                    'adminFacilityDet' => $adminFDet,
                    'adminCount' => $AdminNotificationCount,
                ],
            'Personnel_Not' => [
                    'personnelRepairDet' => $getInspectorDetails->isEmpty() ? null : $getInspectorDetails,
                    'personnelCount' => $inspPersonnelCount
                ]
        ];

        return response()->json($responseData);
    }

    

}
