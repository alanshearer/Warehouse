<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Shippingstate;

class ShippingstateController extends Controller
{
    public function index(Request $request)
    {
        $lotstates = Shippingstate::all();
        return response()->json($lotstates);     
    }
    public function get($id){
  
        $lotstate  = Shippingstate::find($id);
  
        return response()->json($lotstate);
    }
    public function create(Request $request)
    {
        $lotstate=Shippingstate::create($request->all());
        return response()->json($lotstate);
    }
    public function update(Request $request, $id)
    {
        $lotstate=Shippingstate::find($id);
        $lotstate->name = $request->input('name');
        $lotstate->details = $request->input('details');
        $lotstate->save();
        return response()->json($lotstate);   
    }
    public function delete($id){
        $lotstate  = Shippingstate::find($id);
        $lotstate->delete();
        return response()->json('deleted');
    }
   
}
?>