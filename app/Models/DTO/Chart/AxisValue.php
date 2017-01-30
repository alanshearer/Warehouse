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

    public function __construct($key, $value) {
        $this->x = $key;
        $this->y = $value;
    }

}
