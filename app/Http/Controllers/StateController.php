<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entities\Productworkingstate;
use App\Models\Entities\Productstate;

use App\Models\DTO\Productworkingstate as ProductworkingstateDTO;
use App\Models\DTO\Productstate as ProductstateDTO;

class StateController extends Controller {

    public function product(Request $request) {
        $kvps = Productstate::all()->map(function ($item, $key) {
            return (new ProductstateDTO($item))->kvp();
        });
        return response()->json($kvps);
    }

    public function productworking(Request $request) {
        $kvps = Productworkingstate::all()->map(function ($item, $key) {
            return (new ProductworkingstateDTO($item))->kvp();
        });
        return response()->json($kvps);
    }
}

?>