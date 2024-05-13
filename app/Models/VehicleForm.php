<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleForm extends Model
{
    use HasFactory;

    protected $table = 'vehicle_slip';

    protected $fillable = [
        'user_id',
        'date_of_request',
        'purpose',
        'passengers',
        'place_visited',
        'date_arrival',
        'time_arrival',
        'vehicle_type',
        'driver',
        'admin_approval',
        'remarks'
    ];

    public function user()
    {
        return $this->belongsTo(PPAUser::class, 'user_id');
    }

}
