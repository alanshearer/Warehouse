<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Category as Entity;
use App\Models\DTO\Category as DTO;
use \Excel;

class CategoryController extends Controller {

    public function index(Request $request) {
        $dtos = self::createDTOArray(Entity::all());
        return response()->success($dtos);
    }

    public function search(Request $request) {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $paginateditems = Entity::where('name', 'LIKE', '%' . $term . '%')
                ->orderBy($orderby, $type)
                ->paginate($elements, null, '', $page);
        $paginateditems->setCollection(self::createDTOArray($paginateditems->getCollection()));
        return response()->json($paginateditems);
    }

    public function kvp() {
        $categories = Entity::all()->map(function ($item, $key) {
            return $item->kvp();
        });
        return response()->json($categories);
    }

    public function get($id) {
        $entity = Entity::find($id);
        $dto = self::createDTO($entity);
        return response()->json($dto);
    }

    public function create(Request $request) {
        $entity = Entity::create(self::createEntity($request));
        return response()->success($entity);
    }

    public function update(Request $request, $id) {
        $entity = Entity::find($id);
        $entity->fill(self::createEntity($request));
        $entity->save();
        return response()->success($entity);
    }

    public function delete($id) {
        $category = Entity::find($id);
        $category->delete();
        return response()->json('deleted');
    }

    public function xls(Request $request) {
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $items = Entity::where('name', 'LIKE', '%' . $term . '%')
                ->orderBy($orderby, $type)
                ->get()
                ->map(function ($item, $key) {
            return new DTO($item);
        });

        Excel::create('file', function($excel) use($items) {
            $excel->sheet('foglio', function($sheet) use($items) {
                $sheet->setOrientation('portrait');
                $sheet->fromArray($items);
               
            });
        })->store('xls');
        return self::file_get_contents_utf8(storage_path('exports\file.xls'));
        //print($file);
       //return response()->json($items);
    }
    
    public function file_get_contents_utf8($fn) {
     $content = file_get_contents($fn);
      return mb_convert_encoding($content, 'UTF-8',
          mb_detect_encoding($content, 'UTF-8, ISO-8859-1', true));
}

    private function createDTO($entity) {
        return new DTO($entity);
    }

    private function createEntity($dto) {
        return [
            'name' => $dto->name,
            'description' => $dto->description,
            'note' => $dto->note,
        ];
    }

    private function createDTOArray($entities) {
        return $entities->map(function ($entity, $key) {
                    return self::createDTO($entity);
                });
    }

}

?>