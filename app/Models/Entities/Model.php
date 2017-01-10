<?php

namespace App\Models\Entities;

class Model extends \Illuminate\Database\Eloquent\Model {

    use Illuminate\Database\Eloquent\SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'category_id', 'brand_id', 'note'
    ];

}
