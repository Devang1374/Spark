#!/bin/sh
set -e

# Dynamically set Nginx port if PORT environment variable is provided by Render
PORT="${PORT:-80}"
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/sites-available/default
sed -i "s/listen \[::\]:80;/listen \[::\]:${PORT};/g" /etc/nginx/sites-available/default

# Ensure storage subdirectories and logs exist with proper permissions
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache \
         /var/www/html/database

# If using default sqlite database, ensure database.sqlite exists
if [ -z "$DB_CONNECTION" ] || [ "$DB_CONNECTION" = "sqlite" ]; then
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
    chmod 664 /var/www/html/database/database.sqlite
fi

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Check APP_KEY
if [ -z "$APP_KEY" ]; then
    echo "WARNING: APP_KEY environment variable is not set! Laravel will throw a 500 error."
    echo "Generating temporary APP_KEY..."
    php artisan key:generate --force || true
fi

# Run migrations if enabled or if using fresh database
if [ "$RUN_MIGRATIONS" = "true" ] || [ ! -s "/var/www/html/database/database.sqlite" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
fi

# Clear old cache and warm up new cache
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

if [ -n "$APP_KEY" ]; then
    echo "Caching configuration..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in foreground
echo "Starting Nginx on port ${PORT}..."
exec nginx -g "daemon off;"

