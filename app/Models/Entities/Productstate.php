<?php

namespace App\Models\Entities;

class Productstate extends \Illuminate\Database\Eloquent\Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];

}
