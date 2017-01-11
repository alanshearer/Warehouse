<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\Category;

class CategoriesTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Category::create([
            'id' => 1,
            'name' => 'Cuffie',
            'description' => '',
        ]);

        Category::create([
            'id' => 2,
            'name' => 'CPU',
            'description' => '',
        ]);
        
        Category::create([
            'id' => 3,
            'name' => 'Monitor',
            'description' => '',
        ]);

        Category::create([
            'id' => 4,
            'name' => 'Tastiera',
            'description' => '',
        ]);
        
        Category::create([
            'id' => 5,
            'name' => 'Camera',
            'description' => '',
        ]);
    }

}
