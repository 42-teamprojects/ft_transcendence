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
            two_factor_auth_required = response.data.get('two_factor_auth_required')
            last_2fa_login = response.data.get('last_2fa_login')
            username = response.data.get('username')
            
            if two_factor_auth_required: #and (last_2fa_login is None or last_2fa_login < timezone.now() - timezone.timedelta(days=1)): # Delete access and refresh cookies
                # Generate intermediate token
                intermediate_token = jwt.encode(
                    {'username': username, 'exp': datetime.datetime.now() + datetime.timedelta(minutes=5)},
                    settings.SIMPLE_JWT['SIGNING_KEY'], algorithm='HS256'
                )
                response = Response({'detail': 'Two-factor authentication is required'}, status=status.HTTP_423_LOCKED)
                response.set_cookie(
                    key=settings.SIMPLE_JWT['TWO_FACTOR_AUTH_COOKIE'],
                    value=intermediate_token,
                    expires=60 * 15, # 15 Minutes
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
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