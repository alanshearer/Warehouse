<?php

namespace App\Models\Entities\Location;

use Illuminate\Database\Eloquent\Model as Model;

class Country extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'uic_id'
    ];

    public function regions() {
        return $this->hasMany('App\Models\Entities\Location\Region');
    }

    public function counties() {
        return $this->hasManyThrough('App\Models\Entities\Location\County', 'App\Models\Entities\Location\Region');
    }

}
