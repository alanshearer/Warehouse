<?php

/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Models\Entities\Office as WarehouseEntity;
use App\Models\Entities\Brand as BrandEntity;
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
        $warehousesvalues = array();
        $warehouses = WarehouseEntity::with('products', 'products.model', 'products.model.category', 'products.workingstates')
                ->get();
        foreach ($warehouses as $warehouse) {
            array_push($warehousesvalues, new AxisValueDTO($warehouse->name, intval($warehouse->products()
                                    ->where(function ($query) {
                                        $query->whereHas('model.category', function($q) {
                                            $q->where('id', '=', 1);
                                        })
                                        ->whereHas('allworkingstates', function ($q) {
                                            $q->where('productworkingstates.id', '=', 2);
                                        });
                                    })
                                    ->count())));
        }
        $chartSeries = new ChartSeriesDTO('Cuffie', true, '#5cb85c', $warehousesvalues);
        $chart = new ChartDTO('Cuffie rotte per magazzino', '', true, true, array($chartSeries));
        return response()->success($chart);
    }

    public function brokenheadphonesforbrand() {
        $warehousesvalues = array();
        $brands = BrandEntity::with('products', 'products.model', 'products.model.category', 'products.workingstates')
                ->get();
        foreach ($brands as $brand) {
            array_push($warehousesvalues, new AxisValueDTO($brand->name, intval($brand->products()
                                        ->whereHas('allworkingstates', function ($q) {
                                            $q->where('productworkingstates.id', '=', 2);
                                        })
                                    ->count())));
        }
        $chartSeries = new ChartSeriesDTO('Cuffie', true, '#5cb85c', $warehousesvalues);
        $chart = new ChartDTO('Cuffie rotte per marca', '', true, true, array($chartSeries));
        return response()->success($chart);
    }

    public function repairrequestsforwarehouse() {
        $warehousesvalues = array();
        $warehouses = WarehouseEntity::with('products', 'products.model', 'products.model.category', 'products.workingstates')
                ->get();
        foreach ($warehouses as $warehouse) {
            array_push($warehousesvalues, new AxisValueDTO($warehouse->name, intval($warehouse->products()
                                    ->where(function ($query) {
                                        $query->whereHas('allworkingstates', function ($q) {
                                            $q->where('productworkingstates.id', '=', 3);
                                        });
                                    })
                                    ->count())));
        }
        $chartSeries = new ChartSeriesDTO('Richieste', true, '#5cb85c', $warehousesvalues);
        $chart = new ChartDTO('Richieste riparazioni per magazzino', '', true, true, array($chartSeries));
        return response()->success($chart);
    }

    public function avgworkingtimeforbrand() {
        $warehousesvalues = array();
        $brands = BrandEntity::with('products', 'products.model', 'products.model.category', 'products.workingstates')
                ->get();
        foreach ($brands as $brand) {
            array_push($warehousesvalues, new AxisValueDTO($brand->name, intval($brand->products()
                                        ->whereHas('allworkingstates', function ($q) {
                                            $q->where('productworkingstates.id', '=', 2);
                                        })
                                    ->count())));
        }
        $chartSeries = new ChartSeriesDTO('Cuffie', true, '#5cb85c', $warehousesvalues);
        $chart = new ChartDTO('Cuffie rotte per marca', '', true, true, array($chartSeries));
        return response()->success($chart);

    }

    public function dropsforwarehouse() {
        $warehousesvalues = array();
        $warehouses = WarehouseEntity::with('products', 'products.model', 'products.model.category', 'products.workingstates')
                ->get();
        foreach ($warehouses as $warehouse) {
            array_push($warehousesvalues, new AxisValueDTO($warehouse->name, intval($warehouse->products()
                                    ->where(function ($query) {
                                        $query->whereHas('allworkingstates', function ($q) {
                                            $q->where('productworkingstates.id', '=', 4);
                                        });
                                    })
                                    ->sum('price'))));
        }
        $chartSeries = new ChartSeriesDTO('Perdite', true, '#5cb85c', $warehousesvalues);
        $chart = new ChartDTO('Perdite per magazzino', '', true, true, array($chartSeries));
        return response()->success($chart);
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
