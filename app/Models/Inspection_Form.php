<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inspection_Form extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_request',
        'property_number',
        'acq_date',
        'acq_cost',
        'brand_model',
        'serial_engine_no',
        'type_of_property',
        'property_description',
        'property_other_specific',
        'location',
        'complain',
        'supervisor_name',
        'supervisor_approval',
        'admin_approval'
    ];

    public function user()
    {
        return $this->belongsTo(PPAUser::class, 'user_id');
    }
}
