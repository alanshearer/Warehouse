<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'note'
    ];
    
    public function models() {
        return $this->hasMany('App\Models\Entities\Model');
    }
    
    public function products(){        
        return $this->hasManyThrough('App\Models\Entities\Product', 'App\Models\Entities\Model');
    }

}
