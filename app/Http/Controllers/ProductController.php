<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Product as Entity;
use App\Models\DTO\Product as DTO;
use \Excel;

class ProductController extends Controller {

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
        $office_id = $request->officeId ? $request->officeId : null;
        $paginateditems = Entity::withTrashed()
                ->with('offices', 'workingstates', 'model', 'model.brand', 'model.category')
//                ->where(function ($query) {
//                    $query->whereDoesntHave('workingstates')
//                    ->orWhereHas('workingstates', function ($q) {
//                        $q->where('productworkingstate_id', '=', 1);
//                    });
//                })
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
                ->where(function ($query) use ($office_id) {
                    if ($office_id) {
                        $query->whereHas('offices', function ($q) use ($office_id) {
                            $q->where('office_id', '=', $office_id);
                        });
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

    public function qr($id) {
        $entity = Entity::withTrashed()->find($id);
        $entity->external_id;
        return QrCode::format('png')->generate(url('products/external/' . $entity->external_id));
    }

    public function get($id) {
        $entity = Entity::withTrashed()->find($id);
        $dto = self::toDTO($entity);
        return response()->success($dto);
    }

    public function create(Request $request) {
        $entity = Entity::create(self::toEntity($request));
        $entity->fill(["external_id" => self::composeexternal_id($entity->id)]);
        self::normalize($entity);
        $entity->save();
        return response()->success(new DTO($entity));
    }

    public function update(Request $request, $id) {
        $entity = Entity::withTrashed()->find($id);
        $entity->fill(self::toEntity($request));
        self::normalize($entity);
        $entity->save();
        return response()->success(new DTO($entity));
    }

    public function delete($id) {
        $entity = Entity::find($id);
        $entity->delete();
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

    private function toEntity($dto) {
        return [
            'model_id' => $dto->model["value"],
            'price' => $dto->price,
            'serial' => $dto->serial,
            'note' => $dto->note,
            'office_id' => $dto->office["value"],
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

    private function normalize($entity) {
        if ($entity->workingstates()->count() == 0) {
            $entity->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        }
        if ($entity->offices()->count() == 0) {
            $entity->offices()->attach(1);
        }
    }

}

?>