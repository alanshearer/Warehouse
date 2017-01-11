<?php

namespace App\Models\Entities;

class Productworkingstate extends \Illuminate\Database\Eloquent\Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];

    public function products() {
        return $this->belongsToMany('App\Models\Entities\Product', 'product_productworkingstate');
    }
}
