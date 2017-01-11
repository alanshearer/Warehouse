<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Shipping extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'document', 'origin_id', 'destination_id'
    ];

    public function states() {
        return $this->belongsToMany('App\Models\Entities\Shippingstate');
    }

    public function products() {
        return $this->belongsToMany('App\Models\Entities\Product');
    }

}
