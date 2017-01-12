<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $this->call(CitiesTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(OfficetypesTableSeeder::class);
        $this->call(ProductstatesTableSeeder::class);
        $this->call(ProductworkingstatesTableSeeder::class);
        $this->call(OfficesTableSeeder::class);
        $this->call(BrandsTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        $this->call(ModelsTableSeeder::class);
        $this->call(ProductsTableSeeder::class);      
        $this->call(ShippingstatesTableSeeder::class);
    }

}
