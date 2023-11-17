<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility_Mph extends Model
{
    use HasFactory;

    protected $table = 'facility_mph';

    protected $fillable = [
        'facility_id',
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
        'videoke'
    ];

    // public function facility_request()
    // {
    //     return $this->belongsTo(Inspection_Form::class, 'request__facility');
    // }

    public function facility_form()
    {
        return $this->belongsTo(Facility_Form::class, 'facility_id');
    }

}
