<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Office;

class OfficeController extends Controller
{
    public function index(Request $request)
    {
        $offices = Office::all();
        return response()->json($offices);     
    }
    public function get($id){
  
        $office  = Office::find($id);
  
        return response()->json($office);
    }
    public function create(Request $request)
    {
        $office=Office::create($request->all());
        return response()->json($office);
    }
    public function update(Request $request, $id)
    {
        $office=Office::find($id);
        $office->name = $request->input('name');
        $office->details = $request->input('details');
        $office->save();
        return response()->json($office);   
    }
    public function delete($id){
        $office  = Office::find($id);
        $office->delete();
        return response()->json('deleted');
    }
   
}
?>