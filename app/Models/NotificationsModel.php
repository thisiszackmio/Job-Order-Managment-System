<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationsModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'type_of_request',
        'message',
        'status'
    ];

    protected $table = 'notifications';

}
