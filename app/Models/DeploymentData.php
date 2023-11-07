<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeploymentData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type_of_service',
        'type_of_repair',
        'detail_repair',
        'location_repair',
        'type_of_personel',
        'detail_personnel',
        'purpose_personnel',
        'location_personnel',
        'detail_supply',
        'supply_no'
    ];

}
