<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentForm extends Model
{
    use HasFactory;

    protected $table = 'equipment_form';

    protected $fillable = [
        'user_id',
        'type_of_equipment',
        'date_request',
        'title_of_activity',
        'date_of_activity',
        'time_start',
        'time_end',
        'instructions',
        'driver',
        'operator',
        'rescue_members',
        'opr',
        'division_manager_id',
        'division_manager_approval',
        'admin_manager_approval',
        'harbor_master_approval',
        'port_manager_approval',
        'status'
    ];
}
