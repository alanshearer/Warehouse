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
        'name', 'address', 'city_id', 'postalcode', 'officetype_id'
    ];

    public function city() {
        return $this->belongsTo('App\Models\Entities\Location\City', 'city_id', 'id');
    }

}
