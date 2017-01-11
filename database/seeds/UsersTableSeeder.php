<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        User::create([
            'firstname' => 'amministratore',
            'lastname' => 'fiber',
            'birthDate' => '1999-12-12',
            'username' => 'amministratore',
            'email' => 'amministratore@fiber.it',
            'role_id' => '1',
            'password' => Hash::make('password')
        ]);
        User::create([
            'firstname' => 'responsabile magazzino',
            'lastname' => 'fiber',
            'birthDate' => '1999-12-12',
            'username' => 'respmagazzino',
            'email' => 'respmagazzino@fiber.it',
            'role_id' => '2',
            'password' => Hash::make('password')
        ]);
        User::create([
            'firstname' => 'controllore',
            'lastname' => 'fiber',
            'birthDate' => '1999-12-12',
            'username' => 'controllore',
            'email' => 'controllore@fiber.it',
            'role_id' => '3',
            'password' => Hash::make('password')
        ]);
        User::create([
            'firstname' => 'responsabile assistenza',
            'lastname' => 'fiber',
            'birthDate' => '1999-12-12',
            'username' => 'respassistenza',
            'email' => 'respassistenza@fiber.it',
            'role_id' => '4',
            'password' => Hash::make('password')
        ]);
    }

}
