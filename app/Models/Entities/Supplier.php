<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\Model as Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Supplier extends Model {
    
    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city_id', 'vatcode', 'postalcode'
    ];

    public function city() {
        return $this->belongsTo('App\Models\Entities\Location\City', 'city_id', 'id');
    }
}
