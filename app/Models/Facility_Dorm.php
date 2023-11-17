<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility_Dorm extends Model
{
    use HasFactory;

    protected $table = 'facility_dormitory';

    protected $fillable = [
        'facility_id',
        'name_male',
        'name_female',
        'other_details'
    ];

    public function facility_form()
    {
        return $this->belongsTo(Facility_Form::class, 'facility_id');
    }
}
