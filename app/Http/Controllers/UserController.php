<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PPAUser;
use App\Models\AssignPersonnel;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Get The supervisor's names
     */
    public function supervisorNames(Request $request, $id) {
        // Get User details
        $myDet = PPAUser::find($id);
        $department = $myDet->division;
    
        $supervisorTypeMapping = [
            "Administrative Division" => "Supervisor/Administrative Division",
            "Finance Division" => "Manager/Finance Division",
            "Office of the Port Manager" => "Supervisor/Office of the Port Manager",
            "Port Service Division" => "Manager/Port Services Division",
            "Port Police Division" => "Manager/Port Police Division",
            "Engineering Service Division" => "Manager/Engineering Services Division",
            "Terminal Management Office - Tubod" => "Manager/TMO-TUBOD",
        ];
    
        $supervisorType = $supervisorTypeMapping[$department] ?? null;
    
        if ($supervisorType) {
            $supervisorPersonnel = AssignPersonnel::with('user')->where("type_of_personnel", $supervisorType)->first();
    
            if ($supervisorPersonnel) {
                $ppaUser = $supervisorPersonnel->user;
    
                // Fullname
                $userId = $ppaUser->id;
                $userFname = $ppaUser->fname;
                $userMname = $ppaUser->mname;
                $userLname = $ppaUser->lname;
                $fullName = "{$userFname} {$userMname}. {$userLname}";
            }
        }
    
        $responseData = [
            'personnel_details' => [
                'id' => $userId ?? null,
                'name' => $fullName ?? null,
            ],
        ];
    
        return response()->json($responseData);
    }





    /**
     * Display the Supervisor Users.
     */
    public function index()
    {
        $users = PPAUser::where('code_clearance', '2')
        ->orWhere('code_clearance', '1')
        ->orWhere('code_clearance', '4')
        ->get();
        return response()->json($users);
    }

    /**
     * Display all Users.
     */
    public function allUser()
    {
        $Allusers = PPAUser::orderBy('lname')->get();
        return response()->json($Allusers);
    }

    /**
     * Display the specific user.
     */
    public function SpecificUser($id)
    {
        $Allusers = PPAUser::find($id);

        $Signature = URL::to('/storage/esignature/' . $Allusers->image);

        $responseData = [
            'users' => $Allusers,
            'signature' => $Signature
        ];
        return response()->json($responseData);
    }

    /**
     * Update Code Clearance on a Specific User.
     */
    public function updateCodeClearance(Request $request, $id)
    {
        $user = PPAUser::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update([
            'code_clearance' => $request->input('code_clearance'),
        ]);

        return response()->json(['message' => 'Code clearance updated successfully'], 200);
        // return response()->json($request->input('code_clearance'));
    }

    /**
     * Update Signature on a Specific User.
     */
    public function updateSignature(Request $request, $id)
    {
        $user = PPAUser::find($id);

        // Validate the request
        $request->validate([
            'image' => [
                'nullable',
                'file',
                'mimes:png',
                'max:10240', // 10MB max file size, adjust as needed
            ],
        ]);

        // Check if a file was uploaded
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $extension = $image->getClientOriginalExtension();

            $name = str_replace(' ', '_', trim($user->fname)) . '_' . $user->lname;
            $timestamp = now()->format('Y');
            $imageName = $name . '_' . $timestamp . '.' . $extension;

            // Delete the old image
            if (!empty($user->image) && Storage::disk('public')->exists('esignature/' . $user->image)) {
                Storage::disk('public')->delete('esignature/' . $user->image);
            }

            // Save the image to the public disk
            Storage::disk('public')->put('esignature/' . $imageName, file_get_contents($image));

            // Update the user's e-signature field in the database
            $user->update(['image' => $imageName]);

            return response()->json(['message' => 'E-Signature updated successfully'], 200);
        } else {
            return response()->json(['message' => 'No file uploaded'], 422);
        }
    }

    /**
     * Update Password on a Specific User.
     */
    public function updatePassword(Request $request, $id)
    {
        $user = PPAUser::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'password' => [
                'required',
                Password::min(8) // At least 8 characters
                    ->mixedCase() // At least one uppercase and one lowercase character
                    ->numbers()    // At least one number
                    ->symbols()    // At least one symbol
            ],
        ]);

        $user->update([
            'password' => Hash::make($request->input('password'))
        ]);

        return response()->json(['message' => 'Code clearance updated successfully'], 200);
    }

}
