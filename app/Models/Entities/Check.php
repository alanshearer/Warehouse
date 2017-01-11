<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Check extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date', 'user_id', 'product_id', 'productworkingstate_id'
    ];
    protected $dates = ['date'];

    public function user() {
        return $this->belongsTo('App\Models\Entities\User', 'user_id', 'id');
    }

    public function product() {
        return $this->belongsTo('App\Models\Entities\Product', 'product_id', 'id');
    }

    public function state() {
        return $this->belongsTo('App\Models\Entities\Productworkingstate', 'productworkingstate_id', 'id');
    }

}
