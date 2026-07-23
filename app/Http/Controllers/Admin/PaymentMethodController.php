<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $methods = isset($settings['payment_methods']) ? json_decode($settings['payment_methods'], true) : [];
        
        // Define default payment methods if none are configured yet
        if (empty($methods)) {
            $methods = [
                [
                    'id' => 1,
                    'name' => 'Efectivo',
                    'type' => 'fisico',
                    'icon' => 'default:cash'
                ],
                [
                    'id' => 2,
                    'name' => 'Tarjeta de Débito y Crédito (Visa/Mastercard)',
                    'type' => 'fisico',
                    'icon' => 'default:card'
                ],
                [
                    'id' => 3,
                    'name' => 'Transferencia Bancaria',
                    'type' => 'digital',
                    'icon' => 'default:bank'
                ],
                [
                    'id' => 4,
                    'name' => 'Mercado Pago (Transferencia o QR)',
                    'type' => 'digital',
                    'icon' => 'default:mp'
                ],
                [
                    'id' => 5,
                    'name' => 'RapiPago y PagoFácil',
                    'type' => 'digital',
                    'icon' => 'default:rapipago'
                ],
                [
                    'id' => 6,
                    'name' => 'Factura Online (Óptima)',
                    'type' => 'digital',
                    'icon' => 'default:online'
                ]
            ];
            // Save defaults
            Setting::updateOrCreate(['key' => 'payment_methods'], ['value' => json_encode($methods)]);
        }

        return Inertia::render('Admin/PaymentMethods', ['paymentMethods' => $methods]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:fisico,digital',
            'icon' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'bg_color' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000'
        ]);

        $url = 'default:bank';
        if ($request->hasFile('icon')) {
            $file = $request->file('icon');
            $mimeType = $file->getClientMimeType();
            $base64 = base64_encode(file_get_contents($file->getRealPath()));
            $url = 'data:' . $mimeType . ';base64,' . $base64;
        }

        $settings = Setting::pluck('value', 'key')->toArray();
        $methods = isset($settings['payment_methods']) ? json_decode($settings['payment_methods'], true) : [];
        if (!is_array($methods)) {
            $methods = [];
        }

        $newId = count($methods) > 0 ? max(array_column($methods, 'id')) + 1 : 1;

        $methods[] = [
            'id' => $newId,
            'name' => $request->name,
            'type' => $request->type,
            'icon' => $url,
            'bg_color' => $request->bg_color ?? '#0bc5ea',
            'description' => $request->description
        ];

        Setting::updateOrCreate(['key' => 'payment_methods'], ['value' => json_encode($methods)]);

        return redirect()->back()->with('success', 'Medio de pago añadido exitosamente.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:fisico,digital',
            'icon' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'bg_color' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000'
        ]);

        $settings = Setting::pluck('value', 'key')->toArray();
        $methods = isset($settings['payment_methods']) ? json_decode($settings['payment_methods'], true) : [];
        if (!is_array($methods)) {
            $methods = [];
        }

        $updated = false;
        foreach ($methods as &$method) {
            if ($method['id'] == $id) {
                $method['name'] = $request->name;
                $method['type'] = $request->type;
                $method['bg_color'] = $request->bg_color ?? '#0bc5ea';
                $method['description'] = $request->description;

                if ($request->hasFile('icon')) {
                    // Delete old file if custom
                    if (isset($method['icon']) && str_starts_with($method['icon'], '/storage/')) {
                        $relativePath = str_replace('/storage/', '', $method['icon']);
                        Storage::disk('public')->delete($relativePath);
                    }
                    
                    $file = $request->file('icon');
                    $mimeType = $file->getClientMimeType();
                    $base64 = base64_encode(file_get_contents($file->getRealPath()));
                    $method['icon'] = 'data:' . $mimeType . ';base64,' . $base64;
                }
                $updated = true;
                break;
            }
        }

        if ($updated) {
            Setting::updateOrCreate(['key' => 'payment_methods'], ['value' => json_encode($methods)]);
            return redirect()->back()->with('success', 'Medio de pago actualizado exitosamente.');
        }

        return redirect()->back()->with('error', 'No se encontró el medio de pago.');
    }

    public function destroy($id)
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $methods = isset($settings['payment_methods']) ? json_decode($settings['payment_methods'], true) : [];
        if (!is_array($methods)) {
            $methods = [];
        }

        $filtered = [];
        foreach ($methods as $method) {
            if ($method['id'] == $id) {
                // Delete file from disk if it's an uploaded image
                if (isset($method['icon']) && str_starts_with($method['icon'], '/storage/')) {
                    $relativePath = str_replace('/storage/', '', $method['icon']);
                    Storage::disk('public')->delete($relativePath);
                }
            } else {
                $filtered[] = $method;
            }
        }

        Setting::updateOrCreate(['key' => 'payment_methods'], ['value' => json_encode($filtered)]);

        return redirect()->back()->with('success', 'Medio de pago eliminado exitosamente.');
    }
}
