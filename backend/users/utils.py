import datetime
from django.core.mail import send_mail
from django.conf import settings
import jwt
from users.models import OneTimePassword
import pyotp
from smtplib import SMTPException
from rest_framework.response import Response
from rest_framework import status

def generate_otp():
    otp_secret = pyotp.random_base32()
    otp = pyotp.TOTP(otp_secret)
    return otp.now()

def send_verification(user):
    otp = generate_otp()
    subject = 'One Time Password (OTP) for Email Verification'
    message = f'Hi {user.username},\n\nYour OTP for email verification is {otp}.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    # Create OneTimePassword record
    OneTimePassword.objects.create(user=user, otp=otp)

    try:
        send_mail(subject, message, email_from, recipient_list, fail_silently=False)
        return True
    except SMTPException as e:
        print(e)
        return False
    
def add_cookies(response, **kwargs):
    for key, val in kwargs.items():
        if (key == 'access'):
            key = settings.SIMPLE_JWT['AUTH_COOKIE']
        if (key == 'refresh'):
            key = settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH']
        response.set_cookie(
            key=key,
            value=val,
            expires=settings.SIMPLE_JWT['AUTH_COOKIE_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
        
    return response

def generate_2fa_token(username):
    intermediate_token = jwt.encode(
        {'username': username, 'exp': datetime.datetime.now() + datetime.timedelta(minutes=5)},
        settings.SIMPLE_JWT['SIGNING_KEY'], algorithm='HS256'
    )
    response = Response({'detail': 'Two-factor authentication is required'}, status=status.HTTP_423_LOCKED)
    response.set_cookie(
        key=settings.SIMPLE_JWT['TWO_FACTOR_AUTH_COOKIE'],
        value=intermediate_token,
        expires=60 * 5, # 5 Minutes
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )
    return response 
