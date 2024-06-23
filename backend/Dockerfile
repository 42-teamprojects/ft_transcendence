FROM python:3.9.5

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

# Set the DJANGO_SETTINGS_MODULE environment variable
ENV DJANGO_SETTINGS_MODULE=backend.settings

ENTRYPOINT ["./backend-entrypoint.sh"]

CMD ["daphne", "-e", "ssl:8443:privateKey=/app/certs/yelaissa.key:certKey=/app/certs/yelaissa.crt", "backend.asgi:application"]
