<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use \Excel;

class SupplierController extends Controller {

    public function index(Request $request) {
        $suppliers = Supplier::all();
        return response()->json($suppliers);
    }

    public function search(Request $request) {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $paginateditems = Supplier::with('city', 'city.county', 'city.county.region', 'city.county.region.country')
                ->where('name', 'LIKE', '%' . $term . '%')
                ->orderBy($orderby, $type)
                ->paginate($elements, null, '', $page);
        $items = $paginateditems->getCollection()->map(function ($item, $key) {
            return $item->short();
        });
        $paginateditems->setCollection($items);
        return response()->json($paginateditems);
    }

    public function get($id) {
        $supplier = Supplier::find($id)->short();
        return response()->json($supplier);
    }

    public function create(Request $request) {
        $supplier = Supplier::create($request->all());
        return response()->json($supplier);
    }

    public function update(Request $request, $id) {
        $supplier = Supplier::find($id);
        $supplier->fill($request->all());
        $supplier->save();
        return response()->json($supplier);
    }

    public function delete($id) {
        $supplier = Supplier::find($id);
        $supplier->delete();
        return response()->json('deleted');
    }

    public function xls(Request $request) {
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $items = Supplier::with('city', 'city.county', 'city.county.region', 'city.county.region.country')
                ->where('name', 'LIKE', '%' . $term . '%')
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