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
    protected $relations = ['model', 'state', 'offices', 'checks', 'workingstates'];

    public function model() {
        return $this->belongsTo('App\Models\Entities\Model', 'model_id', 'id');
    }

    public function state() {
        return $this->belongsTo('App\Models\Entities\Productstate', 'productstate_id', 'id');
    }

    public function offices() {
        return $this->belongsToMany('App\Models\Entities\Office', 'office_product')->withTimestamps();
    }

    public function latestoffices() {
        return $this->offices()->orderBy('pivot_created_at', 'desc');
    }

    public function checks() {
        return $this->hasMany('App\Models\Entities\Check');
    }

    public function supports() {
        return $this->hasMany('App\Models\Entities\Support');
    }

    public function workingstates() {
        return $this->belongsToMany('App\Models\Entities\Productworkingstate', 'product_productworkingstate')->withTimestamps();
    }

    public function latestworkingstates() {
        return $this->workingstates()->orderBy('pivot_created_at', 'desc');
    }
    

}
