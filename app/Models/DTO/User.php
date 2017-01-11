<?php

namespace App\Models\DTO;
use App\Models\Entities\User as Entity;
use App\Models\DTO\Role as RoleDTO;

class User 
{
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
        'password',  'password_confirmation', 'remember_token',
    ];
    
        public function __construct(Entity $entity) {
        $this->id = $entity->id;
        $this->username = $entity->username;
        $this->firstname = $entity->firstname;
        $this->lastname = $entity->lastname;
        $this->email = $entity->email;
        $this->role = (new RoleDTO($entity->role))->kvp();
        $this->enabled = !$entity->trashed();
    }

    public function kvp() {
        return ["key" => $this->name, "value" => $this->id];
    }
}
