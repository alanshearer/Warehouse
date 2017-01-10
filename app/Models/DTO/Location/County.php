<?php

namespace App\Models\DTO\Location;

use Illuminate\Database\Eloquent\Model as Model;
use App\Models\Entities\Location\County as Entity;

class County extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'code', 'region_id'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->code = $entity->code;
        $this->region_id = $entity->region_id;
        $this->region = $entity->region->name;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }
    public function short() {
        return ["id" => $this->id, "name" => $this->name, "region" => $this->region];
    }
}

