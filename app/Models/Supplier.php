<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Supplier extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city_id', 'vatcode'
    ];
}
