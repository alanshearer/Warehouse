<?php

namespace App\Models\Entities;

use Illuminate\Database\Eloquent\Model as Model;

class Category extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'note'
    ];
    
        
}
