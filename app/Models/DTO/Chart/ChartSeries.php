<?php

namespace App\Models\DTO\Chart;

use App\Models\DTO\Chart\AxisValue;

class ChartSeries {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    ];

    public function __construct($name, $colorByPoint, $color, $data) {
        $this->name = $name;
        $this->colorByPoint = $colorByPoint;
        $this->color = $color;
        $this->data = array();
        $this->xAxisValues = array();
        if ($data != null) {
            foreach ($data as $item) {
                array_push($this->data, $item->y);
                array_push($this->xAxisValues, $item->x);
            }
        }
    }

}
