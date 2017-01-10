<?php

use Illuminate\Database\Seeder;
use App\Models\Entities\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'firstname' => 'nome',
            'lastname' => 'cognome',
            'birthDate' => '1999-12-12',
            'username' => 'utenteprova',
            'email'  => 'utente@utente.it',
            'role_id'  => '1',
            'password'  => Hash::make('password')
        ]);
    }
}
