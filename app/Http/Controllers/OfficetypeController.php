<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Officetype;

class OfficetypeController extends Controller
{
    public function index(Request $request)
    {
        $officetypes = Officetype::all();
        return response()->json($officetypes);     
    }
    public function get($id){
  
        $officetype  = Officetype::find($id);
  
        return response()->json($officetype);
    }
    public function create(Request $request)
    {
        $officetype=Officetype::create($request->all());
        return response()->json($officetype);
    }
    public function update(Request $request, $id)
    {
        $officetype=Officetype::find($id);
        $officetype->name = $request->input('name');
        $officetype->details = $request->input('details');
        $officetype->save();
        return response()->json($officetype);   
    }
    public function delete($id){
        $officetype  = Officetype::find($id);
        $officetype->delete();
        return response()->json('deleted');
    }
   
}
?>