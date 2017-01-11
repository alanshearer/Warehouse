<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Model;

class ModelsTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Model::create([
            'id' => 1,
            'name' => 'H261',
            'brand_id' => '2',
            'category_id' => '1',
        ]);

        Model::create([
            'id' => 2,
            'name' => 'C310',
            'brand_id' => '2',
            'category_id' => '1',
        ]);

        Model::create([
            'id' => 3,
            'name' => '326',
            'brand_id' => '2',
            'category_id' => '1',
        ]);

        Model::create([
            'id' => 4,
            'name' => 'ThinkCenter 11',
            'brand_id' => '1',
            'category_id' => '2',
        ]);

        Model::create([
            'id' => 5,
            'name' => 'ThinkCenter 12',
            'brand_id' => '1',
            'category_id' => '2',
        ]);

        Model::create([
            'id' => 6,
            'name' => 'ThinkCenter 13',
            'brand_id' => '1',
            'category_id' => '2',
        ]);
    }

}
