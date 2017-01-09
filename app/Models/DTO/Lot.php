<?php

namespace App\Models\DTO;

use Illuminate\Database\Eloquent\Model as Model;

class Lot extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'document', 'origin_id', 'destination_id'
    ];
}
