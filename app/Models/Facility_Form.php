<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility_Form extends Model
{
    use HasFactory;

    protected $table = 'request__facility';

    protected $fillable = [
        'user_id',
        'date_requested',
        'request_office',
        'title_of_activity',
        'date_start',
        'time_start',
        'date_end',
        'time_end',
        'mph',
        'conference',
        'dorm',
        'other',
        'admin_approval',
        'date_approve'
    ];

    public function user()
    {
        return $this->belongsTo(PPAUser::class, 'user_id');
    }

    public function relatedModels()
    {
        return $this->hasMany(Facility_Mph::class);
    }

    public function relatedModelsConference()
    {
        return $this->hasMany(Facility_Conference::class);
    }

    public function relatedModelsDorm()
    {
        return $this->hasMany(Facility_Dorm::class);
    }
    
}
