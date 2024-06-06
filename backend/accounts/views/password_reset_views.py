
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from accounts.models import User
from rest_framework import status
from accounts.custom_throttles import CustomAnonRateThrottle
from django.utils import timezone
from accounts.models import PasswordResetToken

class ResetPasswordRequestView(APIView):

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
        
        token = default_token_generator.make_token(user)
        PasswordResetToken.objects.create(user=user, token=token)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        password_reset_url = f"{settings.FRONTEND_DOMAIN}/reset-password?uid={uid}&token={token}"

        subject = 'Reset Password'
        message = f'Hi {user.username},\n\nClick the link below to reset your password:\n\n{password_reset_url}'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email]

        try:
            send_mail(subject, message, email_from, recipient_list, fail_silently=False)
            return Response({'detail': 'Check your email to reset your password'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token_record = PasswordResetToken.objects.get(user=user, token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({'detail': 'Token is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        if token_record.is_used:
            return Response({'detail': 'Token is already used'}, status=status.HTTP_400_BAD_REQUEST)

        token_record.is_used = True
        token_record.save()

        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        password = request.data.get('password')
        if not password:
            return Response({'detail': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(password)
        user.save()
        return Response({'detail': 'Password reset successfully'}, status=status.HTTP_200_OK)
