<?php

namespace App\Models\DTO;

use App\Models\Entities\Product as Entity;
use App\Models\DTO\Model as ModelDTO;
use App\Models\DTO\Category as CategoryDTO;
use App\Models\DTO\Brand as BrandDTO;
use App\Models\DTO\Office as OfficeDTO;
use App\Models\DTO\Productworkingstate as ProductworkingstateDTO;

class Product {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'model_id', 'note', 'price', 'serial', 'external_id', 'productstate_id'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->model_id = $entity->model_id;
        $this->price = $entity->price;
        $this->note = $entity->note;
        $this->model = (new ModelDTO($entity->model))->kvp();
        $this->category = (new CategoryDTO($entity->model->category))->kvp();
        $this->brand = (new BrandDTO($entity->model->brand))->kvp();
        if ($entity->latestoffices()->get()->count() > 0) {
            $this->office = (new OfficeDTO($entity->latestoffices()->first()))->kvp();
        }
        if ($entity->latestworkingstates()->get()->count() > 0) {
            $this->productworkingstate = (new ProductworkingstateDTO($entity->latestworkingstates()->first()))->kvp();
        }
        $this->serial = $entity->serial;
        $this->external_id = $entity->external_id;
        $this->productstate_id = $entity->productstate_id;
        $this->productworkingstate_id = $entity->productstate_id;
        $this->enabled = $entity->deleted_at == null;
    }

    public function kvp() {
        return ["key" => $this->serial, "value" => $this->id];
    }

}
