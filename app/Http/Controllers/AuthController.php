<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use \App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $existingUser = User::where('username', $data['username'])->first();
        if ($existingUser) {
            return response()->json(['message' => 'Username already exists'], 400);
        }

        /** @var \App\Models\User $user */
        $user = User::create([
            'user_fname' => $data['fname'],
            'user_lname' => $data['lname'],
            'username' => $data['username'],
            'email' => $data['email'],
            'division' => $data['division'],
            'password' => bcrypt($data['password'])
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']); 

        if(!Auth::attempt($credentials, $remember)){
            return response([
                'error' => 'The Provided credentials are not correct'
            ], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        /** @var User @user */
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return reesponse([
            'success' => true
        ]);
    }
}
