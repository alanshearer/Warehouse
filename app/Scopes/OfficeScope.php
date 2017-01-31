<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Models\Entities\User as UserEntity;
use App\Models\Entities\Office as OfficeEntity;
use Debugbar;

class OfficeScope implements Scope {

    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model) {
        $id = Auth::id();
        $user = UserEntity::findOrFail($id);
        $role_id = $user->role->id;
        switch ($role_id) {
            case 1:
                break;
            case 2:
                $builder->with('users', 'warehouse')
                        ->whereHas('users', function ($query) use($id) {
                            $query->where('users.id', '=', $id);
                        });
//                        ->orWhereHas('warehouse', function ($query) use($id) {
//                            $query->with('users')->where('users.id', '=', $id);
//                        });
//                $builder->where(function ($query) use($office_ids) {
//                    $query->whereIn('offices.id', $office_ids)
//                       ->orWhereIn('offices.parent_id', $office_ids);
//                });
                break;
            case 3:
                $builder->where('id', '<', 0);
                break;
            case 4:
                $builder->where('id', '<', 0);
                break;
            default:
                break;
        }
    }

}
