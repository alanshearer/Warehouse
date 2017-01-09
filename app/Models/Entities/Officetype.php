<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\Model as Model;

class Officetype extends Model
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
