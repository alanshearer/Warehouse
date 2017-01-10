<?php

namespace App\Models\DTO;

use App\Models\Entities\Model as Entity;
use App\Models\DTO\Category as CategoryDTO;
use App\Models\DTO\Brand as BrandDTO;

class Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'category_id', 'brand_id', 'note'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->name = $entity->name;
        $this->description = $entity->description;
        $this->category_id = $entity->category_id;
        $this->brand_id = $entity->brand_id;
        $this->category = (new CategoryDTO($entity->category))->kvp();
        $this->brand = (new BrandDTO($entity->brand))->kvp();
        $this->note = $entity->note;
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
