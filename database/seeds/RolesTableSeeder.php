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
            'shortname' => 'Amministratore',
            'description' => 'Descrizione Amministratore'
        ]);
        Role::create([
            'name' => 'Responsabile Magazzino',
            'shortname' => 'RespMagazzino',
            'description' => 'Descrizione Responsabile Magazzino'
        ]);
        Role::create([
            'name' => 'Controllore',
            'shortname' => 'Controllore',
            'description' => 'Descrizione Controllore'
        ]);
        Role::create([
            'name' => 'Responsabile Assistenza',
            'shortname' => 'RespAssistenza',
            'description' => 'Descrizione Responsabile Assistenza'
        ]);
    }

}
