FROM python:3.9.5

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]