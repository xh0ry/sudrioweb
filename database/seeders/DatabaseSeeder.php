<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@sudrio.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin9256'),
        ]);

        \App\Models\Setting::create(['key' => 'contact_phones', 'value' => json_encode(['0263 444-2711', '0800-222-1234'])]);
        \App\Models\Setting::create(['key' => 'contact_emails', 'value' => json_encode(['info@sudrio.com.ar'])]);
        \App\Models\Setting::create(['key' => 'address', 'value' => 'San Isidro Sur 514, Rivadavia, Mendoza']);
        \App\Models\Setting::create(['key' => 'forced_weather_alert', 'value' => 'none']);
    }
}
