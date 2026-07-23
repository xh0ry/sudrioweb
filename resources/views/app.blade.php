<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="La Sud Río es la distribuidora de energía eléctrica en zona rural suroeste de Rivadavia, Mendoza. Cooperativa de Electrificación Rural.">
        <meta property="og:title" content="Sud Río — Cooperativa de Electrificación Rural">
        <meta property="og:description" content="La Sud Río es la distribuidora de energía eléctrica en zona rural suroeste de Rivadavia, Mendoza.">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_AR">

        <title inertia>{{ config('app.name', 'Sud Río') }}</title>

        <!-- Favicon -->
        <link rel="icon" href="/favicon.png" type="image/png">

        <!-- Inline theme script to prevent FOUC -->
        <script>
            if (localStorage.theme === 'dark' || (!('theme' in localStorage))) {
                document.documentElement.classList.add('dark');
            } else if (localStorage.theme === 'light') {
                document.documentElement.classList.remove('dark');
            }
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
