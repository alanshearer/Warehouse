<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Location\City;
use App\Models\Location\County;
use App\Models\Location\Region;
use App\Models\Location\Country;

class LocationController extends Controller {

    public function countries(Request $request) {
        $countries = Country::all()->map(function ($item, $key) {
            return $item->kvp();
        });
        return response()->json($countries);
    }

    public function counties($id) {
        $counties = Country::find($id)->counties->map(function ($item, $key) {
            return $item->short();
        });
        return response()->json($counties);
    }

    public function cities($id) {
        $cities = County::find($id)->cities->map(function ($item, $key) {
            return $item->kvp();
        });;
        return response()->json($cities);
    }

    public function city($id) {
        $city = City::find($id)->first();
        return response()->json($city);
    }
}

?>