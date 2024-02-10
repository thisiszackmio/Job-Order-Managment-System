<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacilityModel extends Model
{
    use HasFactory;

    protected $table = 'facility';

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
        'table',
        'no_table',
        'chair',
        'no_chair',
        'microphone',
        'no_microphone',
        'others',
        'specify',
        'projector',
        'projector_screen',
        'document_camera',
        'laptop',
        'television',
        'sound_system',
        'videoke',
        'name_male',
        'name_female',
        'other_details',
        'admin_approval',
        'date_approve',
        'obr_instruct',
        'obr_comment',
        'remarks'
    ];

    public function user()
    {
        return $this->belongsTo(PPAUser::class, 'user_id');
    }
}
