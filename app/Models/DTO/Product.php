<?php

namespace App\Models\DTO;

use App\Models\Entities\Product as Entity;
use App\Models\DTO\Model as ModelDTO;
use App\Models\DTO\Category as CategoryDTO;
use App\Models\DTO\Brand as BrandDTO;
use App\Models\DTO\Office as OfficeDTO;
use App\Models\DTO\Productworkingstate as ProductworkingstateDTO;
use QrCode;

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
        $this->price = floatval($entity->price);
        $this->note = $entity->note;
        $this->model = (new ModelDTO($entity->model))->kvp();
        $this->category = (new CategoryDTO($entity->model->category))->kvp();
        $this->brand = (new BrandDTO($entity->model->brand))->kvp();
        if ($entity->offices()->get()->count() > 0) {
            $this->office = (new OfficeDTO($entity->offices()->first()))->kvp();
        }
        if ($entity->workingstates()->get()->count() > 0) {
            $this->workingstate = (new ProductworkingstateDTO($entity->workingstates()->first()))->kvp();
        }
        $this->serial = $entity->serial;
        $this->external_id = $entity->external_id;
        $this->productstate_id = $entity->productstate_id;
        $this->productworkingstate_id = $entity->productstate_id;
        $this->enabled = $entity->deleted_at == null;
        $this->statecssclass = self::getstatecssclass($this->workingstate["value"]);
        $this->created_at = date('Y/m/d H:i:s', strtotime($entity->created_at));
        $this->qrcode = QrCode::encoding('UTF-8')->size(200)->generate(url('products/external/' . $entity->external_id));
    }

    public function kvp() {
        return ["key" => $this->serial, "value" => $this->id];
    }

    private function getstatecssclass($state) {
        switch ($state) {
            case 1:
                return 'bg-success-darken';
            case 2:
                return 'bg-danger-darken';
            case 3:
                return 'bg-info-darken';
            case 4:
                return 'bg-warning-darken';
            case 5:
                return 'bg-purple-darken';
            case 6:
                return 'bg-primary-darken';
            default:
                return 'bg-darken';
        }
    }

}
