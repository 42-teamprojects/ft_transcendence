#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Installing dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start celery worker
# echo "Starting celery worker..."
# celery -A backend worker --loglevel=info > celery.log 2>&1 &

exec "$@"
