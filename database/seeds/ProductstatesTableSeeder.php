<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Productstate;

class ProductstatesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Productstate::create([
            'id' => 1,
            'name' => 'Nuovo',
            'description' => 'Prodotto nuovo',
        ]);

        Productstate::create([
            'id' => 2,
            'name' => 'Usato',
            'description' => 'Prodotto usato',
        ]);

        Productstate::create([
            'id' => 3,
            'name' => 'Rotto',
            'description' => 'Prodotto rotto',
        ]);

        Productstate::create([
            'id' => 4,
            'name' => 'In riparazione',
            'description' => 'Prodotto in riparazione',
        ]);
    }

}
