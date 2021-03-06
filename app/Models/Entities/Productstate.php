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

    public function products() {
        return $this->belongsToMany('App\Models\Entities\Product', 'product_productstate');
    }
}
