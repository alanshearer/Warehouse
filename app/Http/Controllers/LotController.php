<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Lot;

class LotController extends Controller
{
    public function index(Request $request)
    {
        $lots = Lot::all();
        return response()->json($lots);     
    }
    public function get($id){
  
        $lot  = Lot::find($id);
  
        return response()->json($lot);
    }
    public function create(Request $request)
    {
        $lot=Lot::create($request->all());
        return response()->json($lot);
    }
    public function update(Request $request, $id)
    {
        $lot=Lot::find($id);
        $lot->name = $request->input('name');
        $lot->details = $request->input('details');
        $lot->save();
        return response()->json($lot);   
    }
    public function delete($id){
        $lot  = Lot::find($id);
        $lot->delete();
        return response()->json('deleted');
    }
   
}
?>