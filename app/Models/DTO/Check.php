<?php

namespace App\Models\DTO;

use App\Models\Entities\Product as Entity;
use App\Models\DTO\Product as ProductDTO;

class Check {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'model_id', 'note', 'price', 'serial', 'external_id', 'productstate_id'
    ];

    public function __construct(Entity $entity) {
        //$this->id = $entity->id;
        $this->product = (new ProductDTO($entity));
        $this->check = $entity->checks()->latest()->first();
        $this->enabled = $entity->deleted_at == null;
    }

    public function kvp() {
        return ["key" => $this->serial, "value" => $this->id];
    }

}
