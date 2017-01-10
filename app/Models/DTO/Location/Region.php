<?php

namespace App\Models\DTO\Location;

use Illuminate\Database\Eloquent\Model as Model;
use App\Models\Entities\Location\Region as Entity;

class Region extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'position', 'country_id'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->position = $entity->position;
        $this->country_id = $entity->country_id;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }
}

