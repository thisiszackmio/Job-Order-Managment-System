<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PPAUser;

class UserController extends Controller
{
    public function index()
    {
        $users = PPAUser::where('code_clearance', '2')->get();
        return response()->json($users);
    }
}
