<?php

namespace App\Models\Location;

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
        return $this->hasMany('App\Models\Location\Region');
    }

    public function counties() {
        return $this->hasManyThrough('App\Models\Location\County', 'App\Models\Location\Region');
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
