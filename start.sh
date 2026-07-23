#!/bin/sh
set -e

export PORT="${PORT:-8080}"
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

touch /app/database/database.sqlite
chmod -R 777 /app/storage /app/bootstrap/cache /app/database

# Migraciones y auto-restauracion del respaldo al iniciar el servidor
php artisan migrate --force
php artisan backup:restore

php-fpm -D
exec nginx -g "daemon off;"
