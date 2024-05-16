from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import RegisterSerializer
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
from .models import OneTimePassword
from .utils import send_verification


# Register View
class RegisterView(GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        user = serializer.data
        is_sent = send_verification(user['full_name'], user['email'])

        return Response({
            'user': user,
            'message': 'User Created Successfully. Check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)

# Login View with TokenObtainPairView generic view
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response = add_cookies(response, access_token, refresh_token)
 
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

            response = add_cookies(response, access_token)

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

            response = add_cookies(response, access_token, refresh_token)

        return response
    
class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user_code_obj = OneTimePassword.objects.get(otp=otp)
            user = user_code_obj.user
            if user.email != email:
                return Response({'message': 'Email and OTP does not match'}, status=status.HTTP_400_BAD_REQUEST)
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({'message': 'Email Verified Successfully'}, status=status.HTTP_200_OK)
            return Response({'message': 'Email Already Verified'}, status=status.HTTP_400_BAD_REQUEST)
        except OneTimePassword.DoesNotExist:
            return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)


def add_cookies(response, access_token = None, refresh_token = None):
    if (access_token):
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=access_token,
            expires=settings.SIMPLE_JWT['AUTH_COOKIE_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
    if (refresh_token):
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=refresh_token,
            expires=settings.SIMPLE_JWT['AUTH_COOKIE_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

    return response