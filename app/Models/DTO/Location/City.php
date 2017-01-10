<?php

namespace App\Models\DTO\Location;

use App\Models\Entities\Location\City as Entity;

class City {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'istatcode', 'postalcode', 'county_id'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->istatcode = $entity->istatcode;
        $this->postalcode = $entity->postalcode;
        $this->county_id = $entity->county_id;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
