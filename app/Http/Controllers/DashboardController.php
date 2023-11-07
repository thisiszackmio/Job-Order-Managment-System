<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inspection_Form;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    
    public function getRepair()
    {
        // For Pre/Post Reapir Inspection Form
        $repair = Inspection_Form::all();

        return response()->json($repair);
    }

    public function getCurrentUser()
    {
        // Get the authenticated user, or null if not authenticated
        $user = Auth::user();
    
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    }

}
