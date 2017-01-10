<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\Model as Model;

class Lot extends Model {

    use Illuminate\Database\Eloquent\SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'document', 'origin_id', 'destination_id'
    ];

}
