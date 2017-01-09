<?php

namespace App\Models\DTO;

use Illuminate\Database\Eloquent\Model as Model;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'model_id', 'note', 'price', 'externalid', 'productstate_id'
    ];
}
