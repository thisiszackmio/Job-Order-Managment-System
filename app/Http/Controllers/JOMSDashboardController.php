<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\FacilityVenueModel;
use App\Models\PPAEmployee;
use App\Models\VehicleSlipModel;
use App\Models\NotificationModel;
use App\Models\VehicleTypeModel;
use App\Models\AssignPersonnelModel;

class JOMSDashboardController extends Controller
{
    /**
     *  Count Everyone
     */
    public function FormCount(){
        // $inspForm = InspectionModel::count();
        // $facForm = FacilityVenueModel::count();

        // For vehicle Check
        // $vehForm = VehicleSlipModel::count();
        $vehAllForm = VehicleSlipModel::count();
        $vehPendingAssignForm = VehicleSlipModel::whereIn('admin_approval', [5, 6, 8])->count();
        $vehPendingApprovalForm = VehicleSlipModel::whereIn('admin_approval', [3, 4])->count();
        $vehApproval = VehicleSlipModel::where('admin_approval', 1)->count();
        $vehDisapproval = VehicleSlipModel::where('admin_approval', 2)->count();
        $vehCancel = VehicleSlipModel::where('admin_approval', 0)->count();

        $data = [
            // 'inspection_count' => $inspForm,
            // 'facility_count' => $facForm,
            'vehicle' => [
                'count' => $vehAllForm,
                'pendingAssignment' => $vehPendingAssignForm,
                'pendingApproval' => $vehPendingApprovalForm,
                'approval' => $vehApproval,
                'disapproval' => $vehDisapproval,
                'cancel' => $vehCancel
            ]
        ];

        return response()->json($data);
    }

    /**
     *  On Travel
     */
    public function OnTravel(){
        $onTravel = AssignPersonnelModel::where('assign_personnel.status', 1)
        ->join('joms_vehicle_type', 'assign_personnel.form_id', '=', 'joms_vehicle_type.form_id')
        ->select(
            'assign_personnel.form_id',
            'assign_personnel.personnel_name',
            'joms_vehicle_type.vehicle_name',
            'joms_vehicle_type.vehicle_plate'
        )
        ->get()
        ->map(function ($item) {
            return [
                'form_id' => $item->form_id ?? null,
                'personnel_name' => $item->personnel_name ?? null,
                'vehicle_name' => $item->vehicle_name ?? null,
                'vehicle_plate' => $item->vehicle_plate ?? null,
            ];
        });    

        return response()->json(['on_travel' => $onTravel]);
    }
        
}
