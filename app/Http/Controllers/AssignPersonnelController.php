<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssignPersonnel;

class AssignPersonnelController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function index()
    {
        $assignPersonnels = AssignPersonnel::with('user')->get();
        //$assignPersonnels = AssignPersonnel::all();

        if ($assignPersonnels->isEmpty()) {
            return response()->json($assignPersonnels);
        }

        $responseData = [];

        foreach ($assignPersonnels as $assignPersonnel) {
            $ppaUser = $assignPersonnel->user;

            $userName = $ppaUser->fname;
            $userMiddleInitial = $ppaUser->mname;
            $userLastName = $ppaUser->lname;

            $responseData[] = [
                'assign_personnel' => $assignPersonnel,
                'user_details' => [
                    'fname' => $userName,
                    'mname' => $userMiddleInitial,
                    'lname' => $userLastName,
                ],
            ];
        }

        return response()->json($responseData);
        
    } 
}
