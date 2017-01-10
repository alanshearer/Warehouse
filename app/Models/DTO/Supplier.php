<?php

namespace App\Models\DTO;

use Illuminate\Database\Eloquent\Model as Model;
use App\Models\Entities\Supplier as Entity;

use App\Models\DTO\Location\City as CityDTO;
use App\Models\DTO\Location\County as CountyDTO;
use App\Models\DTO\Location\Country as CountryDTO;

class Supplier extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city_id', 'vatcode', 'postalcode'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->vatcode = $entity->vatcode;
        $this->address = $entity->address;
        $this->postalcode = $entity->postalcode;
        $this->city_id = $entity->city_id;
        $this->city = (new CityDTO($entity->city))->kvp();
        $this->county = (new CountyDTO($entity->city->county))->kvp();
        $this->country = (new CountryDTO($entity->city->county->region->country))->kvp();
        $this->enabled = !$entity->trashed();
    }

}

