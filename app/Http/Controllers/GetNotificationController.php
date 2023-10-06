<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GetNotification;
use Illuminate\Support\Facades\URL;

class GetNotificationController extends Controller
{

    public function index()
    {
        // Find notifications by receiver_id
        $getNotifications = GetNotification::all();

        if ($getNotifications->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
        }

        return response()->json($getNotifications);
    }

    public function changeStatus(Request $request, $id){

        $changeStatus = GetNotification::find($id);

        $changeStatus->update([
            'get_status' => 1
        ]);

        return response()->json(['message' => 'change data done'], 200);
        
    }

}
