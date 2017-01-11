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

        $paginateditems = Entity::withTrashed()
                ->join('models as model', 'model.id', '=', 'model_id')
                ->join('brands as brand', 'brand.id', '=', 'model.brand_id')
                ->join('categories as category', 'category.id', '=', 'model.category_id')
                ->where(function ($query) use($term) {
                    $query->where('model.name', 'LIKE', '%' . $term . '%')
                    ->orWhere('brand.name', 'LIKE', '%' . $term . '%')
                    ->orWhere('category.name', 'LIKE', '%' . $term . '%');
                })
                //->with('model', 'model.brand', 'model.category')
                ->where(function ($query) use ($isActive) {
                    if ($isActive) {
                        $query->whereNull('deleted_at');
                    }
                })
                ->orderBy($orderby, $type)
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
        $entity = Entity::create(self::toEntity($request));
        $entity->fill(["external_id" => self::composeexternal_id($entity->id)]);
        $entity->save();
        return response()->success(new DTO($entity));
    }

    public function update(Request $request, $id) {
        $entity = Entity::withTrashed()->find($id);
        $entity->fill(self::toEntity($request));
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
            'key' => $entity->name,
            'value' => $entity->id
        ];
    }

    private function toEntity($dto) {
        return [
            'model_id' => $dto->model["value"],
            'price' => $dto->price,
            'productstate_id' => $dto->productstate_id ?? 1,
            'note' => $dto->note,
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