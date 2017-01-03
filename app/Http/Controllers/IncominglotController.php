<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::all();
        return response()->json($orders);     
    }
    public function get($id){
  
        $order  = Order::find($id);
  
        return response()->json($order);
    }
    public function create(Request $request)
    {
        $order=Order::create($request->all());
        return response()->json($order);
    }
    public function update(Request $request, $id)
    {
        $order=Order::find($id);
        $order->name = $request->input('name');
        $order->details = $request->input('details');
        $order->save();
        return response()->json($order);   
    }
    public function delete($id){
        $order  = Order::find($id);
        $order->delete();
        return response()->json('deleted');
    }
   
}
?>