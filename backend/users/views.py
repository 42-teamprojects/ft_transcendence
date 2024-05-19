import datetime
import re
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
import jwt
from .models import OneTimePassword
from .utils import send_verification
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import User
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import AllowAny



# Register View
class RegisterView(GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        # Save the user instance
        user = serializer.save()
        # Pass the user instance to send_verification
        is_sent = send_verification(user)
        refresh_token, access_token = user.tokens().values()
        
        response = Response({
            'detail': 'User Created Successfully. Check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)

        response = add_cookies(response, access=access_token, refresh=refresh_token)
        return response


# Login View with TokenObtainPairView generic view
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            two_factor_enabled = response.data.get('two_factor_auth_required')
            last_2fa_login = response.data.get('last_2fa_login')
            username = response.data.get('username')
            
            if two_factor_enabled: #and (last_2fa_login is None or last_2fa_login < timezone.now() - timezone.timedelta(days=1)): # Delete access and refresh cookies
                # Generate intermediate token
                response = generate_2fa_token(username)
            else:
                response = add_cookies(response, access=access_token, refresh=refresh_token)
 
        return response


# Custom TokenRefreshView to get and set the access token in the cookie
class JWTRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response = add_cookies(response, access=access_token)

        return response

# Custom TokenVerifyView to get the access token from the cookie
class JWTVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response

class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response = add_cookies(response, access=access_token, refresh=refresh_token)

        return response

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

class OTPVerificationView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        otp = request.data.get('otp')
        if not otp:
            return Response({'detail': 'OTP is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Fetch the OTP object using both the OTP and User
            otp_object = OneTimePassword.objects.get(otp=otp, user=request.user)

            # Verify the OTP
            if otp_object:
                otp_object.delete()
                if not request.user.is_verified:
                    request.user.is_verified = True
                    request.user.save()
                    return Response({'detail': 'Email Verified Successfully'}, status=status.HTTP_200_OK)
                return Response({'detail': 'Email Already Verified'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': 'Invalid OTP or Email'}, status=status.HTTP_400_BAD_REQUEST)
        except OneTimePassword.DoesNotExist:
            return Response({'detail': 'Invalid OTP or Email'}, status=status.HTTP_400_BAD_REQUEST)
        

class ResetPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        password_reset_url = f"http://localhost:8080/reset-password?uid={uid}&token={token}"

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
        
        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        password = request.data.get('password')
        if not password:
            return Response({'detail': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(password)
        user.save()
        return Response({'detail': 'Password reset successfully'}, status=status.HTTP_200_OK)
