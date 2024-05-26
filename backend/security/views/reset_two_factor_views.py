from accounts.custom_throttles import CustomAnonRateThrottle
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from accounts.models import User
from rest_framework import status

class Reset2FAView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [CustomAnonRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        two_factor_secret = user.secret_key

        subject = 'Reset Two-Factor Authentication'
        message = f'Hi {user.username},\n\nHere\'s your secret key:\n\n{two_factor_secret}\n\nCopy this secret key and paste it in the 2FA app to reset your 2FA.'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email]

        try:
            send_mail(subject, message, email_from, recipient_list, fail_silently=False)
            return Response({'detail': 'Check your email to reset your 2FA'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
