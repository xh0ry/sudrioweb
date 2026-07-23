<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        // Enforce expiration check
        Setting::getForcedAlert();

        $settings = Setting::pluck('value', 'key')->toArray();
        
        // Decode and normalize JSON arrays for frontend edit form
        $phones = isset($settings['contact_phones']) ? json_decode($settings['contact_phones'], true) : [];
        $normalizedPhones = [];
        if (is_array($phones)) {
            foreach ($phones as $idx => $phone) {
                if (is_array($phone)) {
                    $normalizedPhones[] = [
                        'label' => $phone['label'] ?? ($idx === 0 ? 'Guardia 24hs' : 'Atención Comercial'),
                        'value' => $phone['value'] ?? '',
                        'is_24h' => isset($phone['is_24h']) ? (bool)$phone['is_24h'] : ($idx === 0 ? true : false),
                    ];
                } elseif (is_string($phone) || is_numeric($phone)) {
                    $normalizedPhones[] = [
                        'label' => $idx === 0 ? 'Guardia 24hs' : 'Atención Comercial',
                        'value' => (string)$phone,
                        'is_24h' => $idx === 0 ? true : false,
                    ];
                }
            }
        }
        if (empty($normalizedPhones)) {
            $normalizedPhones[] = ['label' => 'Guardia 24hs', 'value' => '(263) 154356728', 'is_24h' => true];
        } else {
            $normalizedPhones[0]['label'] = 'Guardia 24hs';
            $normalizedPhones[0]['is_24h'] = true;
        }

        $emails = isset($settings['contact_emails']) ? json_decode($settings['contact_emails'], true) : [];
        $normalizedEmails = [];
        if (is_array($emails)) {
            foreach ($emails as $idx => $email) {
                if (is_array($email)) {
                    $normalizedEmails[] = [
                        'label' => $email['label'] ?? 'General',
                        'value' => $email['value'] ?? '',
                    ];
                } elseif (is_string($email)) {
                    $normalizedEmails[] = [
                        'label' => $idx === 0 ? 'Reclamos y Sugerencias' : ($idx === 1 ? 'Cobranzas' : 'Curriculum Vitae'),
                        'value' => $email,
                    ];
                }
            }
        }
        if (empty($normalizedEmails)) {
            $normalizedEmails[] = ['label' => 'Reclamos y Sugerencias', 'value' => 'cooperativa@sudrio.com'];
            $normalizedEmails[] = ['label' => 'Cobranzas', 'value' => 'cobranzas@sudrio.com'];
            $normalizedEmails[] = ['label' => 'Enviar CV', 'value' => 'cvsudrio@gmail.com'];
        }

        $settings['contact_phones'] = $normalizedPhones;
        $settings['contact_emails'] = $normalizedEmails;
        $settings['address'] = $settings['address'] ?? 'Lavalle 641, 5577 Rivadavia, Mendoza';



        return Inertia::render('Admin/Settings/Index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'contact_phones' => 'nullable|array',
            'contact_phones.*.label' => 'required|string|max:255',
            'contact_phones.*.value' => 'required|string|max:255',
            'contact_phones.*.is_24h' => 'nullable|boolean',
            'contact_emails' => 'nullable|array',
            'contact_emails.*.label' => 'required|string|max:255',
            'contact_emails.*.value' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'forced_weather_alert' => 'nullable|string|in:none,viento,tormenta,zonda',

        ]);

        // Enforce Guardia 24hs for the first phone label
        if (isset($validated['contact_phones']) && count($validated['contact_phones']) > 0) {
            $validated['contact_phones'][0]['label'] = 'Guardia 24hs';
            $validated['contact_phones'][0]['is_24h'] = true;
        }

        // Handle expiration calculation if forcing weather alert
        if (isset($validated['forced_weather_alert'])) {
            if ($validated['forced_weather_alert'] !== 'none') {
                Setting::updateOrCreate(['key' => 'forced_weather_alert_expires_at'], ['value' => now()->addHours(24)->toIso8601String()]);
            } else {
                Setting::updateOrCreate(['key' => 'forced_weather_alert_expires_at'], ['value' => null]);
            }
        }

        foreach ($validated as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return redirect()->back()->with('success', 'Configuración actualizada exitosamente.');
    }
}
