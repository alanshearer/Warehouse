<?php

namespace App\Models\DTO;

use Illuminate\Database\Eloquent\Model as Model;

class Office extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city', 'country', 'county', 'officetype_id'
    ];
}
