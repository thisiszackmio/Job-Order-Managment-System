<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NotificationModel;
use Illuminate\Support\Facades\URL;
use App\Models\InspectionModel;
use App\Models\FacilityVenueModel;
use App\Models\VehicleSlipModel;
use Carbon\Carbon;

class NotificationController extends Controller
{
     /**
     *  Legend
     *  
     *  0 - Deleted Notification
     *  1 - Read Notifications
     *  2 - Unread Notifications
     * 
     */

    public function getNotifications($id){

        // Root URL
        $rootUrl = URL::to('/');

        // Calculate the date 1 week
        $oneDayInterval = Carbon::now()->subDays(7);
        NotificationModel::where('receiver_id', $id)->where('created_at', '<', $oneDayInterval)->update(['status' => 0]);
    
        // Retrieve all notifications
        $NotificationRequest = NotificationModel::where('receiver_id', $id)->whereIn('status', [1, 2, 4])->orderBy('created_at', 'desc')->get();
        $NotificationUnread = NotificationModel::where('receiver_id', $id)->whereIn('status', [2, 4])->get();
    
        // Initialize an empty array to store notification data
        $notiData = [];
    
        // Loop through each notification and collect its data
        foreach ($NotificationRequest as $noti) {
            $notiData[] = [
                'id' => $noti->id,
                'type_of_jlms' => $noti->type_of_jlms,
                'sender_avatar' => $rootUrl . '/storage/displaypicture/' . $noti->sender_avatar,
                'sender_id' => $noti->sender_id,
                'sender_name' => $noti->sender_name,
                'message' => $noti->message,
                'receiver_id' => $noti->receiver_id,
                'receiver_name' => $noti->receiver_name,
                'joms_type' => $noti->joms_type,
                'joms_id' => $noti->joms_id,
                'status' => $noti->status,
                'date_request' => $noti->created_at
            ];
        }

        $response = [
            'notifications' => $notiData,
            'count' => $NotificationUnread->count()
        ];
    
        // Return the notification data as JSON
        return response()->json($response);
    }

    public function readNotifications($id){

        $notification = NotificationModel::find($id);

        // Check if the notification exists
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        // Update the status to 1
        $notification->status = 1;
        $notification->save();

        return response()->json(['message' => 'Notification updated successfully.'], 200);

    }

    public function updateOldNotifications($id){
        $thirtysixHoursAgo = Carbon::now()->subHours(36);

        $updatedCount = NotificationModel::where('receiver_id', $id)
                                        ->where('created_at', '<', $thirtysixHoursAgo)
                                        ->whereIn('status', [1, 2])
                                        ->update(['status' => 0              
                                    ]);
        return response()->json(['message' => "$updatedCount old notifications updated successfully."], 200);
    }

}
