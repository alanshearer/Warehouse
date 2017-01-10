<?php

namespace App\Models\DTO;

class Lotstate {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }

}
