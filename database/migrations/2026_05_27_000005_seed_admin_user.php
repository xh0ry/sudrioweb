<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Setting;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Seed the admin user
        User::updateOrCreate(
            ['email' => 'admin@sudrio.com'],
            [
                'name' => 'admin',
                'password' => Hash::make('admin9256'),
                'email_verified_at' => now(),
            ]
        );

        // Seed settings
        Setting::updateOrCreate(['key' => 'contact_phones'], ['value' => json_encode(['0263 444-2711', '0800-222-1234'])]);
        Setting::updateOrCreate(['key' => 'contact_emails'], ['value' => json_encode(['info@sudrio.com.ar'])]);
        Setting::updateOrCreate(['key' => 'address'], ['value' => 'San Isidro Sur 514, Rivadavia, Mendoza']);
        Setting::updateOrCreate(['key' => 'forced_weather_alert'], ['value' => 'none']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::where('email', 'admin@sudrio.com')->delete();
    }
};
