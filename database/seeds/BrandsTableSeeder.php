<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Brand;

class BrandsTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Brand::create([
            'id' => 1,
            'name' => 'Lenovo',
            'description' => '',
        ]);

        Brand::create([
            'id' => 2,
            'name' => 'Plantronics',
            'description' => '',
        ]);
        
        Brand::create([
            'id' => 3,
            'name' => 'Dell',
            'description' => '',
        ]);

        Brand::create([
            'id' => 4,
            'name' => 'Logitech',
            'description' => '',
        ]);
    }

}
