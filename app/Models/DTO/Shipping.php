<?php

namespace App\Models\DTO;

use App\Models\Entities\Shipping as Entity;
use App\Models\DTO\Office as OfficeDTO;
use App\Models\DTO\Product as ProductDTO;
use App\Models\DTO\Model as ModelDTO;
use App\Models\DTO\Category as CategoryDTO;
use App\Models\DTO\Brand as BrandDTO;
use App\Models\DTO\Shippingstate as ShippingstateDTO;

class Shipping {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'note'
    ];

    public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->date = date("Y-m-d\TH:i:s.000\Z", strtotime($entity->date));
        $this->note = $entity->note;
        $this->origin_id = $entity->origin_id;
        $this->destination_id = $entity->destination_id;
        $this->origin = (new OfficeDTO($entity->origin))->kvp();
        $this->destination = (new OfficeDTO($entity->destination))->kvp();
        $this->products = array();
        foreach ($entity->products as $key => $product) {
            array_push($this->products, self::toshippingproduct($product));
        }
        if ($entity->states()->get()->count() > 0) {
            $this->shippingstate = (new ShippingstateDTO($entity->states()->first()))->kvp();
        }
        $this->enabled = $entity->deleted_at == null ? true : false;
    }

    public function toshippingproduct($product) {
        return [
            'product' => (new ProductDTO($product))->kvp(),
            'model' => (new ModelDTO($product->model))->kvp(),
            'category' => (new CategoryDTO($product->model->category))->kvp(),
            'brand' => (new BrandDTO($product->model->brand))->kvp(),
        ];
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
