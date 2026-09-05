<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Creates (or resets the password of) the /admin login from env values —
 * ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD. Meant for hosts with no
 * interactive shell: run it once with
 *
 *   php artisan db:seed --class=AdminUserSeeder --force
 *
 * then clear ADMIN_PASSWORD from .env.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (blank($email) || blank($password)) {
            $this->command?->warn('AdminUserSeeder skipped: set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');

            return;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Admin'),
                'password' => Hash::make($password),
            ],
        );

        $this->command?->info("Admin login ready for {$user->email}. Now remove ADMIN_PASSWORD from .env.");
    }
}
