<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Note: deliberately NOT using WithoutModelEvents here — Order relies on
     * model events (creating/created) to compute totals, order numbers, and
     * the initial status history entry.
     */
    public function run(): void
    {
        // Login for /admin — change this password after first login.
        User::firstOrCreate(
            ['email' => 'hello.webflick@gmail.com'],
            ['name' => 'Admin', 'password' => Hash::make('password')]
        );

        $this->call(DemoDataSeeder::class);
    }
}
