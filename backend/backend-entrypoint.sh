#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Debugging: Print environment variables
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# # Debugging: Print installed apps
# echo "Installed apps:"
# python -c "import django; django.setup(); from django.conf import settings; print(settings.INSTALLED_APPS)"

# # Start Daphne with SSL
# echo "Starting Daphne server..."
# daphne -e ssl:443:privateKey=/app/certs/yelaissa.key:certKey=/app/certs/yelaissa.crt backend.asgi:application

exec "$@"
