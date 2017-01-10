<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Officetype;
use Illuminate\Support\Facades\Hash;

class OfficetypesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Officetype::create([
            'id' => 1,
            'name' => 'Ufficio',
            'description' => 'ufficio',
        ]);

        Officetype::create([
            'id' => 2,
            'name' => 'Magazzino',
            'description' => 'magazzino',
        ]);
    }

}
