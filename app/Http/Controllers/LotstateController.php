<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Lotstate;

class LotstateController extends Controller
{
    public function index(Request $request)
    {
        $lotstates = Lotstate::all();
        return response()->json($lotstates);     
    }
    public function get($id){
  
        $lotstate  = Lotstate::find($id);
  
        return response()->json($lotstate);
    }
    public function create(Request $request)
    {
        $lotstate=Lotstate::create($request->all());
        return response()->json($lotstate);
    }
    public function update(Request $request, $id)
    {
        $lotstate=Lotstate::find($id);
        $lotstate->name = $request->input('name');
        $lotstate->details = $request->input('details');
        $lotstate->save();
        return response()->json($lotstate);   
    }
    public function delete($id){
        $lotstate  = Lotstate::find($id);
        $lotstate->delete();
        return response()->json('deleted');
    }
   
}
?>