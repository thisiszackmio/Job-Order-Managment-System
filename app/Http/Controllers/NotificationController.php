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
        $rootUrl = URL::to('/');

        $now = Carbon::now();
        $oneWeekAgo = $now->copy()->subDays(7);
        $sixtyDaysAgo = $now->copy()->subDays(60);

        // Auto delete older than 60 days
        NotificationModel::where('status', 0)
            ->where('created_at', '<', $sixtyDaysAgo)
            ->delete();

        // Auto archive older than 7 days
        NotificationModel::where('receiver_id', $id)
            ->where('created_at', '<', $oneWeekAgo)
            ->whereIn('status', [1,2,4])
            ->update(['status' => 0]);

        // Get latest notifications (limit 20 for performance)
        $notifications = NotificationModel::where('receiver_id', $id)
            ->whereIn('status', [1, 2, 4])
            ->latest()
            ->get();

        // Count unread THIS WEEK only
        $unreadCount = NotificationModel::where('receiver_id', $id)
            ->whereIn('status', [2, 4])
            ->where('created_at', '>=', $oneWeekAgo)
            ->count();

        $notiData = $notifications->map(function ($noti) use ($rootUrl) {
            return [
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
        });

        return response()->json([
            'notifications' => $notiData,
            'count' => $unreadCount
        ]);
    }

    public function readNotification($notificationId){
        $updated = NotificationModel::where('id', $notificationId)
            ->update(['status' => 1]);

        return response()->json(['message'=>'Notification marked as read'],200);
    }



}
