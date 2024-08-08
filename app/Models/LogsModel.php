<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogsModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'message'
    ];

    protected $table = 'logs';
}
