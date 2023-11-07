<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PPAUser;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
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
        $Allusers = PPAUser::all();
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

        // Define the validation rules
        $rules = [
            'image' => [
                'nullable', // The field must be present in the request.
                'file',     // The field must be a file.
                'mimes:png', // The file must have a PNG mime type.
            ],
        ];

        $request->validate($rules);

        $image = $request->file('image');
        $extension = $image->getClientOriginalExtension();

        $name = str_replace(' ', '_', trim($user->fname)) . '_' . $user->lname;
        $timestamp = now()->format('Y');
        $imageName = $name . '_' . $timestamp . '.' . $extension;

        // Save the image to the public disk
        Storage::disk('public')->put('esignature/' . $imageName, file_get_contents($image));

        // Delete the old image
        if (!empty($user->image) && Storage::disk('public')->exists('esignature/' . $user->image)) {
            Storage::disk('public')->delete('esignature/' . $user->image);
        }

        // Update the user's e-signature field in the database
        $user->update(['image' => $imageName]);

        return response()->json(['message' => 'E-Signature updated successfully'], 200);
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
