<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Enforce expiration check for weather alert
        \App\Models\Setting::getForcedAlert();

        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
        
        // Normalize phones to array of objects { label, value, is_24h }
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
            // First phone's label must always be Guardia 24hs and is_24h must be true
            $normalizedPhones[0]['label'] = 'Guardia 24hs';
            $normalizedPhones[0]['is_24h'] = true;
        }

        // Normalize emails to array of objects { label, value }
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
        }

        $methods = isset($settings['payment_methods']) ? json_decode($settings['payment_methods'], true) : [];
        if (empty($methods) || !is_array($methods)) {
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
        }

        $globalSettingsData = [
            'phones' => $normalizedPhones,
            'emails' => $normalizedEmails,
            'address' => $settings['address'] ?? 'Lavalle 641, 5577 Rivadavia, Mendoza',
            'payment_methods' => $methods,
            'services_links' => $links,
        ];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'globalSettings' => $globalSettingsData,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ]
        ];
    }
}
