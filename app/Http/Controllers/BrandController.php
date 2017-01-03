<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Brand;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $brands = Brand::all();
        return response()->json($brands);     
    }
    public function get($id){
  
        $brand  = Brand::find($id);
  
        return response()->json($brand);
    }
    public function create(Request $request)
    {
        $brand=Brand::create($request->all());
        return response()->json($brand);
    }
    public function update(Request $request, $id)
    {
        $brand=Brand::find($id);
        $brand->name = $request->input('name');
        $brand->details = $request->input('details');
        $brand->save();
        return response()->json($brand);   
    }
    public function delete($id){
        $brand  = Brand::find($id);
        $brand->delete();
        return response()->json('deleted');
    }
   
}
?>