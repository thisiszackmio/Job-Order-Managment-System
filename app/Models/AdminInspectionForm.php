<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminInspectionForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_of_filling',
        'date_of_last_repair',
        'nature_of_last_repair',
        'assign_personnel',
    ];

    protected $table = 'inspection_form_admin';

    public function inspection_form()
    {
        return $this->belongsTo(Inspection_Form::class, 'inspection__form_id');
    }
}
