<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Model;

class ModelController extends Controller
{
    public function index(Request $request)
    {
        $models = Model::all();
        return response()->json($models);     
    }
    public function get($id){
  
        $model  = Model::find($id);
  
        return response()->json($model);
    }
    public function create(Request $request)
    {
        $model=Model::create($request->all());
        return response()->json($model);
    }
    public function update(Request $request, $id)
    {
        $model=Model::find($id);
        $model->name = $request->input('name');
        $model->details = $request->input('details');
        $model->save();
        return response()->json($model);   
    }
    public function delete($id){
        $model  = Model::find($id);
        $model->delete();
        return response()->json('deleted');
    }
   
}
?>