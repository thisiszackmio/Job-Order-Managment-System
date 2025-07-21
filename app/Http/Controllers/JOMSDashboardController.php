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

    /**
     *  Pending Request
     */
    public function PendingRequest($id){
        $pendingApproval = collect(); 

        // Only the Developer to access
        if($id == 1){
            // For the Inspection
            $inspectionData = InspectionModel::whereNotIn('form_status', [0, 1, 2, 7])
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

            $pendingApproval = $pendingApproval->merge($inspectionData);

            // For the Facility / Venue
            $facilityData = FacilityVenueModel::whereNotIn('admin_approval', [0, 1, 2, 4])
                ->get()
                ->map(function ($facilityData) {
                    return [
                        'id' => $facilityData->id,
                        'type' => 'Facility / Venue Form',
                        'date_request' => $facilityData->created_at,
                        'requestor' => $facilityData->user_name,
                        'remarks' => $facilityData->remarks,
                    ];
                });

            $pendingApproval = $pendingApproval->merge($facilityData);

            // For the Vehicle Slip
            $vehicleData = VehicleSlipModel::whereNotIn('admin_approval', [0, 1, 2])
                ->get()
                ->map(function ($vehicleData) {
                    return [
                        'id' => $vehicleData->id,
                        'type' => 'Vehicle Slip Form',
                        'date_request' => $vehicleData->created_at,
                        'requestor' => $vehicleData->user_name,
                        'remarks' => $vehicleData->remarks,
                    ];
                });

            $pendingApproval = $pendingApproval->merge($vehicleData);
        }else{
            // Pending Approval for the Supervisor
            $inspectionDataSup = InspectionModel::where('supervisor_id', $id)
                ->where('form_status', 11)
                ->get()
                ->map(function ($inspectionForm){
                    return [
                        'id' => $inspectionForm->id,
                        'type' => 'Pre/Post Repair Inspection Form',
                        'date_request' => $inspectionForm->created_at,
                        'requestor' => $inspectionForm->user_name,
                        'remarks' => 'Waiting for your approval',
                    ];
                });

            $pendingApproval = $pendingApproval->merge($inspectionDataSup);
        
        
            // Notify the GSO
            $GSORequest = PPAEmployee::where('id', $id)
                ->where('code_clearance', 'LIKE', "%GSO%")
                ->first();

            if ($GSORequest) {

                // Inspection Form
                $inspectionDataGSO = InspectionModel::whereIn('form_status', [6, 8, 9, 10])
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
                $facilityDataGSO = FacilityVenueModel::whereIn('admin_approval', [3, 6])
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
                $vehicleDataGSO = VehicleSlipModel::whereIn('admin_approval', [5, 6, 8])
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

            // Notify the Admin
            $AdminManagerRequest = PPAEmployee::where('id', $id)
                ->where('code_clearance', 'LIKE', "%AM%")
                ->first();

            if ($AdminManagerRequest) {

                // If Admin Manager clearance is valid, add Admin Manager-related data
                $inspectionDataAM = InspectionModel::where('form_status', 5)
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
                $facilityDataAdmin = FacilityVenueModel::whereIn('admin_approval', [6, 7])
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
                $vehicleDataAdmin = VehicleSlipModel::whereIn('admin_approval', [3, 7])
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

            // Notify the Assign Personne/
            $assignPersonnel = InspectionModel::where('personnel_id', $id)
                ->whereIn('form_status', [4, 3])
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

            // Notify the Authoritize Person on Vehicle Slip
            $AURequest = PPAEmployee::where('id', $id)
                ->where('code_clearance', 'LIKE', "%AU%")
                ->first();

            if($AURequest) {

                // Vehicle
                $vehicleDataAU = VehicleSlipModel::whereIn('admin_approval', [5, 6, 8])
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
        
            // Notify the Port Manager
            $PortManagerRequest = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%PM%")
            ->first();

            if($PortManagerRequest) {
                // Vehicle
                $vehicleDataPM = VehicleSlipModel::whereIn('admin_approval', [4, 7])
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
        }

        $responseData = $pendingApproval->isEmpty() ? null : $pendingApproval->sortBy('date_request')->values();
        return response()->json(['pending_approved' => $responseData]);
    }

    /**
     *  Pending Request Count
     */
    public function PendingRequestCount($id){

        // Count for supervisor-specific pending approvals
        $supervisorCount = InspectionModel::where('supervisor_id', $id)
            ->where('form_status', 11)
            ->count();

        // Count general Assign Personnel
        $assignpersonnelCount = InspectionModel::where('personnel_id', $id)
            ->whereIn('form_status', [4, 3])
            ->count();

        // ---- GSO Area ---- //
        $isGSO = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%GSO%")
            ->exists();

        $gsoCount = 0;

        if ($isGSO) {
            $gsoCount += InspectionModel::whereIn('form_status', [6, 8, 9, 10])->count();
            $gsoCount += FacilityVenueModel::whereIn('admin_approval', [3, 6])->count();
            $gsoCount += VehicleSlipModel::whereIn('admin_approval', [5, 6, 8])->count();
        }

        // ---- Admin Area ---- //
        $isAM = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%AM%")
            ->exists();

        $amCount = 0;

        if ($isAM) {
            $amCount += InspectionModel::where('form_status', 5)->count();
            $amCount += FacilityVenueModel::whereIn('admin_approval', [6, 7])->count();
            $amCount += VehicleSlipModel::whereIn('admin_approval', [3, 7])->count();
        }

        // ---- Authorize Person Area ---- //
        $isAU = PPAEmployee::where('id', $id)
                ->where('code_clearance', 'LIKE', "%AU%")
                ->exists();

        $auCount = 0;

        if($isAU) {
            $auCount += VehicleSlipModel::whereIn('admin_approval', [5, 6, 8])->count();
        }

        // ---- Authorize Port Manager ---- //
        $isPortManager = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%PM%")
            ->exists();

        $pmCount = 0;

        if($isPortManager) {
            $pmCount += VehicleSlipModel::whereIn('admin_approval', [4, 7])->count();
        }

        // Merge/Sum the counts
        $totalCount = $supervisorCount + $gsoCount + $amCount + $assignpersonnelCount + $auCount + $pmCount;

        // Return response
        return response()->json([
            'pending_count' => $totalCount === 0 ? null : $totalCount
        ]);
    }
        
}
