<?php

namespace App\Models\City;

use Illuminate\Database\Eloquent\Model as Model;

class County extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'region_id'
    ];
}
