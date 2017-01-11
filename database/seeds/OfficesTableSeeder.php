<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Office;

class OfficesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Office::create([
            'id' => 1,
            'name' => 'Magazzino Default',
            'address' => 'indirizzo magazzino default',
            'officetype_id' => '2',
            'city_id' => '13070',
            'postalcode' => '80100',
        ]);

        Office::create([
                        'id' => 2,
            'name' => 'Magazzino Fiber1',
            'address' => 'indirizzo magazzino Fiber 1',
            'officetype_id' => '2',
            'city_id' => '17139',
            'postalcode' => '00000',
        ]);

        Office::create([
            'name' => 'Ufficio Fiber1',
            'address' => 'indirizzo ufficio Fiber 1',
            'officetype_id' => '1',
            'city_id' => '17139',
            'postalcode' => '00000',
            'parent_id' => 1,
        ]);
    }

}
