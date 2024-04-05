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
        $inspApproval = Inspection_Form::where('admin_approval', '1')->get();
        $inspDisapproval = Inspection_Form::where('admin_approval', '2')->orWhere('supervisor_approval', '2')->get();
        $inspPending = Inspection_Form::where('supervisor_approval', '0')->orWhereIn('admin_approval', [3,4])->get();

        // Facility Request
        $facility = FacilityModel::get();
        $facilityApproval = FacilityModel::whereIn('admin_approval', [2, 1])->get();
        $facilityDisapproval = FacilityModel::where('admin_approval', 3)->get();
        $facilityPending = FacilityModel::where('admin_approval', 4)->get();

        // Vehicle Request
        $vehicle = VehicleForm::get();
        $vehApproval = VehicleForm::whereIn('admin_approval', [1, 2])->get();
        $vehDisapproval = VehicleForm::where('admin_approval', '3')->get();
        $vehPending = VehicleForm::whereIn('admin_approval', [5, 4])->get();

        $data = [
            'inspection_count' => $inspection->count(),
            'inspection_approve' => $inspApproval->count(),
            'inspection_disapprove' => $inspDisapproval->count(),
            'inspection_pending' => $inspPending->count(),
            'facility_count' => $facility->count(),
            'facility_approve' => $facilityApproval->count(),
            'facility_disapprove' => $facilityDisapproval->count(),
            'facility_pending' => $facilityPending->count(),
            'vehicle_count' => $vehicle->count(),
            'vehicle_approve' => $vehApproval->count(),
            'vehicle_disapprove' => $vehDisapproval->count(),
            'vehicle_pending' => $vehPending->count(),
        ];

        return response()->json($data);
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
