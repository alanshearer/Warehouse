<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use \Excel;

class BrandController extends Controller {

    public function index(Request $request) {
        $brands = Brand::all();
        return response()->json($brands);
    }

    public function search(Request $request) {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $paginateditems = Brand::where('name', 'LIKE', '%' . $term . '%')
                ->orderBy($orderby, $type)
                ->paginate($elements, null, '', $page);
//        $items = $paginateditems->getCollection()->map(function ($item, $key) {
//            return $item->short();
//        });
//        $paginateditems->setCollection($items);
        return response()->json($paginateditems);
    }
    public function kvp($id) {
        $brands = Brand::all()->map(function ($item, $key) {
            return $item->kvp();
        });
        return response()->json($brands);
    }
    
    public function get($id) {
        $brand = Brand::find($id)->short();
        return response()->json($brand);
    }

    public function create(Request $request) {
        $brand = Brand::create($request->all());
        return response()->json($brand);
    }

    public function update(Request $request, $id) {
        $brand = Brand::find($id);
        $brand->fill($request->all());
        $brand->save();
        return response()->json($brand);
    }

    public function delete($id) {
        $brand = Brand::find($id);
        $brand->delete();
        return response()->json('deleted');
    }

    public function xls(Request $request) {
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $items = Brand::where('name', 'LIKE', '%' . $term . '%')
                ->orderBy($orderby, $type)
                ->get()
                ->map(function ($item, $key) {
            return $item->short();
        });
        return Excel::create('Laravel Excel', function($excel) use($items) {

            $excel->sheet('Excel sheet', function($sheet) use($items) {

                $sheet->setOrientation('landscape');
                $sheet->with($items);
            });
        })->download('xlsx');
        //return response()->json($items);
    }

}

?>