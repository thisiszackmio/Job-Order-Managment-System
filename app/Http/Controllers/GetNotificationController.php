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
use App\Models\NotificationsModel;

class GetNotificationController extends Controller
{
    /** 
     * Get Notifications (Prototype pani)
     */
    public function NewNotification($id)
    {
        $notification4supervisor = NotificationsModel::where('sender_id', $id)->get();
        $getForm = Inspection_Form::where('supervisor_approval', 0)
                                ->whereIn('created_at', $notification4supervisor->pluck('created_at'))
                                ->orderBy('created_at', 'asc')
                                ->get();

        $supInsDet = $notification4supervisor->map(function ($Inspnotification) use ($getForm) {
            $inspection = $getForm->first(function ($form) use ($Inspnotification) {
                return $form->created_at->equalTo($Inspnotification->created_at);
            });

            return [
                'insp_id' => $inspection->id ?? null,
                'insp_type' => $Inspnotification->type_of_request,
                'insp_message' => $Inspnotification->message,
                'insp_date' => $Inspnotification->created_at,
                'insp_stat' => $Inspnotification->status,
            ];
        });
        $supCont = $supInsDet->count();
        $supervisorNames = $getForm->isNotEmpty() ? $getForm->first()->supervisor_name : null;

        $responseData = [
            'Sup_Noti' => [
               'Inspection_Sup' => $supInsDet->isEmpty() ? null : $supInsDet,
               'supCount' => $supCont,
               'supervisor' => $supervisorNames
            ]
        ];

        return response()->json($responseData);
    }


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

        // ------------------------------- Is FOR GSO -------------------------------------------------

        //For Inspection Request
        $gsoInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 4)->where('form_status', 0)->orderBy('updated_at', 'desc')->get();
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

        // Close the Request
        $gsoCloseInspReqs = Inspection_Form::where('supervisor_approval', 1)
            ->where('admin_approval', 1)
            ->where('inspector_status', 1)
            ->where('form_status', 0)
            ->get();

        $gsoCloseInspIDs = $gsoCloseInspReqs->map(function ($gsoCloseInspReq) {
            return [
                'id' => $gsoCloseInspReq->id,
                'date_update' => $gsoCloseInspReq->updated_at
            ];
        })->all();

        //For Facility Request
        $gsoFacNoti = FacilityModel::where('admin_approval', 2)->get();
        $fID = $gsoFacNoti->pluck('user_id')->all();
        $getFReq = PPAUser::whereIn('id', $fID)->get();
        $gsoFDet = $gsoFacNoti->map(function ($facilityForm) use ($getFReq) {
            $user = $getFReq->where('id', $facilityForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'facility_id' => $facilityForm->id,
                'facility_date' => $facilityForm->updated_at,
                'facility_obr' => $facilityForm->obr_comment,
                'requestor' => $userName,
                'requestor_code' => $user->code_clearance,
            ];
        });

        //For Vehicle Request
        $gsoVehNoti = VehicleForm::whereIn('admin_approval', [5,2])->get();
        $vID = $gsoVehNoti->pluck('user_id')->all();
        $getVReq = PPAUser::whereIn('id', $vID)->get();
        $gsoVDet = $gsoVehNoti->map(function ($vehicleForm) use ($getVReq){
            $user = $getVReq->where('id', $vehicleForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'vehicle_id' => $vehicleForm->id,
                'vehicle_date' => $vehicleForm->updated_at,
                'vehicle_userID' => $vehicleForm->user_id,
                'vehicle_approval' => $vehicleForm->admin_approval,
                'requestor' => $userName
            ];
        });


        // Calculate the count
        $inspGSOCount = $gsoInsDet->count();
        $inspecCloseCount = $gsoCloseInspReqs->count();
        $facility = $gsoFDet->count();
        $vehicleSlip = $gsoVDet->count();

        $GSONotificationCount = $inspGSOCount + $inspecCloseCount + $facility + $vehicleSlip;

        // ------------------------------- Is FOR Admin ----------------------------------------------
        
        // For Inspection Request
        $checkstatusA = Inspection_Form::where('form_status', 0)->get();

        if($checkstatusA){
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

            // Calculate the count after mapping
            $inspAdminCount = $adminInsDet->count();
            
        } else {
            $adminInsDet = collect();
            $AdminNotificationCount = 0;
        }

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

        // For Vehicle Request
        $adminVehicleNoti = VehicleForm::where('admin_approval', 4)->get();
        $vID = $adminVehicleNoti->pluck('user_id')->all();
        $getVReq = PPAUser::whereIn('id', $vID)->get();
        $adminVDet = $adminVehicleNoti->map(function ($vehicleForm) use ($getVReq){
            $user = $getVReq->where('id', $vehicleForm->user_id)->first();
            $userName = $user->fname . ' ' . $user->lname;
            return [
                'vehicle_id' => $vehicleForm->id,
                'vehicle_date' => $vehicleForm->updated_at,
                'vehicle_userID' => $vehicleForm->user_id,
                'requestor' => $userName
            ];
        });


        // Calculate the count after mapping
        $facility = $adminFDet->count();
        $vehicleSlip = $adminVDet->count();

        $AdminNotificationCount = $inspAdminCount + $facility + $vehicleSlip;

        // ------------------------------- Is FOR Personnel ----------------------------------------------

        //For Inspection Request
        $checkstatusP = Inspection_Form::where('form_status', 0)->get();

        if (!$checkstatusP->isEmpty()) {

            $personnelInspection = Inspection_Form::whereIn('inspector_status', [2, 3])->orderBy('updated_at', 'desc')->get();
            $pluckInsId = $personnelInspection->pluck('id')->all();
            $getPersonnel = AdminInspectionForm::whereIn('inspection__form_id', $pluckInsId)->where('assign_personnel', $id)->get();
            $pID = $personnelInspection->pluck('user_id')->all();
            $getReq = PPAUser::whereIn('id', $pID)->get();

            $getInspectorDetails = $personnelInspection->map(function ($inspectionForm) use ($getReq, $getPersonnel) {
                $getP = $getPersonnel->where('inspection__form_id', $inspectionForm->id)->first();
                $user = $getReq->where('id', $inspectionForm->user_id)->first();
                $userName = $user->fname . ' ' . $user->lname;
                return [
                    'repair_id' => $inspectionForm->id,
                    'repair_date' => $inspectionForm->updated_at,
                    'requestor' => $userName,
                    'assign_personnel' => $getP->assign_personnel ?? null,
                    'status' => $inspectionForm->inspector_status,
                ];
            });

            // Calculate the count after mapping
            $inspPersonnelCount = $getPersonnel->count();
        } else {
            $getInspectorDetails = collect();
            $inspPersonnelCount = 0;
        }

        // ------------------------------- Is FOR OUTPUT ----------------------------------------------
        $responseData = [
            'Sup_Not' => [
                    'supRepairDetail' => $supInsDet->isEmpty() ? null : $supInsDet,
                    'supCount' => $SupervisorNotificationCount,
                ],
            'GSO_Not' => [
                    'gsoRepairDet' => $gsoInsDet->isEmpty() ? null : $gsoInsDet,
                    'gsoFacilityDet' => $gsoFDet->isEmpty() ? null : $gsoFDet,
                    'gsoVehicleDet' => $gsoVDet->isEmpty() ? null : $gsoVDet,
                    'gsoCloseInspReq' => $gsoCloseInspIDs,
                    'gsoCount' => $GSONotificationCount,
                ],
            'Admin_Not' => [
                    'adminRepairDet' => $adminInsDet->isEmpty() ? null : $adminInsDet,
                    'adminFacilityDet' => $adminFDet->isEmpty() ? null : $adminFDet,
                    'adminVehicleDet' => $adminVDet->isEmpty() ? null : $adminVDet,
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
