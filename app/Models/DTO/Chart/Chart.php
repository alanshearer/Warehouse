<?php

namespace App\Models\DTO\Chart;

use App\Models\DTO\Chart\ChartSeries as ChartSeriesDTO;

class Chart {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    ];

    public function __construct($header, $description, $showLegend, $showDataLabels, $series) {
        $this->header = $header;
        $this->description = $description;
        $this->showLegend = $showLegend;
        $this->showDataLabels = $showDataLabels;
        $this->series = $series;
        $this->xAxisValues = array();

        if ($series != null) {
            $this->xAxisValues = $series[0]->xAxisValues;
        }
    }

}
