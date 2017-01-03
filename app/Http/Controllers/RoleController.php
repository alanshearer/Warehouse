<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Role;

class RoleController extends Controller {

    public function search(Request $request)
    {
        $page = $request->page;
        $elements = $request->elements;
        $orderby = isset($request->orderby) ? $request->orderby : 'name';
        $type = $request->desc == 'true' ? 'desc' : 'asc';
        $term = $request->term ?? '';
        $isActive = $request->isActive ?? false;
        $paginateditems = Role::where('name', 'LIKE', '%'.$term.'%')->orderBy($orderby, $type)->paginate($elements, null, '', $page);
        return response()->json($paginateditems);     
    }
    
    public function kvp(Request $request) {
        $roles = Role::all()->map(function ($item, $key) {
            return ["key" => $item->name, "value" => $item->id];
        }); 
        return response()->json($roles);
    }

    
    public function index(Request $request) {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function get($id) {
        $role = Role::find($id);
        return response()->json($role);
    }

    public function create(Request $request) {
        $role = Role::create($request->all());
        return response()->json($role);
    }

    public function update(Request $request, $id) {
        $role = Role::find($id);
        $role->fill($request->all());
        $role->save();
        return response()->json($role);
    }

    public function delete($id) {
        $role = Role::find($id);
        $role->delete();
        return response()->json('deleted');
    }
}
?>