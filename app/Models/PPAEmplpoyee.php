<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PPAEmplpoyee extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'PPA_No',
        'fname',
        'mname',
        'lname',
        'sex',
        'division',
        'position',
        'display_picture',
        'esig'
    ];

    protected $table = 'employee_data';

}
