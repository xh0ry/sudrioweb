#!/bin/sh
set -e

export PORT="${PORT:-8080}"
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

touch /app/database/database.sqlite
chmod -R 777 /app/storage /app/bootstrap/cache /app/database

php-fpm -D
exec nginx -g "daemon off;"
