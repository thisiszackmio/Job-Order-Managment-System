<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\RegisterRequest;
use App\Models\PPAEmployee;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Register the site
     */
    public function register(RegisterRequest $request) {
        try {
            if ($request->hasFile('display_picture') && $request->file('display_picture')->isValid() &&
                $request->hasFile('esig') && $request->file('esig')->isValid()) {
                
                $dp = $request->file('display_picture');
                $dp_extension = $dp->getClientOriginalExtension();
                $esig = $request->file('esig');
                $esig_extension = $esig->getClientOriginalExtension();
    
                // Check if the image is png, jpeg, jpg
                if (($dp_extension !== 'png' && $dp_extension !== 'jpeg' && $dp_extension !== 'jpg') || 
                    ($esig_extension !== 'png' && $esig_extension !== 'jpeg' && $esig_extension !== 'jpg')) {
                    return response()->json(['message' => "This is not the format that we want"], 400);
                }
    
                // Generate a file name
                $name = str_replace(' ', '_', trim($request->input('fname'))) . '_' . $request->input('lname');
                $dp_name = $name . '_displayPicture.' . $dp_extension;
                $esig_name = $name . '_esignature.' . $esig_extension;
    
                $user = PPAEmployee::create([
                    'PPA_No' => $request->input('PPA_No'),
                    'fname' => $request->input('fname'),
                    'mname' => $request->input('mname'),
                    'lname' => $request->input('lname'),
                    'sex' => $request->input('sex'),
                    'division' => $request->input('division'),
                    'position' => $request->input('position'),
                    'display_picture' => $dp_name,
                    'esig' => $esig_name,
                ]);
    
                // Save files to storage
                Storage::disk('public')->put('displaypicture/' . $dp_name, file_get_contents($dp));
                Storage::disk('public')->put('esignature/' . $esig_name, file_get_contents($esig));
    
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
    
}
