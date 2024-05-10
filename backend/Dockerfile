FROM python:3.9.5

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["python", "manage.py", "runsslserver", "[::]:8443"]

EXPOSE 8443