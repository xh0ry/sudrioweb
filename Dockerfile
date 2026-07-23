FROM php:8.3-fpm

# Instalar dependencias del sistema y nginx
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev \
    zip unzip curl git nginx gettext-base \
    && docker-php-ext-install pdo pdo_sqlite zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalar Node.js y NPM
RUN apt-get update && apt-get install -y nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV APP_KEY=base64:kGCKVysMipit0PdjwQzH92ZysMqg3qUlgo/G41fxqv4=
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

COPY . .

# Crear directorios y permisos
RUN mkdir -p storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache \
        storage/logs \
        bootstrap/cache \
        database \
    && chmod -R 777 storage bootstrap/cache database

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Instalar dependencias JS y compilar
RUN npm install --legacy-peer-deps && npm run build

# Base de datos y migraciones
RUN touch database/database.sqlite \
    && chmod 777 database/database.sqlite \
    && php artisan config:clear \
    && php artisan storage:link \
    && php artisan migrate --force

COPY nginx.template /etc/nginx/conf.d/default.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
