<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::all();
        return response()->json($users);     
    }
    public function get($id){
  
        $user  = User::find($id);
  
        return response()->json($user);
    }
    public function create(Request $request)
    {
        $user=User::create($request->all());
        return response()->json($user);
    }
    public function update(Request $request, $id)
    {
        $user=User::find($id);
        $user->name = $request->input('name');
        $user->details = $request->input('details');
        $user->save();
        return response()->json($user);   
    }
    public function delete($id){
        $user  = User::find($id);
        $user->delete();
        return response()->json('deleted');
    }
   
}
?>