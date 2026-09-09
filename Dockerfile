# ==============================================================================
# Production PHP 8.4-FPM + Nginx Environment (Debian Bookworm)
# ==============================================================================
FROM php:8.4-fpm-bookworm

# 1. Install system utilities, PHP compilation headers, Nginx, Node.js & Composer
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    curl \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libicu-dev \
    libonig-dev \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        zip \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        opcache \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 2. Copy dependency files first for layer caching
COPY composer.json composer.lock* ./
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# 3. Install PHP dependencies and Node modules in the same runtime
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
RUN npm install

# 4. Copy full project code and generate optimized PHP autoloader
COPY . .
RUN composer dump-autoload --optimize --no-dev

# 5. Build frontend assets (or keep pre-built if already present)
RUN if [ ! -f "public/build/manifest.json" ]; then npm run build; fi

# 6. Clean up Node modules to keep image size small
RUN rm -rf node_modules

# 7. Configure Nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default \
    && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default \
    && chmod +x docker/entrypoint.sh

# 8. Set proper Laravel storage and cache permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["docker/entrypoint.sh"]
