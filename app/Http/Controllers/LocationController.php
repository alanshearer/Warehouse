<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Location\City;
use App\Models\Entities\Location\County;
use App\Models\Entities\Location\Country;

use App\Models\DTO\Location\City as CityDTO;
use App\Models\DTO\Location\County as CountyDTO;
use App\Models\DTO\Location\Country as CountryDTO;

class LocationController extends Controller {

    public function countries(Request $request) {
        $countries = Country::all()->map(function ($item, $key) {
            return (new CountryDTO($item))->kvp();
        });
        return response()->json($countries);
    }

    public function counties($id) {
        $counties = Country::find($id)->counties->map(function ($item, $key) {
            return (new CountyDTO($item))->short();
        });
        return response()->json($counties);
    }

    public function cities($id) {
        $cities = County::find($id)->cities->map(function ($item, $key) {
            return (new CityDTO($item))->kvp();
        });;
        return response()->json($cities);
    }

    public function city($id) {
        $city = City::find($id)->first();
        return response()->json(new CityDTO($city));
    }
}

?>