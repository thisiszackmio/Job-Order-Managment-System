<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleTypeModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_name',
        'vehicle_plate',
        'status',
        'date_used'
    ];

    protected $table = 'joms_vehicle_type';
}
