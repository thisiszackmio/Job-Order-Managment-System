<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_of_jlms',
        'sender_avatar',
        'sender_id',
        'sender_name',
        'message',
        'receiver_id',
        'receiver_name',
        'joms_type',
        'joms_id',
        'status',
        'form_location'
    ];

    protected $table = 'notification';
}
