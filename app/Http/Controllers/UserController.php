<?php

namespace App\Http\Controllers;

use App\Models\PPAEmployee;
use App\Models\InspectionModel;
use App\Models\FacilityVenueModel;
use App\Models\VehicleSlipModel;
use App\Models\LogsModel;
use App\Models\AssignPersonnelModel;
use App\Models\NotificationModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\PPASecurity;

class UserController extends Controller
{

    /**
     * User's Status Code
     * 
     * 0 - Not Active / Deactivate
     * 1 - Active
     * 2 - Change Password
     */

    /**
     * Check the User's Code Clearance
     */
    public function checkCode($id){

        $data = PPAEmployee::find($id);
        $codeClearance = $data->code_clearance;

        return response()->json($codeClearance);
    }

    /**
     * Show all User Employee's Data
     */
    public function showEmployee(){
        // Root URL
        $rootUrl = URL::to('/');

        $data = PPAEmployee::all();

        $userData = [];

        foreach ($data as $user){
            $userData[] = [
                'id' => $user->id,
                'name' => strtoupper($user->lastname). ", ".$user->firstname. " ".$user->middlename. ".",
                'username' => $user->username,
                'division' => $user->division,
                'position' => $user->position,
                'code_clearance' => $user->code_clearance,
                'avatar' =>  $rootUrl . '/storage/displaypicture/' . $user->avatar,
                'status' => $user->status,
            ];
        }
        
        return response()->json($userData);
    }

    /**
     * Get Supervisor
     */
    public function getSupervisor(){

        $getDM = 'DM';

        $data = PPAEmployee::where('code_clearance', 'LIKE', "%{$getDM}%")->get();

        $filteredManagers = $data->map(function ($dm) {
            return[
                'id' => $dm->id,
                'name' => $dm->firstname. ' ' .$dm->middlename. '. ' .$dm->lastname,
            ];
        });

        return response()->json($filteredManagers);
    }

    /**
     * Get GSO
     */
    public function getGSO(){

        $getGSO = 'GSO';

        $data = PPAEmployee::where('code_clearance', 'LIKE', "%{$getGSO}%")->first();


        $getGSO = [
            'id' => $data->id,
            'name' => $data->firstname. ' ' .$data->middlename. '. ' .$data->lastname,
        ];

        return response()->json($getGSO);
    }

    /**
     * Get User Employee Data (Individual)
     */
    public function employeeDetails($id){
        // Root URL
        $rootUrl = URL::to('/');

        $data = PPAEmployee::find($id);

        $userData = [
            'id' => $data->id,
            'firstname' => $data->firstname,
            'middlename' => $data->middlename,
            'lastname' => $data->lastname,
            'name' => $data->firstname ." " . $data->middlename . ". " . $data->lastname,
            'username' => $data->username,
            'division' => $data->division,
            'position' => $data->position,
            'code_clearance' => $data->code_clearance,
            'avatar' =>  $rootUrl . '/storage/displaypicture/' . $data->avatar,
            'esig' => $rootUrl . '/storage/displayesig/' . $data->esign,
            'status' => $data->status,
        ];

        return response()->json($userData);
    }

    /**
     * Update User's Detail
     */
    public function updateEmployeeDetail(Request $request, $id){

        //Validate
        $validateData = $request->validate([
            'firstname' => 'required|string',
            'middlename' => 'required|string',
            'lastname' => 'required|string',
            'position' => 'required|string',
            'division' => 'required|string',
        ]);

        $getUser = PPAEmployee::find($id);

        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update Data
        $updateDetails = $getUser->update([
            'firstname' =>  $validateData['firstname'],
            'middlename' => $validateData['middlename'],
            'lastname' => $validateData['lastname'],
            'position' => $validateData['position'],
            'division' => $validateData['division'],
        ]);

        if($updateDetails){

            // Logs
            $logs = new LogsModel();
            $logs->category = 'USER';
            $logs->message = $request->input('authority').' updated the details of '.$validateData['firstname'].' '.$validateData['middlename'].'. '.$validateData['lastname'].'.';
            $logs->save();

            return response()->json(['message' => 'User details updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'There area some missing.'], 204);
        }
    }

    /**
     * Update User's Code Clearance
     */
    public function updateEmployeeCodeClearance(Request $request, $id){
        // Validate
        $validateCC = $request->validate([
            'code_clearance' => 'required|string',
        ]);

        // Find the user
        $getUser = PPAEmployee::find($id);

        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Check if "AP" exists in the current code clearance
        $currentCodeClearance = $getUser->code_clearance;
        $newCodeClearance = $validateCC['code_clearance'];

        // Remove "AP" if it appears anywhere in the new code clearance input
        $newCodeClearance = str_replace('AP', '', $newCodeClearance);

        // Add "AP" to the end if it was in the original data
        if (str_contains($currentCodeClearance, 'AP')) {
            $newCodeClearance .= ', AP';
        }

        // Update Data
        $updateCC = $getUser->update([
            'code_clearance' => $newCodeClearance,
        ]);

        if($updateCC){
            // Logs
            $logs = new LogsModel();
            $logs->category = 'USER';
            $logs->message = $request->input('authority').' updated the code clearance of '.$request->input('name').'.';
            $logs->save();

            return response()->json(['message' => 'User details updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'There are some missing details.'], 204);
        }

    }

    /**
     * Update User's Avatar
     */
    public function updateEmployeeAvatar(Request $request, $id){

        // Validate the avatar file
        $validateAvatar = $request->validate([
            'avatar' => [
                'nullable', 
                'file', 
                'mimes:png,jpeg,jpg',
                'max:2048'
            ]
        ]);

        $getUser = PPAEmployee::find($id);

        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Check if a file was uploaded
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $extension = $avatar->getClientOriginalExtension();

            $name = preg_replace('/\s+/', '_', trim($getUser->firstname)) . '_' . $getUser->lastname;
            $timestamp = now()->timestamp; // Using timestamp for unique file naming
            $avatarName = $name . '_' . $timestamp . '_avatar.' . $extension;

            // Delete the old image if it exists
            if (!empty($getUser->avatar) && Storage::disk('public')->exists('displaypicture/' . $getUser->avatar)) {
                Storage::disk('public')->delete('displaypicture/' . $getUser->avatar);
            }

            // Save the new image to the public disk
            Storage::disk('public')->put('displaypicture/' . $avatarName, file_get_contents($avatar));

            // Update the user's avatar field in the database
            $getUser->update(['avatar' => $avatarName]);

            // Update Notification
            NotificationModel::where('sender_id', $getUser->id)->update(['sender_avatar' => $avatarName]);


            // Logs
            $logs = new LogsModel();
            $logs->category = 'USER';
            $logs->message = $request->input('authority').' updated the avatar of '.$request->input('name').'.';
            $logs->save();

            return response()->json(['message' => 'Avatar updated successfully'], 200);
        } else {
            return response()->json(['message' => 'No file uploaded'], 422);
        }
    }

    /**
     * Update User's Esignature
     */
    public function updateEmployeeEsig(Request $request, $id) {
        // Validate the avatar file
        $validateAvatar = $request->validate([
            'esig' => [
                'nullable', 
                'file', 
                'mimes:png,jpeg,jpg',
                'max:2048'
            ]
        ]);
    
        // Find the user by ID
        $getUser = PPAEmployee::find($id);
    
        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        // Check if a file was uploaded
        if ($request->hasFile('esig')) {
            $esig = $request->file('esig');
            $extension = $esig->getClientOriginalExtension();
    
            $name = preg_replace('/\s+/', '_', trim($getUser->firstname)) . '_' . $getUser->lastname;
            $timestamp = now()->timestamp; // Using timestamp for unique file naming
            $esigName = $name . '_' . $timestamp . '_esig.' . $extension;
    
            // Delete the old image if it exists
            if (!empty($getUser->esign) && Storage::disk('public')->exists('displayesig/' . $getUser->esign)) {
                Storage::disk('public')->delete('displayesig/' . $getUser->esign);
            }
    
            // Save the new image to the public disk
            Storage::disk('public')->put('displayesig/' . $esigName, file_get_contents($esig));
    
            // Update the user's avatar field in the database
            $getUser->update(['esign' => $esigName]);

            // Logs
            $logs = new LogsModel();
            $logs->category = 'USER';
            $logs->message = $request->input('authority').' updated the esignature of '.$request->input('name').'.';
            $logs->save();
    
            return response()->json(['message' => 'Avatar updated successfully'], 200);
        } else {
            return response()->json(['message' => 'No file uploaded'], 422);
        }
    }

    /**
     * Update User's Account
     */
    public function updatePassword(Request $request, $id){
        // Validate
        $validateAcc = $request->validate([
            'username' => 'required|string',
            'password' => [
                'required',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ],
        ]);

        // Find the user
        $getUser = PPAEmployee::find($id);

        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update Data
        $updatePWD = $getUser->update([
            'username' => $validateAcc['username'],
            'password' =>  $validateAcc['password'],
            'status' =>  2,
        ]);

        if($updatePWD){

            // Logs
            $logs = new LogsModel();
            $logs->category = 'USER';
            $logs->message = $request->input('authority').' updated the account of '.$request->input('name');
            $logs->save();

            return response()->json(['message' => 'User details updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'There area some missing.'], 204);
        }
    }

    /**
     * Remove Account
     */
    public function removeEmployee(Request $request, $id){

        // Find the user by ID
        $getUser = PPAEmployee::find($id);

        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $getUser->status = 0;
        $getUser->save();

        // Logs
        $logs = new LogsModel();
        $logs->category = 'USER';
        $logs->message = $request->input('authority').' removed '.$request->input('name').' from the system.';
        $logs->save();

        return response()->json(['message' => 'Remove successfully'], 200);
    }

    /**
     * Get User's Request Form on JOMS
     */
    public function GetMyInspRequestJOMS($id){

        // For Inspection Form
        $getInspectionFormData = InspectionModel::where('user_id', $id)->orderBy('created_at', 'desc')->get();

        $inspDet = $getInspectionFormData->map(function ($inspectionForm) {
            return[
                'repair_id' => $inspectionForm->id,
                'repair_date_request' => $inspectionForm->created_at,
                'repair_property_number' => $inspectionForm->property_number,
                'repair_type' => $inspectionForm->type_of_property,
                'repair_description' => $inspectionForm->property_description,
                'repair_complain' => $inspectionForm->complain,
                'repair_supervisor_name' => $inspectionForm->supervisor_name,
                'repair_remarks' => $inspectionForm->form_remarks
            ];
        });

        // For Facility Form
        $getFacilityFormData = FacilityVenueModel::where('user_id', $id)->orderBy('created_at', 'desc')->get();

        $facDet = $getFacilityFormData->map(function ($facilityForm) {
            return[
                'fac_id' => $facilityForm->id,
                'fac_date_request' => $facilityForm->created_at,
                'fac_request_office' => $facilityForm->	request_office,
                'fac_title_of_activity' => $facilityForm->title_of_activity,
                'fac_date_start' => $facilityForm->date_start,
                'fac_time_start' => $facilityForm->time_start,
                'fac_date_end' => $facilityForm->date_end,
                'fac_time_end' => $facilityForm->time_end,
                'mph' => $facilityForm->mph,
                'conference' => $facilityForm->conference,
                'dorm' => $facilityForm->dorm,
                'other' => $facilityForm->other,
                'fac_remarks' => $facilityForm->remarks,
            ];
        });

        // For Vehicle Slip
        $getVehicleSlipData = VehicleSlipModel::where('user_id', $id)->orderBy('created_at', 'desc')->get();

        $vehDet = $getVehicleSlipData->map(function ($vehicleForm) {
            $passengerArray = ($vehicleForm->passengers && $vehicleForm->passengers !== 'None') 
                ? explode("\n", $vehicleForm->passengers) 
                : [];
            $passengerCount = count($passengerArray);

            return[
                'veh_id' => $vehicleForm->id,
                'veh_date_req' => $vehicleForm->created_at,
                'veh_purpose' => $vehicleForm->purpose,
                'veh_place' => $vehicleForm->place_visited,
                'veh_date' => $vehicleForm->date_arrival,
                'veh_time' => $vehicleForm->time_arrival,
                'veh_vehicle' => $vehicleForm->vehicle_type,
                'veh_driver' => $vehicleForm->driver,
                'veh_passengers' => $passengerCount,
                'status' => $vehicleForm->admin_approval,
                'remarks' => $vehicleForm->remarks
            ];
        });

        $responseData = [
            'inspection' => $inspDet->isEmpty() ? null : $inspDet,
            'facility' => $facDet->isEmpty() ? null : $facDet,
            'vehicle' => $vehDet->isEmpty() ? null : $vehDet,
        ];
        

        return response()->json($responseData);

    }

    /**
     * Show Assigned Personnel
     */
    public function showPersonnel(){

        // Get all assigned personnel data
        $assignedPersonnel = AssignPersonnelModel::all();

        // Extract pers onnel IDs
        $personnelIds = $assignedPersonnel->pluck('personnel_id');

        // Map personnel information along with the inspection count
        $result = $assignedPersonnel->map(function ($personnel) {
        
            return [
                'personnel_id' => $personnel->id,
                'personnel_name' => $personnel->personnel_name,
                'assignment' => $personnel->assignment,
                'status' => $personnel->status,
            ];
        });

        return response()->json($result);
    }

    /**
     * Display Assigned Personnel on select tag (PART B)
     */
    public function displayPersonnel($id){

        $inspection = InspectionModel::find($id);

        if (!$inspection) {
            // Return a 404 error if the inspection request is not found
            return response()->json(['error' => 'Inspection not found'], 404);
        }

        // Extract the type_of_property from the inspection
        $typeOfProperty = $inspection->type_of_property;

        // Define the filter conditions for personnel assignments
        $assignedPersonnel = [];

        if ($typeOfProperty === 'IT Equipment & Related Materials') {
            $assignedPersonnel = AssignPersonnelModel::whereIn('assignment', ['IT Service', 'Electronics', 'Electrical Works', 'Engeneering Services'])->get();
        }
        elseif ($typeOfProperty === 'Vehicle Supplies & Materials') {
            $assignedPersonnel = AssignPersonnelModel::where('assignment', 'Driver/Mechanic')->get();
        }
        elseif ($typeOfProperty === 'Others') {
            $assignedPersonnel = AssignPersonnelModel::all();
        }

        // Map personnel information
        $result = $assignedPersonnel->map(function ($personnel) {
            return [
                'personnel_id' => $personnel->personnel_id,
                'personnel_name' => $personnel->personnel_name,
                'assignment' => $personnel->assignment
            ];
        });

        return response()->json($result);
    }

    /**
     * Get Personnel
     */
    public function getPersonnel(){
        
        $data = AssignPersonnelModel::all();
        $getIds = $data->pluck('personnel_id');

        $employee = PPAEmployee::queryUserExcept($getIds)->whereNotIn('code_clearance', ['AM, MEM', 'PM, MEM', 'DM, MEM', 'GSO, MEM']);

        $userData = $employee->map(function ($user){
            return [
                'id' => $user->id,
                'name' => $user->firstname . ' ' . $user->middlename . '. ' . $user->lastname
            ];
        })->values()->all();
        
        return response()->json($userData);
    }

    /**
     * Assign Personnel
     */
    public function storePersonnel(Request $request){

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
     * Set Personnel to Not Available
     */
    public function notavailPersonnel(Request $request, $id){
        // Find the personnel assignment
        $data = AssignPersonnelModel::find($id);

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
     * Remove Assign Personnel
     */
    public function removePersonnel(Request $request, $id) {
        // Find the personnel assignment
        $data = AssignPersonnelModel::find($id);

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
     * Set to Available Assign Personnel
     */
    public function availablePersonnel(Request $request, $id){
        // Find the personnel assignment
        $data = AssignPersonnelModel::find($id);

        // Data not found
        if (!$data){
            return response()->json(['message' => 'Personnel not found'], 404);
        }

        // Update the status
        $data->status = 2;

        if($data->save()){
            // Creating logs only if both operations are successful
            $logs = new LogsModel();
            $logs->category = 'PERSONNEL';
            $logs->message = $request->input('authority').' has set '.$data->personnel_name.' to available.';
            $logs->save();
        }

        return response()->json(['message' => 'Personnel Available.'], 200);
    }

    // ---------- For the Security ---------- //
    
    // Get Security
    public function getSecurity(Request $request, $id)
    {
        $data = PPASecurity::where('user_id', $id)->first();

        if (!$data) {
            $security = null;
        } else {
            $security = [
                'id' => $data->id,
                'user_id' => $data->user_id,
                'datetime' => $data->created_at,
                'browser' => $data->browser,
            ];
        }

        return response()->json($security);
    }

    // Delete Security
    public function deleteSecurity(Request $request, $id)
    {
        // Delete the security entry based on user_id
        $data = PPASecurity::where('user_id', $id)->delete();

        // Find the user and revoke all tokens
        $user = PPAEmployee::find($id);
        if ($user) {
            $user->tokens()->delete(); // Deletes all tokens for the user
        }

        if ($data) {
            // Creating logs only if deletion was successful
            $logs = new LogsModel();
            $logs->category = 'User';
            $logs->message = $request->input('logs', 'Deleted security entry'); // Default message if not provided
            $logs->save();
        }

        return response()->json(['success' => $data > 0, 'deleted_rows' => $data]);
    }


}
