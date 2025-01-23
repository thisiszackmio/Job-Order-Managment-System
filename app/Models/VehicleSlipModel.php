<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleSlipModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'type_of_slip',
        'purpose',
        'passengers',
        'place_visited',
        'date_arrival',
        'time_arrival',
        'vehicle_type',
        'driver_id',
        'driver',
        'admin_approval',
        'remarks',
    ];

    protected $table = 'joms_vehicle_slip_form';
}
