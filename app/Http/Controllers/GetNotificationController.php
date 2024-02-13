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
    public function SupervisorNoti($id)
    {
        // For Inspection Form
        $supInspectNoti = Inspection_Form::where('supervisor_name', $id)->where('supervisor_approval', 0)->get();
        $iID = $supInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();

        // Combine Inspection_Form data with PPAUser data
        $supDet = $supInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            return [
                'inspection_form' => $inspectionForm,
                'user' => $user,
            ];
        });

        $responseData = [
            'supInsDet' => $supDet
        ];

        return response()->json($responseData);
    }

    /** 
     * Receive Notification by the GSO
     */
    public function GSONoti()
    {
        //For Inspection Form
        $gsoInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 4)->get();
        $iID = $gsoInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();

        $gsoDet = $gsoInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            return [
                'inspection_form' => $inspectionForm,
                'user' => $user,
            ];
        });
        
        // For Facility Form
        $gsoFacilityNoti = FacilityModel::where('admin_approval', 2)->get();
        $fID = $gsoFacilityNoti->pluck('user_id')->all(); // Fix: Changed from $iID to $fID
        $getFacReq = PPAUser::whereIn('id', $fID)->get(); // Fix: Changed from $getReq to $getFacReq
        $getAdminName = PPAUser::where('code_clearance', '1')->first();

        $gsoDetFac = $gsoFacilityNoti->map(function ($facilityForm) use ($getFacReq) {
            $user = $getFacReq->where('id', $facilityForm->user_id)->first();
            return [
                'facility_form' => $facilityForm,
                'user' => $user,
            ];
        });
        
        //Output
        $responseData = [
            'gsoDet' => $gsoDet,
            'gsoFacDet' => $gsoDetFac,
            'adminName' => $getAdminName
        ];

        return response()->json($responseData);
    }

    /** 
     * Receive Notification by the Admin
     */
    public function AdminNoti()
    {
        //For Inspection Form
        $adminInspectNoti = Inspection_Form::where('supervisor_approval', 1)->where('admin_approval', 3)->get();
        $iID = $adminInspectNoti->pluck('user_id')->all();
        $getReq = PPAUser::whereIn('id', $iID)->get();

        $adminDet = $adminInspectNoti->map(function ($inspectionForm) use ($getReq) {
            $user = $getReq->where('id', $inspectionForm->user_id)->first();
            return [
                'inspection_form' => $inspectionForm,
                'user' => $user,
            ];
        });

        $adminFacilityNoti = FacilityModel::where('admin_approval', 4)->get();
        $fID = $adminFacilityNoti->pluck('user_id')->all();
        $getFReq = PPAUser::whereIn('id', $fID)->get();  // Use $fID instead of $iID

        $adminFDet = $adminFacilityNoti->map(function ($facilityForm) use ($getFReq) {  // Use $getFReq instead of $getReq
            $user = $getFReq->where('id', $facilityForm->user_id)->first();
            return [
                'facility_form' => $facilityForm,
                'user' => $user,
            ];
        });

        //For Vehicle Slip
        $adminVehicleNoti = VehicleForm::where('admin_approval', 3)->get();
        $vID = $adminVehicleNoti->pluck('user_id')->all();
        $getVReq = PPAUser::whereIn('id', $vID)->get();

        $adminVehDet = $adminVehicleNoti->map(function ($vehicleForm) use ($getVReq) {
            $user = $getVReq->where('id', $vehicleForm->user_id)->first();
            return [
                'vehicle_form' => $vehicleForm,
                'user' => $user,
            ];
        });

        $responseData = [
            'adminDet' => $adminDet,
            'adminFacDet' => $adminFDet,
            'adminVehDet' => $adminVehDet
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

        //Get Inspector Form
        $specForm = Inspector_Form::whereIn('inspection__form_id', $iID)->whereIn('close', [3,4])->get();
        $inspForm = Inspection_Form::whereIn('id', $iID)->whereIn('inspector_status', [3, 2])->get();

        $responseData = [
            'inspectionDet' => $inspForm,
            'inspectorDet' => $specForm,
            'assignID' => $apID
        ];

        return response()->json($responseData);
    }

}
