<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceLinkController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $links = isset($settings['services_links']) ? json_decode($settings['services_links'], true) : [];

        if (empty($links) || !is_array($links)) {
            $links = [
                [
                    'id' => 1,
                    'title' => 'Factura Online',
                    'desc' => 'Descargá y consultá el estado de tus facturas.',
                    'href' => 'https://net.optimasa.com.ar/factura_online_sudrio/',
                    'icon' => 'default:invoice'
                ],
                [
                    'id' => 2,
                    'title' => 'Reglamento de Suministro',
                    'desc' => 'Documentación oficial del EPRE.',
                    'href' => 'https://epremendoza.gob.ar/reglamento-de-suministro/',
                    'icon' => 'default:rules'
                ],
                [
                    'id' => 3,
                    'title' => 'Cuadro Tarifario Vigente',
                    'desc' => 'Descargar resolución vigente en PDF.',
                    'href' => 'https://epremendoza.gob.ar/2019/informesT/cuadrosT-Vigentes/CT%20Res%20258-2024.pdf',
                    'icon' => 'default:calculator'
                ],
                [
                    'id' => 4,
                    'title' => 'Régimen Tarifario',
                    'desc' => 'Anexos y resoluciones sobre tarifas.',
                    'href' => 'https://epremendoza.gob.ar/2019/resoluciones-anexos/Regimen_Tarifario.pdf',
                    'icon' => 'default:scale'
                ],
                [
                    'id' => 5,
                    'title' => 'Normas de Calidad',
                    'desc' => 'Sanciones y calidad del servicio eléctrico.',
                    'href' => 'https://epremendoza.gob.ar/2019/Calidad/Normas_de_Calidad_del_Servicio_Electrico_y_Sanciones.pdf',
                    'icon' => 'default:warning'
                ]
            ];
            Setting::updateOrCreate(['key' => 'services_links'], ['value' => json_encode($links)]);
        }

        return Inertia::render('Admin/ServicesLinks', ['servicesLinks' => $links]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string|max:255',
            'href' => 'required|string|max:1000',
            'icon' => 'required|image|mimes:png,jpg,jpeg,svg|max:2048'
        ]);

        $url = null;
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('services_links', 'public');
            $url = '/storage/' . $path;
        }

        $settings = Setting::pluck('value', 'key')->toArray();
        $links = isset($settings['services_links']) ? json_decode($settings['services_links'], true) : [];
        if (!is_array($links)) {
            $links = [];
        }

        $newId = count($links) > 0 ? max(array_column($links, 'id')) + 1 : 1;

        $links[] = [
            'id' => $newId,
            'title' => $request->title,
            'desc' => $request->desc,
            'href' => $request->href,
            'icon' => $url
        ];

        Setting::updateOrCreate(['key' => 'services_links'], ['value' => json_encode($links)]);

        return redirect()->back()->with('success', 'Enlace de servicio añadido exitosamente.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string|max:255',
            'href' => 'required|string|max:1000',
            'icon' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048'
        ]);

        $settings = Setting::pluck('value', 'key')->toArray();
        $links = isset($settings['services_links']) ? json_decode($settings['services_links'], true) : [];
        if (!is_array($links)) {
            $links = [];
        }

        $updated = false;
        foreach ($links as &$link) {
            if ($link['id'] == $id) {
                $link['title'] = $request->title;
                $link['desc'] = $request->desc;
                $link['href'] = $request->href;

                if ($request->hasFile('icon')) {
                    if (isset($link['icon']) && str_starts_with($link['icon'], '/storage/')) {
                        $relativePath = str_replace('/storage/', '', $link['icon']);
                        Storage::disk('public')->delete($relativePath);
                    }
                    $path = $request->file('icon')->store('services_links', 'public');
                    $link['icon'] = '/storage/' . $path;
                }
                $updated = true;
                break;
            }
        }

        if ($updated) {
            Setting::updateOrCreate(['key' => 'services_links'], ['value' => json_encode($links)]);
            return redirect()->back()->with('success', 'Enlace de servicio actualizado exitosamente.');
        }

        return redirect()->back()->with('error', 'No se encontró el enlace de servicio.');
    }

    public function destroy($id)
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $links = isset($settings['services_links']) ? json_decode($settings['services_links'], true) : [];
        if (!is_array($links)) {
            $links = [];
        }

        $filtered = [];
        foreach ($links as $link) {
            if ($link['id'] == $id) {
                if (isset($link['icon']) && str_starts_with($link['icon'], '/storage/')) {
                    $relativePath = str_replace('/storage/', '', $link['icon']);
                    Storage::disk('public')->delete($relativePath);
                }
            } else {
                $filtered[] = $link;
            }
        }

        Setting::updateOrCreate(['key' => 'services_links'], ['value' => json_encode($filtered)]);

        return redirect()->back()->with('success', 'Enlace de servicio eliminado exitosamente.');
    }
}
