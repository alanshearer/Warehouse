<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\City\C;

class LocationController extends Controller {

    public function countries(Request $request) {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function counties($id) {
        $category = Category::find($id);
        return response()->json($category);
    }

    public function cities($id) {
        $category = Category::find($id);
        return response()->json($category);
    }

    public function citiesforcounty($id) {
        $category = Category::find($id);
        return response()->json($category);
    }
}

?>