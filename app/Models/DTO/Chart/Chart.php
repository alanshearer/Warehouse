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
        $this->series = array();
        if ($series == null) {
            $this->xAxisValues = array();
        } else {
            $this->xAxisValues = array_keys($series[0]->data);
            foreach ($series as $singleseries){
                array_push($this->series, array_values($singleseries->data));
            }
        }
        
    }

}
