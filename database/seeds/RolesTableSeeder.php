<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create([
            'name' => 'Amministratore',
            'description' => 'Descrizione amministratore'
        ]);
        Role::create([
            'name' => 'Supervisore',
            'description' => 'Descrizione supervisore'
        ]);
    }
}
