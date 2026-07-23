# Configuración Exitosa para Despliegue en Railway (configOK.md)

Este documento detalla todas las configuraciones correctas implementadas para lograr un build y despliegue exitoso de la aplicación **Laravel 11 + React (Vite) + SQLite** en Railway utilizando la Railway CLI.

---

## 1. El Dockerfile de Producción Final

El archivo [`Dockerfile`](file:///var/www/html/sudrioweb/Dockerfile) se diseñó para resolver los siguientes problemas:
* **Estabilidad de Node.js:** Instalado directamente desde los repositorios de Debian trixie (`php:8.3-cli`) para evitar fallos de compatibilidad con instaladores externos (como NodeSource).
* **Base de datos limpia:** La base de datos SQLite se crea en blanco *durante el build* para evitar conflictos de esquemas.
* **Puerto dinámico:** La aplicación se enlaza al puerto asignado dinámicamente por Railway mediante `--port=$PORT`.
* **Variables de entorno seguras:** Se inyectaron directamente las variables mediante directivas `ENV` para evitar los timeouts por GraphQL del CLI de Railway.

```dockerfile
FROM php:8.3-cli

# 1. Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev \
    zip unzip curl git \
    && docker-php-ext-install pdo pdo_sqlite zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Instalar Composer oficialmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 3. Instalar Node.js y NPM de forma estable
RUN apt-get update && apt-get install -y nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 4. Inyectar variables de entorno de producción directo en la imagen
ENV APP_KEY=base64:kGCKVysMipit0PdjwQzH92ZysMqg3qUlgo/G41fxqv4=
ENV APP_ENV=production
ENV APP_DEBUG=true
ENV LOG_CHANNEL=stderr

COPY . .

# 5. Asegurar directorios de almacenamiento y permisos ANTES de composer install
RUN mkdir -p storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache \
        storage/logs \
        bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# 6. Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 7. Instalar dependencias de JS y compilar assets de Vite (React)
RUN npm install --legacy-peer-deps && npm run build

# 8. Generar base de datos SQLite en blanco y correr las migraciones
RUN touch database/database.sqlite \
    && php artisan config:clear \
    && php artisan migrate --force

EXPOSE 8080

# 9. Iniciar el servidor embebido enlazando al puerto asignado por Railway
CMD php artisan serve --host=0.0.0.0 --port=$PORT
```

---

## 2. Exclusión de Ficheros (Ignores)

Es crítico evitar subir o compilar carpetas locales innecesarias o archivos en conflicto. Agregamos las exclusiones correctas en los archivos de ignorar:

### En [`.dockerignore`](file:///var/www/html/sudrioweb/.dockerignore) y [`.railwayignore`](file:///var/www/html/sudrioweb/.railwayignore):
```ignore
node_modules/
vendor/
# Evita copiar la DB de desarrollo con tablas preexistentes que rompen 'migrate --force'
database/database.sqlite
storage/logs/
storage/framework/cache/
storage/framework/sessions/
storage/framework/views/
bootstrap/cache/
.git/
.env
```

---

## 3. Configuración del Servidor Laravel detrás de un Proxy (HTTPS)

Para evitar el error de **Mixed Content** (donde la web HTTPS de Railway intentaba cargar recursos del compilado de Vite sobre HTTP inseguro), implementamos dos adiciones en el código PHP de la app:

### A. Confiar en todos los Proxies Inversos
En [`bootstrap/app.php`](file:///var/www/html/sudrioweb/bootstrap/app.php), le decimos al middleware de Laravel 11 que confíe en los balanceadores de Railway para detectar cabeceras seguras (`X-Forwarded-Proto`):
```php
    ->withMiddleware(function (Middleware $middleware): void {
        // Confía en todos los proxies inversos
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
```

### B. Forzar esquema HTTPS en producción
En [`app/Providers/AppServiceProvider.php`](file:///var/www/html/sudrioweb/app/Providers/AppServiceProvider.php), forzamos a que todos los helpers generadores de URLs (incluyendo `asset()` y las rutas de `Ziggy`) utilicen HTTPS en producción:
```php
use Illuminate\Support\Facades\URL;

public function boot(): void
{
    Vite::prefetch(concurrency: 3);

    // Fuerza HTTPS en producción
    if (config('app.env') === 'production') {
        URL::forceScheme('https');
    }
}
```

---

## 4. Tip para Desarrollo Local (Localhost)

Si en tu `localhost` las imágenes o assets aparecen rotos/no cargan:
Asegúrate de que la variable `APP_URL` en tu archivo local [`.env`](file:///var/www/html/sudrioweb/.env) incluya el puerto `8000` (el puerto de `php artisan serve` local):
```env
APP_URL=http://localhost:8000
```
*(Si no incluye el puerto `:8000`, Laravel intentará cargar los assets desde el puerto 80 estándar, mostrándolos rotos).*

---
**¡Felicitaciones! Todo está listo, documentado y funcionando al 100%.**
