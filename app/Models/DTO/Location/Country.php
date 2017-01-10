<?php

namespace App\Models\DTO\Location;

use App\Models\Entities\Location\Country as Entity;

class Country {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'uic_id'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->code = $entity->code;
        $this->uic_id = $entity->uic_id;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
