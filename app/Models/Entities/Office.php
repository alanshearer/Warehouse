<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Office extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city_id', 'postalcode', 'officetype_id', 'parent_id'
    ];
    protected $dates = ['created_at'];

    public function city() {
        return $this->belongsTo('App\Models\Entities\Location\City', 'city_id', 'id');
    }

    public function officetype() {
        return $this->belongsTo('App\Models\Entities\Location\Officetype', 'officetype_id', 'id');
    }

    public function products() {
        return $this->belongsToMany('App\Models\Entities\Product');
    }

    public function warehouse() {
        return $this->belongsTo('App\Models\Entities\Office', 'parent_id', 'id');
    }

}
