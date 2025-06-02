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
        // $facForm = FacilityVenueModel::count();

        // For the Inspection
        $inspTotal = InspectionModel::count();
        $inspComplete = InspectionModel::where('form_status', 1)->count();
        $inspPending = InspectionModel::whereIn('form_status', [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13])->count();
        $inspCancel = InspectionModel::whereIn('form_status', [0, 7])->count();

        // For vehicle Check
        $vehTotal = VehicleSlipModel::count();
        $vehComplete = VehicleSlipModel::where('admin_approval', 1)->count();
        $vehPending = VehicleSlipModel::whereIn('admin_approval', [3, 4, 5, 6, 7, 8])->count();
        $vehCancel = VehicleSlipModel::whereIn('admin_approval', [0, 2])->count();

        // For Facility Check
        $facTotal = FacilityVenueModel::count();
        $facComplete = FacilityVenueModel::where('admin_approval', 1)->count();
        $facPending = FacilityVenueModel::whereIn('admin_approval', [2, 3, 5, 6, 7])->count();
        $facCancel = FacilityVenueModel::whereIn('admin_approval', [0, 4])->count();

        $data = [
            'inspection' => [
                'count' => $inspTotal,
                'complete' => $inspComplete,
                'pending' => $inspPending,
                'cancel' => $inspCancel,
            ],
            'vehicle' => [
                'count' => $vehTotal,
                'complete' =>$vehComplete,
                'pending' => $vehPending,
                'cancel' => $vehCancel
            ],
            'facility' => [
                'count' => $facTotal,
                'complete' =>$facComplete,
                'pending' => $facPending,
                'cancel' => $facCancel
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
