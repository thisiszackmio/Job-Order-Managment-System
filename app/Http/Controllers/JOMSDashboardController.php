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
    
}
