<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Product;

class ProductsTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Product::create([
            'model_id' => '1',
            'price' => '20.00',
            'serial' => 'SN-1',
        ]);

        Product::create([
            'model_id' => '1',
            'price' => '20.00',
            'serial' => 'SN-2',
        ]);
        Product::create([
            'model_id' => '2',
            'price' => '90.00',
            'serial' => 'SN-3',
        ]);

        Product::create([
            'model_id' => '3',
            'price' => '6.00',
            'serial' => 'SN-4',
        ]);
        Product::create([
            'model_id' => '3',
            'price' => '6.00',
            'serial' => 'SN-5',
        ]);

        Product::create([
            'model_id' => '3',
            'price' => '6.00',
            'serial' => 'SN-6',
        ]);
        Product::create([
            'model_id' => '4',
            'price' => '12.00',
            'serial' => 'SN-7',
        ]);

        Product::create([
            'model_id' => '4',
            'price' => '12.00',
            'serial' => 'SN-8',
        ]);
    }

}
