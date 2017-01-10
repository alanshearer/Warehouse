<?php

namespace App\Models\DTO;

class Productstate {

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
