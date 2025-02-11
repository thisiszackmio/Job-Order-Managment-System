<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InspectionModel;
use App\Models\LogsModel;
use App\Models\PPAEmployee;
use App\Models\NotificationModel;
use App\Http\Requests\InspectionFormRequest;
use Illuminate\Support\Facades\URL;

class InspectionController extends Controller
{

    /**
     * Legends on status on the database (supervisor_status, admin_status, inspector_status, form_status)
     * 
     * Code 1004 - Supervisor and Port Manager Approval
     * Code 1005 - Admin Manager Submit the Form
     * Code 2001 - Supervisor Disapproval
     * Code 1200 - GSO after submit Part B
     * Code 1130 - Admin Manager Approval
     * Code 1120 - Personnel after submit Part C
     * Code 1112 - Personnel after submit Part D / Request to Close
     * Code 1111 - Close Form
     * Code 2023 - Force Close Form
     * 
     */

    /**
     * Store Inspection Form (Part A)
     */
    public function storeInspectionRequest(InspectionFormRequest $request) {
        $data = $request->validated();
    
        // Create and save the deployment data
        $deploymentData = InspectionModel::create($data);
    
        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }
    
        // Create the notification
        $noti = new NotificationModel();
        $noti->type_of_jlms = "JOMS";
        $noti->sender_avatar = $request->input('sender_avatar');
        $noti->sender_id = $request->input('sender_id');
        $noti->sender_name = $request->input('sender_name');
        $noti->message = $request->input('notif_message');
        $noti->receiver_id = $request->input('receiver_id');
        $noti->receiver_name = $request->input('receiver_name');
        $noti->joms_type = 'JOMS_Inspection';
        $noti->status = 2;
        $noti->joms_id = $deploymentData->id;
    
        // Save the notification and create logs if successful
        if ($noti->save()) {
            // Create logs
            $logs = new LogsModel();
            $logs->category = 'JOMS';
            $logs->message = $data['user_name'] . ' has submitted the request for Pre/Post Repair Inspection (Control No. '.$deploymentData->id.')';
            $logs->save();
        } else {
            return response()->json(['error' => 'Failed to save notification'], 500);
        }
    
        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

}
