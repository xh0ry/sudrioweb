<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ServiceLinkController;

Route::get('/', function () {
    $news = \App\Models\News::latest()->take(5)->get();
    return Inertia::render('Welcome', ['latestNews' => $news]);
})->name('home');

Route::get('/api/weather-alert', [App\Http\Controllers\WeatherAlertController::class, 'getAlert'])->name('weather.alert');

Route::get('/cooperativa', function () {
    return Inertia::render('Cooperativa');
})->name('cooperativa');

Route::get('/servicios', function () {
    return Inertia::render('Servicios');
})->name('servicios');

Route::get('/contacto', function () {
    return Inertia::render('Contacto');
})->name('contacto');

Route::get('/conexion-nueva', function () {
    return Inertia::render('ConexionNueva');
})->name('conexion-nueva');

Route::get('/medidores-inteligentes', function () {
    return Inertia::render('MedidoresInteligentes');
})->name('medidores-inteligentes');

Route::get('/tarifa-social', function () {
    return Inertia::render('TarifaSocial');
})->name('tarifa-social');

Route::get('/medios-de-pago', function () {
    return Inertia::render('MediosDePago');
})->name('medios-de-pago');

// Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        $stats = [
            'news_count' => \App\Models\News::count(),
            'contacts_count' => count(json_decode(\App\Models\Setting::where('key', 'contact_phones')->value('value') ?? '[]', true) ?: []) + count(json_decode(\App\Models\Setting::where('key', 'contact_emails')->value('value') ?? '[]', true) ?: []),
            'weather_alert' => \App\Models\Setting::getForcedAlert(),
            'weather_alert_expires_at' => \App\Models\Setting::where('key', 'forced_weather_alert_expires_at')->value('value'),
        ];
        return Inertia::render('Admin/Dashboard', ['stats' => $stats]);
    })->name('dashboard');

    Route::resource('news', NewsController::class)->except(['show']);
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::get('backup/export', [App\Http\Controllers\Admin\BackupController::class, 'export'])->name('backup.export');
    Route::post('backup/import', [App\Http\Controllers\Admin\BackupController::class, 'import'])->name('backup.import');
    Route::get('payments', [PaymentMethodController::class, 'index'])->name('payments.index');
    Route::post('payments', [PaymentMethodController::class, 'store'])->name('payments.store');
    Route::post('payments/{id}', [PaymentMethodController::class, 'update'])->name('payments.update');
    Route::delete('payments/{id}', [PaymentMethodController::class, 'destroy'])->name('payments.destroy');

    Route::get('services-links', [ServiceLinkController::class, 'index'])->name('services-links.index');
    Route::post('services-links', [ServiceLinkController::class, 'store'])->name('services-links.store');
    Route::post('services-links/{id}', [ServiceLinkController::class, 'update'])->name('services-links.update');
    Route::delete('services-links/{id}', [ServiceLinkController::class, 'destroy'])->name('services-links.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
