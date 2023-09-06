<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PPAUser;

class UserController extends Controller
{
    public function index()
    {
        $users = PPAUser::where('division', 'Port Police Division')->get();
        return response()->json($users);
    }
}
