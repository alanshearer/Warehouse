<?php

namespace App\Models\Entities\Location;

class County extends \Illuminate\Database\Eloquent\Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'region_id'
    ];

    public function region() {
        return $this->belongsTo('App\Models\Entities\Location\Region');
    }

    public function cities() {
        return $this->hasMany('App\Models\Entities\Location\City');
    }

}
