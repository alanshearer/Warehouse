<?php

namespace App\Models\Location;

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
        return $this->belongsTo('App\Models\Location\Country');
    }

    public function counties() {
        return $this->hasMany('App\Models\Location\County');
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
