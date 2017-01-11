<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Office as Entity;
use App\Models\DTO\Office as DTO;
use \Excel;

class OfficeController extends Controller {

    public function index(Request $request) {
        $dtos = self::toDTOArray(Entity::all());
        return response()->success($dtos);
    }

    public function search(Request $request) {
        $officetype_id = $request->officetype_id;
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ? $request->term : '';
        $isActive = $request->isActive ? $request->isActive : false;

        $paginateditems = Entity::withTrashed()
                ->where('officetype_id', '=', $officetype_id)
                ->with('city', 'city.county', 'city.county.region', 'city.county.region.country')
                ->where(function ($query) use($term) {
                    $query->where('name', 'LIKE', '%' . $term . '%')
                    ->orWhere('address', 'LIKE', '%' . $term . '%');
                })
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

    public function kvp(Request $request) {
        $officetype_id = $request->officetype_id;
        $kvps = self::toKVPArray(Entity::where('officetype_id', '=', $officetype_id)->all());
        return response()->success($kvps);
    }

    public function get(Request $request, $id) {
        $officetype_id = $request->officetype_id;
        //print($officetype_id);
        $entity = Entity::withTrashed()->find($id);
        $dto = self::toDTO($entity);
        return response()->success($dto);
    }

    public function create(Request $request) {
        $entity = Entity::create(self::toEntity($request));
        return response()->success(new DTO($entity));
    }

    public function update(Request $request, $id) {
        $officetype_id = $request->officetype_id;
        $entity = Entity::withTrashed()->where('officetype_id', '=', $officetype_id)->find($id);
        $entity->fill(self::toEntity($request));
        $entity->save();
        return response()->success(new DTO($entity));
    }

    public function delete(Request $request, $id) {
        $officetype_id = $request->officetype_id;
        $entity = Entity::withTrashed()->where('officetype_id', '=', $officetype_id)->find($id);
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
            'name' => $dto->name,
            'address' => $dto->address,
            'postalcode' => $dto->postalcode,
            'city_id' => $dto->city_id,
            'officetype_id' => $dto->officetype_id,
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

}

?>