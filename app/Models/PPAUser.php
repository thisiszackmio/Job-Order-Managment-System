<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PPAUser extends Authenticatable
{

    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'fname',
        'mname', 
        'lname',
        'gender', 
        'username', 
        'division',
        'position',
        'code_clearance',
        'password',
        'image'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    public static function queryUserExcept($ids)
    {
        return static::whereNotIn('id', $ids)->get();
    }

    /**
     * Get the user's username.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function username(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => url('esignature/'.$value),
        );
    }

}
