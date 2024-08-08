<?php

namespace App\Http\Controllers;

use App\Models\PPAEmployee;
use App\Models\LogsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
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
            'username' => 'required|string',
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
            'username' => $validateData['username'],
        ]);

        if($updateDetails){

            // Logs
            $logs = new LogsModel();
            $logs->category = 'User';
            $logs->message = $request->input('logs');
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

        $getUser = PPAEmployee::find($id);

        if (!$getUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update Data
        $updateCC = $getUser->update([
            'code_clearance' => $validateCC['code_clearance'],
        ]);

        if($updateCC){

            // Logs
            $logs = new LogsModel();
            $logs->category = 'User';
            $logs->message = $request->input('logs');
            $logs->save();

            return response()->json(['message' => 'User details updated successfully.'], 200);
        } else {
            return response()->json(['message' => 'There area some missing.'], 204);
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

            // Logs
            $logs = new LogsModel();
            $logs->category = 'User';
            $logs->message = $request->input('logs');
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
            $logs->category = 'User';
            $logs->message = $request->input('logs');
            $logs->save();
    
            return response()->json(['message' => 'Avatar updated successfully'], 200);
        } else {
            return response()->json(['message' => 'No file uploaded'], 422);
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
        $logs->category = 'User';
        $logs->message = $request->input('logs');
        $logs->save();

        return response()->json(['message' => 'Remove successfully'], 200);
    }

}
