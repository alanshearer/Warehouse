<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\OfficeScope;

class Office extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    
    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot() {
        parent::boot();

        static::addGlobalScope(new OfficeScope);
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'city_id', 'postalcode', 'officetype_id', 'parent_id'
    ];
    protected $dates = ['created_at'];

    public function city() {
        return $this->belongsTo('App\Models\Entities\Location\City', 'city_id', 'id');
    }

    public function officetype() {
        return $this->belongsTo('App\Models\Entities\Location\Officetype', 'officetype_id', 'id');
    }

    public function products() {
        return $this->belongsToMany('App\Models\Entities\Product', 'office_product')->whereNull('office_product.deleted_at');
    }

    public function warehouse() {
        return $this->belongsTo('App\Models\Entities\Office', 'parent_id', 'id');
    }

    public function users() {
        return $this->belongsToMany('App\Models\Entities\User', 'user_office')->whereNull('user_office.deleted_at')->withTimestamps();
    }

}
