from django.conf import settings
from django.core.mail import send_mail
from smtplib import SMTPException
import random
from .models import OneTimePassword

def generateOtp():
    return random.randint(100000, 999999)

def send_verification(user):
    otp = generateOtp()
    subject = 'One Time Password (OTP) for Email Verification'
    message = f'Hello {user['full_name']},\nYour OTP is {otp}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user['email']]

    OneTimePassword.objects.create(user, otp=otp)

    try:
        send_mail(subject, message, email_from, recipient_list, fail_silently=False)
        return True
    except SMTPException as e:
        print(e)
        return False