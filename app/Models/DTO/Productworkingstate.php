<?php

namespace App\Models\DTO;
use App\Models\Entities\Productworkingstate as Entity;

class Productworkingstate {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
