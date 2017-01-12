<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Shippingstate;

class ShippingstatesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Shippingstate::create([
            'id' => 1,
            'name' => 'In corso',
            'description' => 'Spedizione in corso',
        ]);

        Shippingstate::create([
            'id' => 2,
            'name' => 'Confermata',
            'description' => 'Spedizione confermata',
        ]);

        Shippingstate::create([
            'id' => 3,
            'name' => 'Rifiutata',
            'description' => 'Spedizione rigettata',
        ]);
    }

}
