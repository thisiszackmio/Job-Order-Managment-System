<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PPASecurity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hostingname',
    ];

    protected $table = 'ppa_security';

}
