<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PPAEmployee;

class LocatorSlipController extends Controller
{
    // -- Get Vehicle Slip Base on Date -- //
    

    // -- Get Requestor -- //
    public function getRequestor($id){
        $employees = PPAEmployee::whereIn('status',[1,2])->where('id', '!=', $id)->get();

        $respondData = $employees->map(function ($emp) {
            return [
                'id' => $emp->id,
                'firstname' => $emp->firstname,
                'middlename' => $emp->middlename,
                'lastname' => $emp->lastname,
            ];
        });

        return response()->json($respondData);
    }
}