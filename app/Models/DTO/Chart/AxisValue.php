<?php

namespace App\Models\DTO\Chart;

class AxisValue {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    ];

    public function __construct($item) {
        $this->x = $item['key'];
        $this->y = $item['value'];
    }

}
