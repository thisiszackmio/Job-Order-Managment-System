<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignPersonnelModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'personnel_id',
        'personnel_name',
        'assignment',
        'form_id',
        'status'
    ];

    protected $table = 'assign_personnel';
}
