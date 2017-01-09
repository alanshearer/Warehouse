<?php

namespace App\Models\DTO;

use Illuminate\Database\Eloquent\Model as Model;

class Lotstate extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];
}
