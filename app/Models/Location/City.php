<?php

namespace App\Models\Location;

use Illuminate\Database\Eloquent\Model as Model;

class City extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'istatcode', 'postalcode', 'county_id'
    ];

    public function county() {
        return $this->belongsTo('App\Models\Location\County');
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
