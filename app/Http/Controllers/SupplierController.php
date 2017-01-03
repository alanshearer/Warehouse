<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Supplier;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier::all();
        return response()->json($suppliers);     
    }
    
    public function search(Request $request)
    {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $paginateditems = Supplier::orderBy($orderby, $type)->paginate($elements, null, '', $page);
        return response()->json($paginateditems);     
    }
    
    public function get($id)
    {
        $supplier = Supplier::find($id);
        return response()->json($supplier);
    }
    
    public function create(Request $request)
    {
        $supplier=Supplier::create($request->all());
        return response()->json($supplier);
    }
    
    public function update(Request $request, $id)
    {
        $supplier=Supplier::find($id);
        $supplier->fill($request->all());
        $supplier->save();
        return response()->json($supplier);   
    }
    
    public function delete($id){
        $supplier  = Supplier::find($id);
        $supplier->delete();
        return response()->json('deleted');
    }
}
?>