<?php

namespace App\Models\Location;

use Illuminate\Database\Eloquent\Model as Model;

class County extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'region_id'
    ];

    public function region() {
        return $this->belongsTo('App\Models\Location\Region');
    }

    public function cities() {
        return $this->hasMany('App\Models\Location\City');
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

    public function short() {
        return ["id" => $this->id, "name" => $this->name, "region" => $this->region->name];
    }

}
