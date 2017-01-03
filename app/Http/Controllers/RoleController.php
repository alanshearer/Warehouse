<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Role;

class RoleController extends Controller {

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
        $role->name = $request->input('name');
        $role->details = $request->input('details');
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