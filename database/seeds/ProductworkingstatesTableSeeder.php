<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Productworkingstate;

class ProductworkingstatesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Productworkingstate::create([
            'id' => 1,
            'name' => 'Funzionante',
            'description' => 'Prodotto Funzionante',
            'check' => true,
            'support' => true,
        ]);

        Productworkingstate::create([
            'id' => 2,
            'name' => 'Rotto',
            'description' => 'Prodotto rotto',
            'check' => true,
        ]);
        Productworkingstate::create([
            'id' => 3,
            'name' => 'In riparazione',
            'description' => 'Prodotto in riparazione',
            'check' => true,
            'support' => true,
        ]);

        Productworkingstate::create([
            'id' => 4,
            'name' => 'Gettato',
            'description' => 'Prodotto definitivamente gettato',
            'support' => true,
        ]);

        Productworkingstate::create([
            'id' => 5,
            'name' => 'Mancante',
            'description' => 'Prodotto mancante',
            'check' => true,
        ]);
    }

}
