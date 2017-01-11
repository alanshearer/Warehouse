<?php

namespace App\Models\Entities;

class Shippingstate extends \Illuminate\Database\Eloquent\Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];

    public function shippings() {
        return $this->belongsToMany('App\Models\Entities\Shipping');
    }

}
