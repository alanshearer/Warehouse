<?php

namespace App\Models\Entities;

//use Illuminate\Notifications\Notifiable;
//use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    protected $softDeletes = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname', 'lastname', 'birthDate', 'username', 'email', 'role_id', 'password', 'password_confirmation'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'password_confirmation', 'remember_token',
    ];

    public function role() {
        return $this->belongsTo('App\Models\Entities\Role', 'role_id', 'id');
    }
    
    public function offices() {
        return $this->belongsToMany('App\Models\Entities\Office', 'user_office')->whereNull('user_office.deleted_at')->withTimestamps();
    }

}
