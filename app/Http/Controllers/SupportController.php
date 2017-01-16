<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Product as ProductEntity;
use App\Models\Entities\Support as SupportEntity;
use App\Models\DTO\Support as DTO;
use \Excel;

class SupportController extends Controller {

    public function index(Request $request) {
        $dtos = self::toDTOArray(Entity::all());
        return response()->success($dtos);
    }

    public function search(Request $request) {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'model.name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ? $request->term : '';
        $isActive = $request->isActive ? $request->isActive : false;

        $paginateditems = ProductEntity::withTrashed()
                ->with('supports', 'workingstates', 'model', 'model.brand', 'model.category')
                ->where(function ($query) {
                    $query->whereHas('workingstates', function ($q) {
                        $q->where('productworkingstate_id', '=', 2);
                    });
                })
                ->where(function ($query) use($term) {
                    $query->whereHas('model', function($q) use($term) {
                        $q->where('name', 'LIKE', '%' . $term . '%');
                    })
                    ->orWhereHas('model.brand', function($q) use($term) {
                        $q->where('name', 'LIKE', '%' . $term . '%');
                    })
                    ->orWhereHas('model.category', function($q) use($term) {
                        $q->where('name', 'LIKE', '%' . $term . '%');
                    });
                })
                ->where(function ($query) use ($isActive) {
                    if ($isActive) {
                        $query->whereNull('deleted_at');
                    }
                })
                //->orderBy($orderby, $type)
                ->paginate($elements, null, '', $page);
        $paginateditems->setCollection(self::toDTOArray($paginateditems->getCollection()));
        return response()->success($paginateditems);
    }

    public function kvp() {
        $kvps = self::toKVPArray(Entity::all());
        return response()->success($kvps);
    }

    public function get($id) {
        $entity = Entity::withTrashed()->find($id);
        $dto = self::toDTO($entity);
        return response()->success($dto);
    }

    public function create(Request $request) {
        $supportentity = SupportEntity::create(self::toSupportEntity($request));
        $supportentity->save();
        $productentity = ProductEntity::find($request->product_id);
        $productentity->workingstates()->detach();
        $productentity->workingstates()->attach($request->workingstate_id, ['date' => new \DateTime()]);
        
        return response()->success(true);
    }

    private function toDTO($entity) {
        return new DTO($entity);
    }

    private function toKVP($entity) {
        return [
            'key' => $entity->serial,
            'value' => $entity->id
        ];
    }

    private function toSupportEntity($dto) {
        $date = new \DateTime();
        return [
            'date' => date('Y-m-d', strtotime($date->format('Y-m-d H:i:s')) - $date->format('Z')),
            'user_id' => 4,
            'product_id' => $dto->product_id,
            'productworkingstate_id' => $dto->workingstate_id,
        ];
    }

    private function toDTOArray($entities) {
        return $entities->map(function ($entity, $key) {
                    return self::toDTO($entity);
                });
    }

    private function toKVPArray($entities) {
        return $entities->map(function ($entity, $key) {
                    return self::toKVP($entity);
                });
    }

    private function composeexternal_id($product) {
        return 'prod-' . $product;
    }

}

?>