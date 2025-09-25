<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormTracker extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'type_of_request',
        'remarks'
    ];

    protected $table = 'form_request_tracker';
}
