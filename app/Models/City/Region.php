<?php

namespace App\Models\City;

use Illuminate\Database\Eloquent\Model as Model;

class Region extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'position', 'country_id'
    ];
}
