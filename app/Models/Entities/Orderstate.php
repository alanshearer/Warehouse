<?php

namespace App\Models\DTO;

class Orderstate {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description'
    ];

    public function orders() {
        return $this->belongsToMany('App\Models\Entities\Order');
    }

}
