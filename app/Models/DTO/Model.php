<?php

namespace App\Models\DTO;

class Model extends \Illuminate\Database\Eloquent\Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'category_id', 'brand_id', 'note'
    ];
}
