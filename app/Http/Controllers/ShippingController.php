<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Shipping as Entity;
use App\Models\DTO\Shipping as DTO;
use \Excel;

class ShippingController extends Controller {

    public function index(Request $request) {
        $dtos = self::toDTOArray(Entity::all());
        return response()->success($dtos);
    }

    public function search(Request $request) {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'date';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ? $request->term : '';
        $isActive = $request->isActive ? $request->isActive : false;

        $paginateditems = Entity::withTrashed()
                ->where(function ($query) use($term) {
//                    $query->where('name', 'LIKE', '%' . $term . '%')
//                    ->orWhere('description', 'LIKE', '%' . $term . '%');
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
        $entity->products()->detach();
        if ($request->products) {
            foreach ($request->products as $product) {
                $entity->products()->attach($product["product"]["value"]);
            }
        }
        return response()->success(new DTO($entity));
    }

    public function update(Request $request, $id) {
        $entity = Entity::withTrashed()->find($id);
        $entity->fill(self::toEntity($request));
        $entity->products()->detach();
        if ($request->products) {
            foreach ($request->products as $product) {
                $entity->products()->attach($product["product"]["value"]);
            }
        }
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
        $date = new \DateTime($dto->date);
        return [
            'date' => date('Y-m-d', strtotime($date->format('Y-m-d H:i:s')) - $date->format('Z')),
            'note' => $dto->note,
            'origin_id' => $dto->origin["value"],
            'destination_id' => $dto->destination["value"]
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