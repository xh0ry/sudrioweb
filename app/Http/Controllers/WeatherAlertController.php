<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherAlertController extends Controller
{
    public function getAlert()
    {
        // First check if there is a forced alert set in the admin panel
        $forcedAlert = \App\Models\Setting::getForcedAlert();
        
        if ($forcedAlert && $forcedAlert !== 'none') {
            return response()->json($this->getForcedAlertData($forcedAlert));
        }

        // Cache the weather data for 30 minutes to avoid hitting the API rate limits
        $alertData = Cache::remember('weather_alert_data', 1800, function () {
            // Rivadavia, Mendoza coordinates
            $lat = -33.190;
            $lon = -68.460;
            
            try {
                // Fetch current and hourly data from Open-Meteo
                $response = Http::timeout(15)->get("https://api.open-meteo.com/v1/forecast", [
                    'latitude' => $lat,
                    'longitude' => $lon,
                    'current' => 'wind_speed_10m,precipitation',
                    'hourly' => 'wind_speed_10m,precipitation,cape,temperature_2m,relative_humidity_2m',
                    'timezone' => 'auto',
                    'forecast_days' => 2,
                ]);

                if (!$response->successful()) {
                    return ['active' => false];
                }

                $data = $response->json();
                
                // Evaluate conditions in the next 12 hours
                $maxWind = 0;
                $maxPrecip = 0;
                $maxCape = 0;
                $isZonda = false;
                
                if (isset($data['hourly'])) {
                    $hourly = $data['hourly'];
                    // We check the first 12 hours
                    for ($i = 0; $i < 12; $i++) {
                        $wind = $hourly['wind_speed_10m'][$i] ?? 0;
                        $precip = $hourly['precipitation'][$i] ?? 0;
                        $cape = $hourly['cape'][$i] ?? 0;
                        $temp = $hourly['temperature_2m'][$i] ?? 0;
                        $humidity = $hourly['relative_humidity_2m'][$i] ?? 100;

                        if ($wind > $maxWind) $maxWind = $wind;
                        if ($precip > $maxPrecip) $maxPrecip = $precip;
                        if ($cape > $maxCape) $maxCape = $cape;

                        // Zonda conditions: wind > 35km/h, temp > 25C, humidity < 40%
                        if ($wind > 35 && $temp > 25 && $humidity < 40) {
                            $isZonda = true;
                        }
                    }
                }

                $alert = [
                    'active' => false,
                    'type' => null,
                    'severity' => null,
                    'zone' => 'Zona Este, Mendoza',
                    'message' => null,
                    'recommendations' => []
                ];

                // Detect severe conditions based on thresholds
                if ($isZonda) {
                    $alert['active'] = true;
                    $alert['type'] = 'zonda';
                    $alert['severity'] = 'orange';
                    $alert['message'] = 'Alerta por Viento Zonda. Se esperan ráfagas fuertes, alta temperatura y extrema sequedad en el ambiente.';
                    $alert['recommendations'] = [
                        'Mantené extrema precaución con cables caídos o postes inclinados; informá de inmediato a nuestra guardia.',
                        'Desconectá electrodomésticos y equipos electrónicos sensibles ante posibles oscilaciones de tensión.',
                        'En caso de corte de luz, tené siempre a mano linternas con pilas cargadas. Evitá usar velas.',
                        'Cerrá y asegurá puertas y ventanas. Sellá filtraciones con trapos húmedos.',
                        'Mantenete hidratado y evitá esfuerzos físicos al aire libre.',
                        'Bajo ninguna circunstancia enciendas fuego al aire libre.'
                    ];
                } elseif ($maxWind > 45) {
                    $alert['active'] = true;
                    $alert['type'] = 'viento';
                    $alert['severity'] = 'yellow';
                    $alert['message'] = 'Posibles vientos fuertes en la región. Asegurá elementos que puedan volarse y mantené distancia de postes y cables.';
                    $alert['recommendations'] = [
                        'Mantené una distancia segura de postes inclinados y cables eléctricos caídos; nunca intentes tocarlos.',
                        'Desconectá equipos sensibles para protegerlos contra sobretensiones y variaciones del suministro.',
                        'En caso de cortes de suministro, utilizá linternas a batería en lugar de velas para prevenir incendios.',
                        'Asegurá los objetos que puedan ser arrojados por el viento.',
                        'Mantenete alejado de los árboles, ya que la fuerza del viento podría quebrar alguna de sus ramas.',
                        'No estaciones tu vehículo bajo los árboles.',
                        'Mantené cerrada tu casa de la manera más hermética posible.'
                    ];
                } elseif ($maxCape > 1000 || $maxPrecip > 15) { // CAPE > 1000 indicates thunderstorms, precip > 15mm/h is heavy
                    $alert['active'] = true;
                    $alert['type'] = 'tormenta';
                    $alert['severity'] = 'yellow';
                    $alert['message'] = 'Posibles tormentas intensas en la zona. Evitá salir si no es necesario y desconectá artefactos eléctricos.';
                    $alert['recommendations'] = [
                        'Desconectá inmediatamente computadoras, televisores y electrodomésticos ante actividad eléctrica frecuente.',
                        'Evitá tomar contacto con artefactos eléctricos conectados, canillas o tuberías metálicas durante la tormenta.',
                        'Mantené distancia de postes de luz, transformadores y cables de media/alta tensión.',
                        'Tené linternas con baterías listas para usar y agendá nuestro número de guardia 24hs.',
                        'No saques la basura. Retirá objetos que impidan que el agua escurra.',
                        'Evitá actividades al aire libre y no te refugies cerca de árboles o postes que puedan caerse.'
                    ];
                }

                return $alert;

            } catch (\Exception $e) {
                return ['active' => false];
            }
        });

        return response()->json($alertData);
    }

    private function getForcedAlertData($type)
    {
        $alert = [
            'active' => true,
            'type' => $type,
            'severity' => 'yellow',
            'zone' => 'Zona Este, Mendoza',
            'message' => 'Esta es una alerta generada manualmente desde el panel de control para realizar pruebas.',
            'recommendations' => []
        ];

        if ($type === 'zonda') {
            $alert['severity'] = 'orange';
            $alert['message'] = 'Alerta por Viento Zonda. Se esperan ráfagas fuertes, alta temperatura y extrema sequedad en el ambiente.';
            $alert['recommendations'] = [
                'Mantené extrema precaución con cables caídos o postes inclinados; informá de inmediato a nuestra guardia.',
                'Desconectá electrodomésticos y equipos electrónicos sensibles ante posibles oscilaciones de tensión.',
                'En caso de corte de luz, tené siempre a mano linternas con pilas cargadas. Evitá usar velas.',
                'Cerrá y asegurá puertas y ventanas. Sellá filtraciones con trapos húmedos.',
                'Mantenete hidratado y evitá esfuerzos físicos al aire libre.',
                'Bajo ninguna circunstancia enciendas fuego al aire libre.'
            ];
        } elseif ($type === 'viento') {
            $alert['message'] = 'Posibles vientos fuertes en la región. Asegurá elementos que puedan volarse y mantené distancia de postes y cables.';
            $alert['recommendations'] = [
                'Mantené una distancia segura de postes inclinados y cables eléctricos caídos; nunca intentes tocarlos.',
                'Desconectá equipos sensibles para protegerlos contra sobretensiones y variaciones del suministro.',
                'En caso de cortes de suministro, utilizá linternas a batería en lugar de velas para prevenir incendios.',
                'Asegurá los objetos que puedan ser arrojados por el viento.',
                'Mantenete alejado de los árboles, ya que la fuerza del viento podría quebrar alguna de sus ramas.',
                'No estaciones tu vehículo bajo los árboles.',
                'Mantené cerrada tu casa de la manera más hermética posible.'
            ];
        } elseif ($type === 'tormenta') {
            $alert['message'] = 'Posibles tormentas intensas en la zona. Evitá salir si no es necesario y desconectá artefactos eléctricos.';
            $alert['recommendations'] = [
                'Desconectá inmediatamente computadoras, televisores y electrodomésticos ante actividad eléctrica frecuente.',
                'Evitá tomar contacto con artefactos eléctricos conectados, canillas o tuberías metálicas durante la tormenta.',
                'Mantené distancia de postes de luz, transformadores y cables de media/alta tensión.',
                'Tené linternas con baterías listas para usar y agendá nuestro número de guardia 24hs.',
                'No saques la basura. Retirá objetos que impidan que el agua escurra.',
                'Evitá actividades al aire libre y no te refugies cerca de árboles o postes que puedan caerse.'
            ];
        }

        return $alert;
    }
}
