<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Models\Entities\User as UserEntity;
use App\Models\Entities\Office as OfficeEntity;

class ShippingScope implements Scope {

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
                $warehouse_ids = [];
                $office_ids = [];
                array_push($office_ids, $user->offices()->pluck('offices.id')->toArray());
                array_push($warehouse_ids, OfficeEntity::where('parent_id', $office_ids)->pluck('id')->toArray());
                $warehouse_ids = array_merge($warehouse_ids, $office_ids);
                $builder->where(function ($query) use($warehouse_ids) {
                    $query->whereIn('origin_id', $warehouse_ids)
                            ->orWhereIn('destination_id', $warehouse_ids);
                });
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
