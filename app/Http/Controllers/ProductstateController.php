<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Productstate;

class ProductstateController extends Controller
{
    public function index(Request $request)
    {
        $productstates = Productstate::all();
        return response()->json($productstates);     
    }
    public function get($id){
  
        $productstate  = Productstate::find($id);
  
        return response()->json($productstate);
    }
    public function create(Request $request)
    {
        $productstate=Productstate::create($request->all());
        return response()->json($productstate);
    }
    public function update(Request $request, $id)
    {
        $productstate=Productstate::find($id);
        $productstate->name = $request->input('name');
        $productstate->details = $request->input('details');
        $productstate->save();
        return response()->json($productstate);   
    }
    public function delete($id){
        $productstate  = Productstate::find($id);
        $productstate->delete();
        return response()->json('deleted');
    }
   
}
?>