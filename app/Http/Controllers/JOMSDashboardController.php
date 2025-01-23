<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\FacilityVenueModel;
use App\Models\VehicleSlipModel;

class JOMSDashboardController extends Controller
{
    /**
     *  Count Everyone
     */
    public function FormCount(){
        $inspForm = InspectionModel::count();
        $facForm = FacilityVenueModel::count();
        $vehForm = VehicleSlipModel::count();

        $data = [
            'inspection_count' => $inspForm,
            'facility_count' => $facForm,
            'vehicle_count' => $vehForm
        ];

        return response()->json($data);
    }

    /**
     *  Pending Request
     */
    public function PendingRequest($id)
    {
        $pendingData = collect();

        // Inspection Data
        $inspectionData = InspectionModel::where('user_id', $id)
            ->whereNotIn('form_status', [1, 3])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($inspectionForm) {
                return [
                    'id' => $inspectionForm->id,
                    'type' => 'InspectionForm',
                    'date_request' => $inspectionForm->created_at,
                    'remarks' => $inspectionForm->form_remarks,
                ];
            });

        $pendingData = $pendingData->merge($inspectionData);

        // Facility Data
        $facilityData = FacilityVenueModel::where('user_id', $id)
            ->whereNotIn('admin_approval', [2, 1])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($facilityForm) {
                return [
                    'id' => $facilityForm->id,
                    'type' => 'FacilityForm',
                    'date_request' => $facilityForm->created_at,
                    'remarks' => $facilityForm->remarks,
                ];
            });

        $pendingData = $pendingData->merge($facilityData);

        // Vehicle Slip Data
        $vehicleData = VehicleSlipModel::where('user_id', $id)
            ->whereNotIn('admin_approval', [9, 4, 3, 2, 1])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($vehicleForm) {
                return [
                    'id' => $vehicleForm->id,
                    'type' => 'VehicleForm',
                    'date_request' => $vehicleForm->created_at,
                    'remarks' => $vehicleForm->remarks,
                ];
            });

        $pendingData = $pendingData->merge($vehicleData);

        // If no data exists, return null
        $responseData = $pendingData->isEmpty() ? null : $pendingData->sortBy('type')->values();

        return response()->json(['pending_requests' => $responseData]);
    }
    
}
