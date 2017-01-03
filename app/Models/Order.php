<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Order extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'document'
    ];
}
