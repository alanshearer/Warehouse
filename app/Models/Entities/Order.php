<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date', 'note', 'supplier_id'
    ];
    
    protected $dates = ['date'];


    public function supplier() {
        return $this->belongsTo('App\Models\Entities\Supplier', 'supplier_id', 'id');
    }

    public function models() {
        return $this->belongsToMany('App\Models\Entities\Model', 'order_model')->withPivot('quantity')->withTimestamps();
    }

    public function states() {
        return $this->belongsToMany('App\Models\Entities\Orderstate', 'order_orderstate');
    }

}
