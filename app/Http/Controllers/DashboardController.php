<?php

/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Models\Entities\Office as WarehouseEntity;
use Illuminate\Support\Facades\DB;
use App\Models\DTO\Chart\Chart as ChartDTO;
use App\Models\DTO\Chart\ChartSeries as ChartSeriesDTO;
use App\Models\DTO\Chart\AxisValue as AxisValueDTO;

/**
 * Class HomeController
 * @package App\Http\Controllers
 */
class DashboardController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        
    }

    public function warehousesvalue() {
        $warehousesvalues = array();
        $warehouses = WarehouseEntity::with('products')
                ->get();
        foreach ($warehouses as $warehouse) {
            array_push($warehousesvalues, new AxisValueDTO($warehouse->name, floatval($warehouse->products()->sum('price'))));
        }
        $chartSeries = new ChartSeriesDTO('Valore', true, '#5cb85c', $warehousesvalues);
        $chart = new ChartDTO('Valore oggetti per magazzino', '', true, true, array($chartSeries));
        return response()->success($chart);
    }

    public function brokenheadphonesforwarehouse() {
        
    }

    public function brokenheadphonesforbrand() {
        
    }

    public function repairrequestsforwarehouse() {
        
    }

    public function avgworkingtimeforbrand() {
        
    }

    public function dropsforwarehouse() {
        
    }

    public function warehouseproducts() {
        $warehousesproducts = array();
        $warehouses = WarehouseEntity::with('products')
                ->get();
        foreach ($warehouses as $warehouse) {
            array_push($warehousesproducts, new AxisValueDTO($warehouse->name, $warehouse->products()->count()));
        }
        $chartSeries = new ChartSeriesDTO('Quantità', true, '#5cb85c', $warehousesproducts);
        $chart = new ChartDTO('Numero oggetti per magazzino', '', true, true, array($chartSeries));
        return response()->success($chart);
    }

}
