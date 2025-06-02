<?php

namespace App\Http\Controllers;

use App\Models\PPAEmployee;
use App\Models\SuperAdminSettingsModel;
use App\Models\LogsModel;
use App\Models\PPASecurity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Validation\Rules\Password;
use Jenssegers\Agent\Agent;

class AuthController extends Controller
{
    /**
     * Register the system
     */
    public function register(RegisterRequest $request) {
        try {
            if ($request->hasFile('avatar') && $request->file('avatar')->isValid() &&
                $request->hasFile('esig') && $request->file('esig')->isValid()) {
                
                $dp = $request->file('avatar');
                $dp_extension = $dp->getClientOriginalExtension();
                $esig = $request->file('esig');
                $esig_extension = $esig->getClientOriginalExtension();
    
                // Check if the image is png, jpeg, jpg
                if (($dp_extension !== 'png' && $dp_extension !== 'jpeg' && $dp_extension !== 'jpg') || 
                    ($esig_extension !== 'png' && $esig_extension !== 'jpeg' && $esig_extension !== 'jpg')) {
                    return response()->json(['message' => "This is not the format that we want"], 400);
                }

                // Check if the passwords is are not match
                if($request->input('password') != $request->input('consfirmPassword')){
                    return response()->json(['error' => "Passwords do not match"], 422);
                }
    
                // Generate a file name
                $name = preg_replace('/\s+/', '_', trim($request->input('firstname'))) . '_' . $request->input('lastname');
                $dp_name = $name . '_avatar.' . $dp_extension;
                $esig_name = $name . '_esignature.' . $esig_extension;
    
                $user = PPAEmployee::create([
                    'firstname' => $request->input('firstname'),
                    'middlename' => $request->input('middlename'),
                    'lastname' => $request->input('lastname'),
                    'gender' => $request->input('gender'),
                    'division' => $request->input('division'),
                    'position' => $request->input('position'),
                    'code_clearance' => $request->input('code_clearance'),
                    'avatar' => $dp_name,
                    'esign' => $esig_name,
                    'username' => $request->input('username'),
                    'password' => Hash::make($request->input('password')),
                    'status' => $request->input('status'),
                ]);
    
                // Save files to storage
                Storage::disk('public')->put('displaypicture/' . $dp_name, file_get_contents($dp));
                Storage::disk('public')->put('displayesig/' . $esig_name, file_get_contents($esig));

                // Logs
                $logs = new LogsModel();
                $logs->category = 'USER';
                $logs->message = $request->input('firstname') . ' ' . $request->input('middlename') . '. ' . $request->input('lastname') . ' has been added to the system database.';
                $logs->save();
                
                return response()->json([
                    'message' => "Product successfully created."
                ], 200);
            } else {
                return response()->json([
                    'message' => "Invalid image file."
                ], 400);
            }
        } catch (\Exception $e) {
            // Log the exception for debugging
            Log::error('Exception: ' . $e->getMessage());
    
            return response()->json([
                'message' => "Something went wrong. Please check the server logs for more details."
            ], 500);
        }
    }

    /**
     * Login on the system
     */
    public function login(Request $request){

        // Root URL
        $rootUrl = URL::to('/');

        $agent = new Agent();

        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $pcName = gethostname();

        // Get the user information
        $user = PPAEmployee::where('username', $credentials['username'])->first();

        // Check if the user account exists and the password is valid
        if(!$user || !Hash::check($credentials['password'], $user->password)){
            return response()->json(['error' => 'Invalid'], 422);
        }

        // Check if the user is need to change pass
        if($user->status == 2){ return response()->json(['error' => 'ChangePass'], 422); }

        // Check if the user is not active anymore
        if($user->status == 0){ return response()->json(['error' => 'NotActive'], 404); }

        // Check if the user logs in even the token is active
        $existingToken  = PersonalAccessToken::where('tokenable_id', $user->id)->first();
        $method = $request->input('method');

        if($existingToken && $method === 'login'){
            return response()->json(['error' => 'TokenExist'], 404);
        }else if($existingToken && $method === 'continue')

            if ($existingToken) {
                $existingToken->delete();
            }

            // Create a fresh token
            $token = $user->createToken('PPA_Token')->plainTextToken;

            // User details
            $userdata = [
                'name' => $user->firstname . ' ' . $user->middlename . '. ' . $user->lastname,
                'firstname' => $user->firstname,
                'gender' => $user->gender,
            ];

            // Handle security info
            $security = PPASecurity::where('user_id', $user->id)->first();
            if (!$security) {
                $security = new PPASecurity();
                $security->user_id = $user->id;
            }

            $security->hostingname = $pcName;
            $security->browser = $agent->browser();

            if ($security->save()) {
                // Add to logs
                $logs = new LogsModel();
                $logs->category = 'USER';
                $logs->message = $user->firstname . ' ' . $user->middlename . '. ' . $user->lastname .
                                 ' has logged into the system on device ' . $pcName . ' using the ' .$agent->browser(). ' browser.';
                $logs->save();
            }

            return response([
                'userId' => $user->id,
                'userDet' => $userdata,
                'userAvatar' => $rootUrl . '/storage/displaypicture/' . $user->avatar,
                'code' => $user->code_clearance,
                'token' => $token
            ]);
        
    }

    /**
     * Update on the system
     */
    public function updateUser(Request $request){
        // Validate inputs
        $systemValidations = $request->validate([
            'username' => 'required|string',
            'currentPassword' => 'required|string',
            'newPassword' => [
                'required_with:currentPassword',
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
            'confirmPassword' => 'required|same:newPassword', // Add confirmation check
        ]);

        // Retrieve user by username
        $user = PPAEmployee::where('username', $systemValidations['username'])->first();

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Check current password
        if (!Hash::check($systemValidations['currentPassword'], $user->password)) {
            return response()->json(['error' => 'Incorrect password'], 422);
        }

        // Update the user's password
        $user->password = Hash::make($systemValidations['newPassword']);
        $user->status = 1;
        $user->save();

        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    /**
     * Logout on the system
     */
    public function logout(Request $request){

        /** @var PPAUser $user */
        $user = Auth::user();

        // Format the full name
        $fullName = trim($user->firstname . ' ' . ($user->middlename ? $user->middlename[0] . '. ' : '') . $user->lastname);
        $pcName = gethostname();

        // LOGS
        $logs = new LogsModel();
        $logs->category = 'USER';
        $logs->message = $fullName .' has logged out on the system using '.$pcName.'.';

        if($logs->save() === True){
            $user->currentAccessToken()->delete();
            PPASecurity::where('user_id', $user->id)->delete();
        }

        return response([
            'success' => true
        ]);
    }

    /**
     * Get the Superadmin Settings
     */
    // public function settingsSuperAdmin() {
    //     // Retrieve all settings from the database
    //     $getSettings = SuperAdminSettingsModel::all();
    
    //     // Check if there are any settings available
    //     if ($getSettings->isEmpty()) {
    //         return response()->json([
    //             'error' => 'Settings not found.'
    //         ], 404);  // Return 404 if no settings are found
    //     }
    
    //     // Extract the 'enable_main' setting value
    //     $respondData = [
    //         'maintainance' => $getSettings->first()->enable_main  // Assuming the first record holds the setting
    //     ];
    
    //     // Return the response
    //     return response()->json($respondData);
    // }

    
}
