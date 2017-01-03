<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        return response()->json($categories);     
    }
    public function get($id){
  
        $category  = Category::find($id);
  
        return response()->json($category);
    }
    public function create(Request $request)
    {
        $category=Category::create($request->all());
        return response()->json($category);
    }
    public function update(Request $request, $id)
    {
        $category=Category::find($id);
        $category->name = $request->input('name');
        $category->details = $request->input('details');
        $category->save();
        return response()->json($category);   
    }
    public function delete($id){
        $category  = Category::find($id);
        $category->delete();
        return response()->json('deleted');
    }
   
}
?>