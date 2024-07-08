<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inspector_Form extends Model
{
    use HasFactory;

    protected $fillable = [
        'inspection__form_id',
        'before_repair_date',
        'findings',
        'recommendations',
        'after_reapir_date',
        'remarks',
    ];
}
