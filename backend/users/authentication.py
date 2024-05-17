from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            header = self.get_header(request)
            if header is None:
                raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
            else:
                raw_token = self.get_raw_token(header)

            if raw_token is None:
                return None

            validated_token = self.get_validated_token(raw_token)

            return self.get_user(validated_token), validated_token
        except:
            return None

""" 
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime, timedelta


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            header = self.get_header(request)
            if header is None:
                raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
            else:
                raw_token = self.get_raw_token(header)

            if raw_token is None:
                return None

            validated_token = self.get_validated_token(raw_token)
            user, token = self.get_user(validated_token), validated_token

            # Check if 2FA is enabled and last_2fa_login is null or past 1 day
            if user.is_authenticated and user.two_factor_enabled and (user.last_2fa_login is None or user.last_2fa_login < datetime.now() - timedelta(days=1)):
                # Delete access and refresh cookies
                response = self.get_response(request)
                response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
                response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
                return None

            return user, token
        except:
            return None
"""