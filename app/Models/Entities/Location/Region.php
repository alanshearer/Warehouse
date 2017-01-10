<?php

namespace App\Models\Entities\Location;

use Illuminate\Database\Eloquent\Model as Model;

class Region extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'position', 'country_id'
    ];

    public function country() {
        return $this->belongsTo('App\Models\Entities\Location\Country');
    }

    public function counties() {
        return $this->hasMany('App\Models\Entities\Location\County');
    }

}
