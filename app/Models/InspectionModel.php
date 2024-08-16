<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'property_number',
        'acquisition_date',
        'acquisition_cost',
        'brand_model',
        'serial_engine_no',
        'type_of_property',
        'property_description',
        'location',
        'complain',
        'date_of_filling',
        'date_of_last_repair',
        'nature_of_last_repair',
        'before_repair_date',
        'after_reapir_date',
        'findings',
        'recommendations',
        'remarks',
        'supervisor_id',
        'supervisor_name',
        'personnel_id',
        'personnel_name',
        'supervisor_status',
        'admin_status',
        'inspector_status',
        'form_status',
        'form_remarks',
    ];

    protected $table = 'joms_inspection_form';
}
