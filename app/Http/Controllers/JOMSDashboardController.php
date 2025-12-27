<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use App\Models\InspectionModel;
use App\Models\FacilityVenueModel;
use App\Models\PPAEmployee;
use App\Models\VehicleSlipModel;
use App\Models\NotificationModel;
use App\Models\VehicleTypeModel;
use App\Models\AssignPersonnelModel;
use App\Models\FormTracker;
use Carbon\Carbon;

class JOMSDashboardController extends Controller
{
    /**
     *  Count Everyone
     */
    public function FormCount(){
        $today = Carbon::today();

        // For the Inspection
        $inspToday = InspectionModel::whereDate('created_at', $today)->count();
        $inspcount = InspectionModel::count();

        // For vehicle Check
        $vehToday = VehicleSlipModel::whereDate('created_at', $today)->count();
        $vehcount = VehicleSlipModel::count();

        // For Facility Check
        $facToday = FacilityVenueModel::whereDate('created_at', $today)->count();
        $faccount = FacilityVenueModel::count();

        $data = [
            'inspection' => [
                'today' => $inspToday,
                'count' => $inspcount
            ],
            'vehicle' => [
                'today' => $vehToday,
                'count' => $vehcount
            ],
            'facility' => [
                'today' => $facToday,
                'count' => $faccount
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
        
        // ❗ Check if empty after map()
        if ($onTravel->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
        }

        return response()->json(['on_travel' => $onTravel]);
    }

    /**
     *  Pending Request
     */
    public function PendingRequest($id){
        $pendingApproval = collect(); 

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
            $vehicleDataGSO = VehicleSlipModel::whereIn('admin_approval', [6, 7, 9])
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
            $facilityDataAdmin = FacilityVenueModel::whereIn('admin_approval', [5, 7])
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
            $vehicleDataAdmin = VehicleSlipModel::whereIn('admin_approval', [4, 8])
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
                    'remarks' => $inspectionForm->form_status == 4 ? "You are assigned to this request." : "You still need to fill out Part D.",
                ];
            });
        $pendingApproval = $pendingApproval->merge($assignPersonnel);

        // Notify the Authoritize Person on Vehicle Slip
        $AURequest = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%AU%")
            ->first();

        if($AURequest) {

            // Vehicle
            $vehicleDataAU = VehicleSlipModel::whereIn('admin_approval', [6, 7, 9])
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
            $vehicleDataPM = VehicleSlipModel::whereIn('admin_approval', [5, 8])
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
            $gsoCount += VehicleSlipModel::whereIn('admin_approval', [6, 7, 9])->count();
        }

        // ---- Admin Area ---- //
        $isAM = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%AM%")
            ->exists();

        $amCount = 0;

        if ($isAM) {
            $amCount += InspectionModel::where('form_status', 5)->count();
            $amCount += FacilityVenueModel::whereIn('admin_approval', [5, 7])->count();
            $amCount += VehicleSlipModel::whereIn('admin_approval', [4, 8])->count();
        }

        // ---- Authorize Person Area ---- //
        $isAU = PPAEmployee::where('id', $id)
                ->where('code_clearance', 'LIKE', "%AU%")
                ->exists();

        $auCount = 0;

        if($isAU) {
            $auCount += VehicleSlipModel::whereIn('admin_approval', [6, 7, 9])->count();
        }

        // ---- Authorize Port Manager ---- //
        $isPortManager = PPAEmployee::where('id', $id)
            ->where('code_clearance', 'LIKE', "%PM%")
            ->exists();

        $pmCount = 0;

        if($isPortManager) {
            $pmCount += VehicleSlipModel::whereIn('admin_approval', [5, 8])->count();
        }

        // Merge/Sum the counts
        $totalCount = $supervisorCount + $gsoCount + $amCount + $assignpersonnelCount + $auCount + $pmCount;

        // Return response
        return response()->json([
            'pending_count' => $totalCount === 0 ? null : $totalCount
        ]);
    }

    /**
     *  Form Tracking
     */
    public function FormTracking(Request $request, $id){
        $type = $request->query('type'); 
        $track = FormTracker::where('form_id', $id)->where('type_of_request', $type)->orderBy('created_at', 'desc')->get();

        if(!$track){
            return response()->json(['error' => 'User not found.'], 404);
        }

        $trackDetails = $track->map(function ($trackForm) {
            return[
                'id' => $trackForm->id,
                'form_id' => $trackForm->form_id,
                'type_of_request' => $trackForm->type_of_request,
                'remarks' => $trackForm->remarks,
                'date' => $trackForm->created_at->toDateString(),
                'time' => $trackForm->created_at->format('h:i a'),
            ];
        });

        // Return response
        return response()->json($trackDetails);
    }

    /**
     *  Personnel with Most Requested
     */
    public function getPersonnelRequest()
    {
        $rootUrl = URL::to('/');

        // Inspection
        $inspection = InspectionModel::select(
                'user_id',
                'user_name',
                DB::raw('COUNT(*) as inspection_total'),
                DB::raw('0 as facility_total'),
                DB::raw('0 as vehicle_total')
            )
            ->groupBy('user_id', 'user_name');

        // Facility
        $facility = FacilityVenueModel::select(
                'user_id',
                'user_name',
                DB::raw('0 as inspection_total'),
                DB::raw('COUNT(*) as facility_total'),
                DB::raw('0 as vehicle_total')
            )
            ->groupBy('user_id', 'user_name');

        // Vehicle
        $vehicle = VehicleSlipModel::select(
                'user_id',
                'user_name',
                DB::raw('0 as inspection_total'),
                DB::raw('0 as facility_total'),
                DB::raw('COUNT(*) as vehicle_total')
            )
            ->groupBy('user_id', 'user_name');

        // Combine all
        $combined = $inspection
            ->unionAll($facility)
            ->unionAll($vehicle);

        // Final aggregation
        $result = DB::query()
            ->fromSub($combined, 'requests')
            ->leftJoin('ppa_user as e', 'e.id', '=', 'requests.user_id')
            ->select(
                'requests.user_id',
                'requests.user_name',
                DB::raw("CONCAT('$rootUrl/storage/displaypicture/', e.avatar) as avatar"),

                DB::raw('SUM(requests.inspection_total) as inspection_count'),
                DB::raw('SUM(requests.facility_total) as facility_count'),
                DB::raw('SUM(requests.vehicle_total) as vehicle_count'),

                DB::raw('
                    SUM(requests.inspection_total) +
                    SUM(requests.facility_total) +
                    SUM(requests.vehicle_total)
                    as no_of_requests
                ')
            )
            ->groupBy('requests.user_id', 'requests.user_name', 'e.avatar')
            ->orderByDesc('no_of_requests')
            ->limit(5)
            ->get();

        return response()->json($result);
    }
        
}
