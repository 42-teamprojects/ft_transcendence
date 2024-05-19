from django.core.mail import send_mail
from django.conf import settings
from users.models import OneTimePassword, User  # Ensure necessary models are imported
import pyotp
from smtplib import SMTPException


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
    
# def send_reset_password(user):
#     subject = 'Reset Password'
#     message = f'Hi {user.username},\n\nClick the link below to reset your password.\n\nhttp://localhost:8000/reset-password/{user.id}/'
#     email_from = settings.EMAIL_HOST_USER
#     recipient_list = [user.email]
    
#     try:
#         send_mail(subject, message, email_from, recipient_list, fail_silently=False)
#         return True
#     except SMTPException as e:
#         print(e)
#         return False
    
