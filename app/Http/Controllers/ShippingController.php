<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Shipping as Entity;
use App\Models\DTO\Shipping as DTO;
use \Excel;
use \PDF;

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
        $entity->states()->attach(1, ['date' => new \DateTime()]);
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
        if ($request->shippingstate["value"] == 1) {
            foreach ($entity->products as $product) {
                $product->offices()->detach();
                $product->offices()->attach($request->destination["value"]);
            }
        } else if ($request->shippingstate["value"] == 2) {
            foreach ($entity->products as $product) {
                $product->offices()->detach();
                $product->offices()->attach($request->destination["value"]);
            }
        } else if ($request->shippingstate["value"] == 3) {
            foreach ($entity->products as $product) {
                $product->offices()->detach();
                $product->offices()->attach($request->destination["value"]);
            }
        }

        $entity->states()->detach();
        $entity->states()->attach($request->shippingstate["value"], ['date' => new \DateTime(), 'document' => self::createStateDocument($request)]);
        $entity->save();
        return response()->success(new DTO($entity));
    }

    public function delete($id) {
        $entity = Entity::find($id);
        $entity->delete();
        return response()->success(true);
    }
    
    public function document($id) {
        $document = Entity::withTrashed()->find($id)->states()->first()->pivot->document;
        return response($document)
            ->header('Cache-Control', 'no-cache private')
            ->header('Content-Description', 'File Transfer')
            ->header('Content-Type', 'application/pdf')
            ->header('Content-length', strlen($document))
            ->header('Content-Disposition', 'attachment; filename=statedocument.pdf')
            ->header('Content-Transfer-Encoding', 'binary');
    }


    private function createStateDocument(Request $request) {
//         return Excel::create('documento', function($excel) {
//                    $excel->sheet('Foglio 1', function($sheet) {
//                        $sheet->setOrientation('portrait');
//                        $sheet->row(1, array(
//                            'test1', 'test2'
//                       ));
//                    });
//                })->export('pdf');
        $pdf = PDF::loadView('pdf.invoice', []);
        //$pdf = PDF::loadHTML('<h1>Test</h1>');    
        $pdf->setPaper('A4', 'landscape');

        return $pdf->download('pippo.pdf');
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