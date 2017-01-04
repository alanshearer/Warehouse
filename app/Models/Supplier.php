<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Model;
use App\Models\Location\City;

class Supplier extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city_id', 'vatcode', 'postalcode'
    ];
    protected $relations = ['city', 'county', 'country'];

    public function city() {
        return $this->belongsTo('App\Models\Location\City', 'city_id', 'id');
    }

    public function short() {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "vatcode" => $this->vatcode,
            "address" => $this->address,
            "postalcode" => $this->postalcode,
            "city_id" => $this->city_id,
            "city" => $this->city->kvp(),
            "county" => $this->city->county->kvp(),
            "country" => $this->city->county->region->country->kvp(),
            "enabled" => $this->deleted_at == null
        ];
    }

}
