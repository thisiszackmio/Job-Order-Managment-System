<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuperAdminSettingsModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'enable_main',
    ];

    protected $table = 'superadminsettings';
}
