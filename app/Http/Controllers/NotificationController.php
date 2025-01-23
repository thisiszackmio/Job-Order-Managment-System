<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NotificationModel;
use Illuminate\Support\Facades\URL;
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
    
        // Retrieve all notifications
        $NotificationRequest = NotificationModel::where('receiver_id', $id)->whereIn('status', [1, 2])->orderBy('created_at', 'desc')->get();
        $NotificationUnread = NotificationModel::where('receiver_id', $id)->where('status', 2)->get();
    
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

    public function updateOldNotifications() {
        // Calculate the date 6 days ago
        $DaysAgo = Carbon::now()->subDays(6);
    
        // Find notifications that are older than 6 days and have status 2
        $updatedCount = NotificationModel::where('created_at', '<', $DaysAgo)
                                        ->where('status', 2)
                                        ->update(['status' => 1]);
    
        // Return a response indicating how many records were updated
        return response()->json(['message' => "$updatedCount old notifications updated successfully."], 200);
    }

    public function deleteOldNotifications() {
        // Calculate the date 6 months ago
        $sixMonthsAgo = Carbon::now()->subMonths(6);
    
        // Find and delete notifications that are older than 6 months
        $deletedCount = NotificationModel::where('created_at', '<', $sixMonthsAgo)->where('status', 1)->delete();
    
        // Return a response indicating how many records were deleted
        return response()->json(['message' => "$deletedCount old notifications removed successfully."], 200);
    }
}
