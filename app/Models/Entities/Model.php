<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Model extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'category_id', 'brand_id', 'note'
    ];

    public function category() {
        return $this->belongsTo('App\Models\Entities\Category', 'category_id', 'id');
    }

    public function brand() {
        return $this->belongsTo('App\Models\Entities\Brand', 'brand_id', 'id');
    }
    
        public function products() {
        return $this->hasMany('App\Models\Entities\Product');
    }

}
