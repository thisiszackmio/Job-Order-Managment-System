<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\AssignPersonnelModel;
use App\Models\VehicleSlipModel;
use App\Models\PPAEmployee;
use App\Models\VehicleTypeModel;
use App\Models\LogsModel;

class TravelDetailController extends Controller
{
    /**
     * Show Driver Personnel
     * Status
     * 0 - Available
     * 1 - Arrived
     * 2 - On Travel
     * 3 - Not Available
     * 
     */
    public function showDrivers(){
        // Get all assigned personnel data
        $driverPersonnel = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->get();

        // Map personnel information along with the inspection count
        $result = $driverPersonnel->map(function ($driver) {
            $driverCount = VehicleSlipModel::where('driver_id', $driver->personnel_id)->count();
            $status = match($driver->status) {
                2 => "On Travel",
                3 => "Not Available",
                default => "Available"
            };
            return [
                'id' => $driver->id,
                'personnel_id' => $driver->personnel_id,
                'personnel_name' => $driver->personnel_name,
                'NoOfAssigment' => $driverCount,
                'status' => $status,
                'date_assigned' => $driver->date_assigned
            ];
        });

        return response()->json($result);
    }

    /**
     * Show All Driver Personnel
     * 
     */
    public function showDriversPersonnels(){
        $data = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->orderBy('personnel_name', 'ASC')->get();
        $getIds = $data->pluck('personnel_id');

        $employee = PPAEmployee::queryUserExcept($getIds)->whereNotIn('code_clearance', ['AM', 'PM', 'DM', 'GSO'])->whereIn('status', [1, 2]);

        $userData = $employee->map(function ($user){
            return [
                'id' => $user->id,
                'name' => $user->firstname . ' ' . $user->middlename . '. ' . $user->lastname
            ];
        })->values()->all();

        return response()->json($userData);
    }

    /**
     * Add Driver Personnel
     * 
     */
    public function addDriverPersonnels(Request $request){
        //Validate
        $personnelData = $request->validate([
            'personnel_id' => 'required|numeric',
            'personnel_name' => 'required|string',
            'assignment' => 'required|string',
            'status' => 'required|numeric'
        ]);

        $deploymentData = AssignPersonnelModel::create($personnelData);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        } else {
                // Find the Personnel ID for adding 'AP' on Code Clearance
                $findPersonnel = PPAEmployee::find($personnelData['personnel_id']);

                $currentClearances = explode(', ', $findPersonnel->code_clearance); // Convert to array

                // Add 'AP' to the array if it's not already present
                if (!in_array('AP', $currentClearances)) {
                    $currentClearances[] = 'AP';
                }

                // Convert back to a comma-separated string
                $updatedClearances = implode(', ', $currentClearances);

                // Save the updated clearances back to the model
                $findPersonnel->code_clearance = $updatedClearances;

                if($findPersonnel->save()) {
                    // Creating logs
                    $logs = new LogsModel();
                    $logs->category = 'PERSONNEL';
                    $logs->message = $personnelData['personnel_name'].' has been assigned to the '.$personnelData['assignment'].' list.';
                    $logs->save();
                }

            }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Set the Driver to not Available
     * 
     */
    public function notavailDriver(Request $request, $id){
        // Find the personnel assignment
        $data = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->where('personnel_id', $id)->first();

        // Data not found
        if (!$data){
            return response()->json(['message' => 'Personnel not found'], 404);
        }

        // Update the status
        $data->status = 3;
        $data->date_assigned = null;

        if($data->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'PERSONNEL';
            $logs->message = $request->input('authority').' has set '.$data->personnel_name.' to not available.';
            $logs->save();
        }

        return response()->json(['message' => 'Personnel Available.'], 200);
    }

    /**
     * Set the Driver to Available
     * 
     */
    public function availDriver(Request $request, $id){
        // Find the personnel assignment
        $data = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->where('personnel_id', $id)->first();

        // Data not found
        if (!$data){
            return response()->json(['message' => 'Personnel not found'], 404);
        }

        // Update the status
        $data->status = 0;
        $data->date_assigned = null;

        if($data->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'PERSONNEL';
            $logs->message = $request->input('authority').' has set '.$data->personnel_name.' to available.';
            $logs->save();
        }

        return response()->json(['message' => 'Personnel Available.'], 200);
    }

    /**
     * Remove Driver
     * 
     */
    public function removePersonnel(Request $request, $id){
        // Find the personnel assignment
        $data = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->where('personnel_id', $id)->first();

        // Data not found
        if (!$data){
            return response()->json(['message' => 'Personnel not found'], 404);
        }

        // Find the associated personnel
        $findPersonnel = PPAEmployee::find($data->personnel_id);

        // Personnel data not found
        if(!$findPersonnel) {
            return response()->json(['message' => 'Associated personnel not found.'], 404);
        }

        // Update the code clearance by removing 'AP'
        $currentClearances = explode(',', $findPersonnel->code_clearance); // Convert to array

        // Trim each clearance value to avoid spaces issues
        $currentClearances = array_map('trim', $currentClearances);

        // Remove 'AP' from the array
        $currentClearances = array_filter($currentClearances, function($clearance) {
            return $clearance !== 'AP';
        });
    
        // Convert back to a comma-separated string
        $updatedClearances = implode(', ', $currentClearances);
        $findPersonnel->code_clearance = $updatedClearances;
    
        if (!$findPersonnel->save()) {
            return response()->json(['message' => 'Failed to update code clearance.'], 500);
        }
    
        // Delete the personnel assignment
        $deleted = $data->delete();
    
        if(!$deleted) {
            return response()->json(['message' => 'Failed to delete personnel'], 500);
        }

        // Creating logs only if both operations are successful
        $logs = new LogsModel();
        $logs->category = 'Personnel';
        $logs->message = $request->input('authority').' has removed one of the assigned personnel from the list.';
        $logs->save();
    
        return response()->json(['message' => 'Personnel deleted and code clearance updated successfully.'], 200);
    }

    /**
     * Show Personnel
     * 
     */
    public function showPersonnel(){
        // Get all assigned personnel data
        $assignPersonnel = AssignPersonnelModel::whereNot('assignment', 'Driver/Mechanic')->get();

        // Map personnel information along with the inspection count
        $result = $assignPersonnel->map(function ($assign) {
            return [
                'id' => $assign->id,
                'personnel_id' => $assign->personnel_id,
                'assignment' => $assign->assignment,
                'personnel_name' => $assign->personnel_name,
            ];
        });

        return response()->json($result);
    }

    /**
     * Show All Personnel
     * 
     */
    public function showAssignPersonnels(){
        $data = AssignPersonnelModel::whereNot('assignment', 'Driver/Mechanic')->orderBy('personnel_name', 'ASC')->get();
        $getIds = $data->pluck('personnel_id');

        $employee = PPAEmployee::queryUserExcept($getIds)->whereNotIn('code_clearance', ['AM', 'PM', 'DM', 'GSO'])->whereIn('status', [1, 2]);

        $userData = $employee->map(function ($user){
            return [
                'id' => $user->id,
                'name' => $user->firstname . ' ' . $user->middlename . '. ' . $user->lastname
            ];
        })->values()->all();

        return response()->json($userData);
    }

    /**
     * Add Assign Personnel
     * 
     */
    public function addAssignPersonnels(Request $request){
        //Validate
        $personnelData = $request->validate([
            'personnel_id' => 'required|numeric',
            'personnel_name' => 'required|string',
            'assignment' => 'required|string',
            'status' => 'required|numeric'
        ]);

        $deploymentData = AssignPersonnelModel::create($personnelData);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        } else {
                // Find the Personnel ID for adding 'AP' on Code Clearance
                $findPersonnel = PPAEmployee::find($personnelData['personnel_id']);

                $currentClearances = explode(', ', $findPersonnel->code_clearance); // Convert to array

                // Add 'AP' to the array if it's not already present
                if (!in_array('AP', $currentClearances)) {
                    $currentClearances[] = 'AP';
                }

                // Convert back to a comma-separated string
                $updatedClearances = implode(', ', $currentClearances);

                // Save the updated clearances back to the model
                $findPersonnel->code_clearance = $updatedClearances;

                if($findPersonnel->save()) {
                    // Creating logs
                    $logs = new LogsModel();
                    $logs->category = 'PERSONNEL';
                    $logs->message = $personnelData['personnel_name'].' has been assigned to the '.$personnelData['assignment'].' list.';
                    $logs->save();
                }

            }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Remove Driver
     * 
     */
    public function removeAssignPersonnel(Request $request, $id){
        // Find the personnel assignment
        $data = AssignPersonnelModel::whereNot('assignment', 'Driver/Mechanic')->where('personnel_id', $id)->first();

        // Data not found
        if (!$data){
            return response()->json(['message' => 'Personnel not found'], 404);
        }

        // Find the associated personnel
        $findPersonnel = PPAEmployee::find($data->personnel_id);

        // Personnel data not found
        if(!$findPersonnel) {
            return response()->json(['message' => 'Associated personnel not found.'], 404);
        }

        // Update the code clearance by removing 'AP'
        $currentClearances = explode(',', $findPersonnel->code_clearance); // Convert to array

        // Trim each clearance value to avoid spaces issues
        $currentClearances = array_map('trim', $currentClearances);

        // Remove 'AP' from the array
        $currentClearances = array_filter($currentClearances, function($clearance) {
            return $clearance !== 'AP';
        });
    
        // Convert back to a comma-separated string
        $updatedClearances = implode(', ', $currentClearances);
        $findPersonnel->code_clearance = $updatedClearances;
    
        if (!$findPersonnel->save()) {
            return response()->json(['message' => 'Failed to update code clearance.'], 500);
        }
    
        // Delete the personnel assignment
        $deleted = $data->delete();
    
        if(!$deleted) {
            return response()->json(['message' => 'Failed to delete personnel'], 500);
        }

        // Creating logs only if both operations are successful
        $logs = new LogsModel();
        $logs->category = 'Personnel';
        $logs->message = $request->input('authority').' has removed one of the assigned personnel from the list.';
        $logs->save();
    
        return response()->json(['message' => 'Personnel deleted and code clearance updated successfully.'], 200);
    }

    /**
     *  Get The Vehicle on the Form
     */
    public function getVehicleDetails(Request $request){
        // Get Vehicle Details
        $VehicleDetailRequest = VehicleTypeModel::all();

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Modify data functions on vehicle usage and details
        $vehicleData = $VehicleDetailRequest->map(function ($vehicle) {
            $vehicleName = $vehicle->vehicle_name. ' ('. $vehicle->vehicle_plate .')';
            $slipCount = VehicleSlipModel::where('vehicle_type', $vehicleName)->count();
            $status = match($vehicle->status) {
                2 => "On Travel",
                3 => "Not Available",
                default => "Available"
            };
            return [
                'vehicle_id' => $vehicle->id,
                'vehicle_name' => $vehicle->vehicle_name,
                'vehicle_plate' => $vehicle->vehicle_plate,
                'vehicle_status' => $status,
                'vehicle_usage' => $slipCount
            ];
        });

        return response()->json($vehicleData);
    }

    /**
     *  Store Vehicle Details
     */
    public function storeVehicleDetails(Request $request){
        // Validate
        $vehicleValidate = $request->validate([
            'vehicle_name' => 'required|string',
            'vehicle_plate' => 'required|string',
            'status' => 'required|numeric'
        ]);

        // Create and save the deployment data
        $deploymentData = VehicleTypeModel::create($vehicleValidate);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'VEHICLE';
        $logs->message = $request->input('authority').' just added the vehicle details.';
        $logs->save();

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     *  Set to UnAvailable Vehicle
     */
    public function notavailableVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Update the status
        $VehicleDetailRequest->status = 3;
        $VehicleDetailRequest->date_used = null;

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'VEHICLE';
            $logs->message = $request->input('authority').' set the vehicle ('.$VehicleDetailRequest->vehicle_name.' - '.$VehicleDetailRequest->vehicle_plate.') to not available.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

    /**
     *  Delete Vehicle Details
     */
    public function removeVehicleDetails(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // For LOGS
        $logs = new LogsModel();
        $logs->category = 'VEHICLE';
        $logs->message = $request->input('authority').' just removed the vehicle ('.$VehicleDetailRequest->vehicle_name.'-'.$VehicleDetailRequest->vehicle_plate.') on the list.';
        $logs->save();

        // Delete the vehicle
        if($VehicleDetailRequest->delete()){
            return response()->json(['message' => 'Vehicle deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete vehicle'], 406);
        }

    }

    /**
     *  Update Vehicle Details
     */
    public function editVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        if($VehicleDetailRequest->vehicle_name === $request->input('vehicle_name') && $VehicleDetailRequest->vehicle_plate === $request->input('vehicle_plate')){
            return response()->json(['message' => 'No Changes'], 201);
        }else{

            $search = $VehicleDetailRequest->vehicle_name . ' (' . $VehicleDetailRequest->vehicle_plate . ')';
            $replace = $request->input('vehicle_name') . ' (' . $request->input('vehicle_plate') . ')';

            $updateData = VehicleSlipModel::where('vehicle_type', $search)
                ->update([
                    'vehicle_type' => $replace
                ]);

            // Update also the Vehicle Details
            $VehicleDetailRequest->vehicle_name = $request->input('vehicle_name');
            $VehicleDetailRequest->vehicle_plate = $request->input('vehicle_plate');
            $VehicleDetailRequest->save();

            if($updateData && $VehicleDetailRequest->wasChanged()){
                // Creating logs only if both operations are successful
                $logs = new LogsModel();
                $logs->category = 'VEHICLE';
                $logs->message = $request->input('authority').' has updated the vehicle.';
                $logs->save();
            }

            return response()->json(['message' => 'Vehicle Available.'], 200);
        }
    }

    /**
     *  Available Vehicle
     */
    public function availableVehicle(Request $request, $id){
        $VehicleDetailRequest = VehicleTypeModel::find($id);

        if (!$VehicleDetailRequest) {
            return response()->json(['error' => 'Data Error'], 404);
        }

        // Update the status
        $VehicleDetailRequest->status = 0;

        if($VehicleDetailRequest->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'VEHICLE';
            $logs->message = $request->input('authority').' set the vehicle ('.$VehicleDetailRequest->vehicle_name.' - '.$VehicleDetailRequest->vehicle_plate.') to available.';
            $logs->save();
        }

        return response()->json(['message' => 'Vehicle Available.'], 200);
    }

    /**
     *  Check Travel Slip
     */
    public function CheckDriverAvailability(Request $request){
        $today = Carbon::today();
        $date = $request->date;

        // Set the Vehicle and driver to auto available
        VehicleTypeModel::whereDate('date_used', '<', $today)
            ->whereIn('status', [1, 2])
            ->update([
                'status' => 0,
                'date_used' => null,
            ]);

        AssignPersonnelModel::whereDate('date_assigned', '<', $today)
            ->whereIn('status', [1, 2])
            ->update([
                'status' => 0,
                'date_assigned' => null,
            ]);

        // Check if the driver and vehicle are available on given date
        $reservedVehicles  = VehicleSlipModel::where('date_arrival', $date)
            ->whereIn('admin_approval', [2, 1])
            ->orderBy('date_arrival', 'desc')
            ->pluck('vehicle_type');

        $reservedDrivers = VehicleSlipModel::whereDate('date_arrival', $date)
            ->whereIn('admin_approval', [1, 2])
            ->pluck('driver_id')
            ->unique();

        // All vehicles
        $vehicles = VehicleTypeModel::get();

        // Map status Vehicle
        $vehicleResult = $vehicles->map(function ($vehicle) use ($reservedVehicles, $date) {

            $vehicleFullName = $vehicle->vehicle_name . ' (' . $vehicle->vehicle_plate . ')';

            $selectedDate = Carbon::parse($date)->toDateString();
            $vehicleDate  = $vehicle->date_used 
                ? Carbon::parse($vehicle->date_used)->toDateString() 
                : null;

            if ($vehicle->status == 2 && $vehicleDate === $selectedDate) {
                $status = 'On Travel';
            } elseif ($vehicle->status == 3) {
                $status = 'Not Available';
            }elseif ($vehicle->status == 1) {
                $status = 'Vacant';
            }elseif ($reservedVehicles->contains($vehicleFullName)) {
                $status = 'Reserve';
            } else {
                $status = 'Vacant';
            }

            return [
                'id' => $vehicle->id,
                'vehicle_name' => $vehicle->vehicle_name,
                'vehicle_plate' => $vehicle->vehicle_plate,
                'status' => $status,
            ];
        });

        // On Driver Side
        $drivers = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->get();

        $driverResult = $drivers->map(function ($driver) use ($reservedDrivers, $date) {

            $selectedDate = Carbon::parse($date)->toDateString();
            $driverDate   = $driver->date_assigned 
                ? Carbon::parse($driver->date_assigned)->toDateString() 
                : null;

            if ($driver->status == 2 && $driverDate === $selectedDate) {
                $status = 'On Travel';
            } elseif ($driver->status == 3) {
                $status = 'Not Available';
            } elseif ($driver->status == 1) {
                $status = 'Vacant';
            } elseif ($reservedDrivers->contains($driver->personnel_id)) {
                $status = 'Reserve';
            } else {
                $status = 'Vacant';
            }

            return [
                'id' => $driver->personnel_id,
                'name' => $driver->personnel_name,
                'status' => $status,
            ];
        });


        return response()->json([
            'vehicles' => $vehicleResult,
            'drivers' => $driverResult,
        ]);
    }

    /**
     *  Check On Going and Upcoming Travel
     */
    public function CheckTravelActivity(){
        $today = Carbon::today();

        $vehicleSlip = VehicleSlipModel::whereDate('date_arrival', '>=', $today)
            ->orderBy('date_arrival', 'asc')
            ->get();

        // Preload vehicles (avoid N+1)
        $vehicles = VehicleTypeModel::get();

        // Preload drivers
        $drivers = AssignPersonnelModel::get();

        // TODAY (On Travel only if BOTH are status = 1)
        $todayTrips = $vehicleSlip->filter(function ($item) use ($today, $vehicles, $drivers) {

            if (!Carbon::parse($item->date_arrival)->isSameDay($today)) {
                return false;
            }

            // Split vehicle
            preg_match('/^(.*)\s\((.*)\)$/', $item->vehicle_type, $matches);
            $vehicle_name  = $matches[1] ?? null;
            $vehicle_plate = $matches[2] ?? null;

            // Find vehicle
            $vehicle = $vehicles->first(function ($v) use ($vehicle_name, $vehicle_plate) {
                return $v->vehicle_name === $vehicle_name &&
                    $v->vehicle_plate === $vehicle_plate;
            });

            // Find driver
            $driver = $drivers->firstWhere('personnel_id', $item->driver_id);

            // BOTH must be On Travel
            return $vehicle && $driver &&
                $vehicle->status == 2 &&
                $driver->status == 2;
        })->values();

        // LATER (no need to check status)
        $laterTrips = $vehicleSlip->filter(function ($item) use ($today) {
            return Carbon::parse($item->date_arrival)->gt($today);
        })->values();

        return response()->json([
            'today' => $todayTrips,
            'later' => $laterTrips,
        ]);
    }

    /**
     *  Arrive Vehicle and Driver
     */
    public function arriveTravel($id){
        $vehicleData = VehicleSlipModel::where('id', $id)->first();
        $getDriverID = $vehicleData->driver_id;

        $getVehicle = $vehicleData->vehicle_type;
        preg_match('/^(.*)\s\((.*)\)$/', $getVehicle, $matches);

        $vehicle_name  = $matches[1] ?? null;
        $vehicle_plate = $matches[2] ?? null;

        // Update the Driver
        $assignDriver = AssignPersonnelModel::where('personnel_id', $getDriverID)
            ->update([
                'status' => 1,
            ]);

        // Update the Vehicle
        $assignVehicle = VehicleTypeModel::where('vehicle_name', $vehicle_name)
            ->where('vehicle_plate', $vehicle_plate)
            ->update([
                'status' => 1,
            ]);


        return response()->json(['message' => 'Arrived'], 200);
    }

    /**
     *  Check Travel Schedule
     */
    public function checkTravelSchedule(){
        $today = Carbon::today();

        // Check if there is schedule form today
        $vehicleData = VehicleSlipModel::whereDate('date_arrival', $today)->get();

        foreach ($vehicleData as $item) {

            // check if there is assigned and update
            $vehicleType = $item->vehicle_type;
            preg_match('/^(.*)\s\((.*)\)$/', $vehicleType, $matches);
            $vehicle_name  = $matches[1] ?? null;
            $vehicle_plate = $matches[2] ?? null;

            // For the Vehicle
            VehicleTypeModel::where('vehicle_name', $vehicle_name)
                ->where('vehicle_plate', $vehicle_plate)
                ->where('status', 0)
                ->update([
                    'status' => 2,
                    'date_used' => $item->date_arrival
                ]);

            // For the Driver
            $check = AssignPersonnelModel::where('personnel_id', $item->driver_id)
                ->where('status', 0)
                ->update([
                    'status' => 2,
                    'date_assigned' => $item->date_arrival
                ]);

        }

        return response()->json(['message' => 'Update'], 200);
    }

}
