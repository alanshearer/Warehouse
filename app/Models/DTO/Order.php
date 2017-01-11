<?php

namespace App\Models\DTO;

use App\Models\Entities\Order as Entity;
use App\Models\DTO\Supplier as SupplierDto;
use App\Models\DTO\Model as ModelDto;
use App\Models\DTO\Category as CategoryDto;
use App\Models\DTO\Brand as BrandDto;
use DateTime;
class Order {

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
        $this->supplier_id = $entity->supplier_id;
        $this->supplier = (new SupplierDto($entity->supplier))->kvp();
        $this->models = array();
        foreach($entity->models as $key => $model){
            array_push($this->models, self::toordermodel($model));
        }
        $this->enabled = $entity->deleted_at == null ? true : false;
    }
    
    public function toordermodel($model){
        return [
            'model' => (new ModelDTO($model))->kvp(),
            'category' => (new CategoryDTO($model->category))->kvp(),
            'brand' => (new BrandDTO($model->brand))->kvp(),
            'quantity' => $model->pivot->quantity
        ];
    }
    
    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }
}
