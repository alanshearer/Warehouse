<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\ShippingScope;

class Shipping extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope(new ShippingScope);;
    }
    
    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date', 'note', 'origin_id', 'destination_id'
    ];

    public function states() {
        return $this->belongsToMany('App\Models\Entities\Shippingstate')->withPivot('id', 'date', 'document')->withTimestamps();
    }

    public function products() {
        return $this->belongsToMany('App\Models\Entities\Product', 'shipping_product')->withTimestamps();
    }

    public function origin() {
        return $this->belongsTo('App\Models\Entities\Office', 'origin_id', 'id');
    }

    public function destination() {
        return $this->belongsTo('App\Models\Entities\Office', 'destination_id', 'id');
    }

}
