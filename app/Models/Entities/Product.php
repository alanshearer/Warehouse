<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'model_id', 'note', 'price', 'serial', 'external_id', 'productstate_id'
    ];

    public function model() {
        return $this->belongsTo('App\Models\Entities\Model', 'model_id', 'id');
    }

    public function offices() {
        return $this->belongsToMany('App\Models\Entities\Office');
    }

    public function states() {
        return $this->belongsToMany('App\Models\Entities\Productstate');
    }

}
