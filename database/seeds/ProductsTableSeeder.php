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
        $prod = Product::create([
                    'model_id' => '1',
                    'price' => '20.00',
                    'serial' => 'SN-1',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);

        Product::create([
            'model_id' => '1',
            'price' => '20.00',
            'serial' => 'SN-2',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);

        Product::create([
            'model_id' => '2',
            'price' => '90.00',
            'serial' => 'SN-3',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);

        Product::create([
            'model_id' => '3',
            'price' => '6.00',
            'serial' => 'SN-4',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);
        Product::create([
            'model_id' => '3',
            'price' => '6.00',
            'serial' => 'SN-5',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);
        Product::create([
            'model_id' => '3',
            'price' => '6.00',
            'serial' => 'SN-6',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);
        Product::create([
            'model_id' => '4',
            'price' => '12.00',
            'serial' => 'SN-7',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);
        Product::create([
            'model_id' => '4',
            'price' => '12.00',
            'serial' => 'SN-8',
        ]);
        $prod->workingstates()->attach(1, array('date' => date("Y-m-d H:i:s")));
        $prod->offices()->attach(1);
    }

}
