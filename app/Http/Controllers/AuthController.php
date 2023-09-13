<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\PPAUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $image = $request->file('image');
                $extension = $image->getClientOriginalExtension();
    
                // Check if the file is a PNG image
                if ($extension !== 'png') {
                    return response()->json([
                        'message' => "Only PNG images are allowed."
                    ], 400);
                }
    
                // Generate a filename based on name and timestamp
                $name = $request->input('lname'); // Change 'fname' to the desired field
                $timestamp = now()->timestamp;
                $imageName = $name . '_' . $timestamp . '.' . $extension;
    
                /** @var \App\Models\User $user */
                $user = PPAUser::create([
                    'fname' => $request->input('fname'),
                    'mname' => $request->input('mname'),
                    'lname' => $request->input('lname'),
                    'image' => $imageName,
                    'username' => $request->input('username'),
                    'division' => $request->input('division'),
                    'code_clearance' => $request->input('code_clearance'),
                    'password' => Hash::make($request->input('password')),
                ]);
                $token = $user->createToken('main')->plainTextToken;
    
                Storage::disk('public')->put('esignature/' . $imageName, file_get_contents($image));
    
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
    

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $useracc = PPAUser::where('username', $credentials['username'])->first();

        //var_dump($useracc);

        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!$useracc || !Hash::check($credentials['password'], $useracc->password)) {
            return response()->json([
                'message' => 'Invalid Credentials',
                'errors' => [
                    'credentials' => [
                        'Invalid Credentials.'
                    ],
                ],
                'credentials' => [
                    'Invalid Credentials.'
                ],
            ], 422);
        }

        $token = $useracc->createToken('main')->plainTextToken;

        return response([
            'user' => $useracc,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        /** @var PPAUser $user */
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }
}
