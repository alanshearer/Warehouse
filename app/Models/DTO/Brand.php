<?php

namespace App\Models\DTO;

use App\Models\Entities\Brand as Entity;

class Brand {

    protected $fillable = [
        'name', 'description', 'note'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->description = $entity->description;
        $this->note = $entity->note;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
