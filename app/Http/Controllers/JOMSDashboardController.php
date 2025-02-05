<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\FacilityVenueModel;
use App\Models\PPAEmployee;
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
    public function PendingRequest($id){
        $pendingData = collect();

        // Inspection Data
        $inspectionData = InspectionModel::where('user_id', $id)
            ->whereNotIn('form_status', [1, 3])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($inspectionForm) {
                return [
                    'id' => $inspectionForm->id,
                    'type' => 'Pre/Post Repair Inspection Form',
                    'date_request' => $inspectionForm->created_at,
                    'remarks' => $inspectionForm->form_remarks,
                ];
            });

        $pendingData = $pendingData->merge($inspectionData);

        // Facility Data
        $facilityData = FacilityVenueModel::where('user_id', $id)
            ->whereIn('admin_approval', [4, 2])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($facilityForm) {
                return [
                    'id' => $facilityForm->id,
                    'type' => 'Facility / Venue Form',
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
                    'type' => 'Vehicle Slip',
                    'date_request' => $vehicleForm->created_at,
                    'remarks' => $vehicleForm->remarks,
                ];
            });

        $pendingData = $pendingData->merge($vehicleData);

        // If no data exists, return null
        $responseData = $pendingData->isEmpty() ? null : $pendingData->sortBy('date_request')->values();

        return response()->json(['pending_requests' => $responseData]);
    }
    
    /**
     *  Pending Approval
     */
    public function PendingApproval($id){
        $pendingApproval = collect(); 

        // Notify the Supervisor 
        $inspectionDataSup = InspectionModel::where('supervisor_id', $id)
            ->where('supervisor_status', 0)
            ->get()
            ->map(function ($inspectionForm){
                return [
                    'id' => $inspectionForm->id,
                    'type' => 'Pre/Post Repair Inspection Form',
                    'date_request' => $inspectionForm->created_at,
                    'requestor' => $inspectionForm->user_name,
                    'remarks' => $inspectionForm->form_remarks,
                ];
            });
        $pendingApproval = $pendingApproval->merge($inspectionDataSup);

        // Notify the GSO
        $GSORequest = PPAEmployee::where('id', $id)
        ->where('code_clearance', 'LIKE', "%GSO%")
        ->first();

        if ($GSORequest) {
            // If GSO clearance is valid, add GSO-related data

            // Inspection Form
            $inspectionDataGSO = InspectionModel::where('supervisor_status', 1) // Approved by Supervisor
                ->whereIn('form_status', [4, 2, 5]) // Specific Form Status
                ->get()
                ->map(function ($inspectionForm) {
                    return [
                        'id' => $inspectionForm->id,
                        'type' => 'Pre/Post Repair Inspection Form',
                        'date_request' => $inspectionForm->created_at,
                        'requestor' => $inspectionForm->user_name,
                        'remarks' => $inspectionForm->form_remarks,
                    ];
                });

            $pendingApproval = $pendingApproval->merge($inspectionDataGSO);

            // Facility
            $facilityDataGSO = FacilityVenueModel::where('admin_approval', 2)
                ->get()
                ->map(function ($facilityDataAdmin) {
                    return [
                        'id' => $facilityDataAdmin->id,
                        'type' => 'Facility / Venue Form',
                        'date_request' => $facilityDataAdmin->created_at,
                        'requestor' => $facilityDataAdmin->user_name,
                        'remarks' => 'The form was approved by the Admin Manager.',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($facilityDataGSO);

            // Vehicle
            $vehicleDataGSO = VehicleSlipModel::whereIn('admin_approval', [8, 6, 5])
                ->get()
                ->map(function ($vehicleDataGSO) {
                    return [
                        'id' => $vehicleDataGSO->id,
                        'type' => 'Vehicle Slip Form',
                        'date_request' => $vehicleDataGSO->created_at,
                        'requestor' => $vehicleDataGSO->user_name,
                        'remarks' => 'Awaiting for assign vehicle and driver.',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($vehicleDataGSO);
        }

        // Notify the Authoritize Person on Vehicle Slip
        $AURequest = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%AU%")
            ->first();

        if($AURequest) {
            // Vehicle
            $vehicleDataAU = VehicleSlipModel::whereIn('admin_approval', [8, 6, 5])
                ->get()
                ->map(function ($vehicleDataAU) {
                    return [
                        'id' => $vehicleDataAU->id,
                        'type' => 'Vehicle Slip Form',
                        'date_request' => $vehicleDataAU->created_at,
                        'requestor' => $vehicleDataAU->user_name,
                        'remarks' => 'Awaiting for assign vehicle and driver.',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($vehicleDataAU);
        }

        // Notify the Admin
        $AdminManagerRequest = PPAEmployee::where('id', $id)
        ->where('code_clearance', 'LIKE', "%AM%")
        ->first();

        if ($AdminManagerRequest) {
            // If Admin Manager clearance is valid, add Admin Manager-related data
            $inspectionDataAM = InspectionModel::where('supervisor_status', 1) // Approved by Supervisor
                ->where('admin_status', 2) // Specific Form Status
                ->get()
                ->map(function ($inspectionForm) {
                    return [
                        'id' => $inspectionForm->id,
                        'type' => 'Pre/Post Repair Inspection Form',
                        'date_request' => $inspectionForm->created_at,
                        'requestor' => $inspectionForm->user_name,
                        'remarks' => 'Waiting for your approval',
                    ];
                });
            $pendingApproval = $pendingApproval->merge($inspectionDataAM);

            // Facility
            $facilityDataAdmin = FacilityVenueModel::where('admin_approval', 4)
                ->get()
                ->map(function ($facilityDataAdmin) {
                    return [
                        'id' => $facilityDataAdmin->id,
                        'type' => 'Facility / Venue Form',
                        'date_request' => $facilityDataAdmin->created_at,
                        'requestor' => $facilityDataAdmin->user_name,
                        'remarks' => 'Waiting for your approval',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($facilityDataAdmin);

            // Vehicle
            $vehicleDataAdmin = VehicleSlipModel::whereIn('admin_approval', [10])
                ->get()
                ->map(function ($vehicleDataAdmin) {
                    return [
                        'id' => $vehicleDataAdmin->id,
                        'type' => 'Vehicle Slip Form',
                        'date_request' => $vehicleDataAdmin->created_at,
                        'requestor' => $vehicleDataAdmin->user_name,
                        'remarks' => 'Waiting for your approval',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($vehicleDataAdmin);

        }

        // Notify the Assign Personne
        $assignPersonnel = InspectionModel::where('personnel_id', $id)
            ->whereIn('inspector_status', [3, 2])
            ->where('form_status', '!=', 3)
            ->get()
            ->map(function ($inspectionForm){
                return [
                    'id' => $inspectionForm->id,
                    'type' => 'Pre/Post Repair Inspection Form',
                    'date_request' => $inspectionForm->created_at,
                    'requestor' => $inspectionForm->user_name,
                    'remarks' => $inspectionForm->inspector_status == 3 ? "You are assigned to this request." : "You still need to fill out Part D.",
                ];
            });
        $pendingApproval = $pendingApproval->merge($assignPersonnel);

        // Notify the Port Manager
        $PortManagerRequest = PPAEmployee::where('id', $id)
        ->where('code_clearance', 'LIKE', "%PM%")
        ->first();

        if($PortManagerRequest) {
            // Vehicle
            $vehicleDataPM = VehicleSlipModel::whereIn('admin_approval', [11])
                ->get()
                ->map(function ($vehicleDataPM) {
                    return [
                        'id' => $vehicleDataPM->id,
                        'type' => 'Vehicle Slip Form',
                        'date_request' => $vehicleDataPM->created_at,
                        'requestor' => $vehicleDataPM->user_name,
                        'remarks' => 'Waiting for your approval',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($vehicleDataPM);
        }
        

        $responseData = $pendingApproval->isEmpty() ? null : $pendingApproval->sortBy('date_request')->values();

        return response()->json(['pending_approved' => $responseData]);
    }
}
