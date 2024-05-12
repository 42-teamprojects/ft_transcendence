import random
from django.conf import settings
from django.core.mail import EmailMessage

from .models import OneTimePassword, User

def generate_otp():
    return random.randint(100000, 999999)

def send_otp_email(email):
    subject = 'OTP for Email Verification'
    otp = generate_otp()
    print(otp)
    user = User.objects.get(email=email)
    body = f'Your OTP is {otp}'
    from_email = settings.DEFAULT_FROM_EMAIL

    OneTimePassword.objects.create(user=user, otp=otp)
    
    to_email = EmailMessage(subject, body, from_email, [email])
    try:
        to_email.send()
    except:
        print('Email not sent')