<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Role;

class RolesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Role::create([
            'name' => 'Amministratore',
            'description' => 'Descrizione Amministratore'
        ]);
        Role::create([
            'name' => 'Responsabile Magazzino',
            'description' => 'Descrizione Responsabile Magazzino'
        ]);
        Role::create([
            'name' => 'Controllore',
            'description' => 'Descrizione Controllore'
        ]);
        Role::create([
            'name' => 'Responsabile Assistenza',
            'description' => 'Descrizione Responsabile Assistenza'
        ]);
    }

}
