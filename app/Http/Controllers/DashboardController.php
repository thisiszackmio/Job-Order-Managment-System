<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inspection_Form;
use App\Models\FacilityModel;
use App\Models\VehicleForm;
use App\Models\Logs;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{

    public function getCurrentUser()
    {
        // Get the authenticated user, or null if not authenticated
        $user = Auth::user();
    
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    }

    /**
     * Count Request Details
     */
    public function getCountRequest(){
        
        // Inspection Request
        $inspection = Inspection_Form::get();

        // Facility Request
        $facility = FacilityModel::get();

        // Vehicle Request
        $vehicle = VehicleForm::get();

        $data = [
            'inspection_count' => $inspection->count(),
            'facility_count' => $facility->count(),
            'vehicle_count' => $vehicle->count(),
        ];

        return response()->json($data);
    }

    /**
     * Pending Request Details
     */
    public function getPendingRequest($id){

        // Inspection Request
        $inspection = Inspection_Form::where('form_status', 0)->where('user_id', $id)->get();
        $inspDet = $inspection->map(function ($inspectionForm) {
            return [
                'repair_id' => $inspectionForm->id,
                'repair_remarks' => $inspectionForm->remarks,
            ];
        });

        $facility = FacilityModel::where('admin_approval', 4)->where('user_id', $id)->get();
        $facDet = $facility->map(function ($facilityForm) {
            return [
                'facility_id' => $facilityForm->id,
                'facility_remarks' => $facilityForm->remarks,
            ];
        });

        $vehicle = VehicleForm::whereIn('admin_approval', [4, 5])->where('user_id', $id)->get();
        $vehDet = $vehicle->map(function ($vehicleForm) {
            return [
                'vehicle_id' => $vehicleForm->id,
                'vehicle_remarks' => $vehicleForm->remarks,
            ];
        });

        $responseData = [
            'Inspection' => $inspDet->isEmpty() ? null : $inspDet,
            'Facility' => $facDet->isEmpty() ? null : $facDet,
            'Vehicle' => $vehDet->isEmpty() ? null : $vehDet
        ];


        return response()->json($responseData);

    }

    /**
     * Logs
     */
    public function getLogs(){
        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

    // Retrieve logs within the current month
    $logs = Logs::whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc')->get();

    return response()->json($logs);
    }

}
