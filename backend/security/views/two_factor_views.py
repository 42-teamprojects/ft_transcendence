import jwt
import pyotp
import qrcode
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.conf import settings
from accounts.models import User
from accounts.utils import add_cookies
from django.utils import timezone
import os

# Create your views here.
class GetTwoFactorAuthView(APIView):
    def get(self, request):
        user_secret_key = pyotp.random_base32()
    
        # Generate a TOTP object
        totp = pyotp.TOTP(user_secret_key)
        
        # Generate a URL for a QR code
        otpauth_url = totp.provisioning_uri(name=request.user.email, issuer_name="Blitzpong")
        
        # check if the directory for storing the QR code exists
        if not os.path.exists(settings.MEDIA_ROOT + 'qrcodes'):
            os.makedirs(settings.MEDIA_ROOT + 'qrcodes')
        
        # Generate the QR code
        qrcode.make(otpauth_url).save(settings.MEDIA_ROOT + f'qrcodes/{request.user.username}-qr.png')        

        return Response({
            'qr_code': f'{settings.MEDIA_URL}qrcodes/{request.user.username}-qr.png',
            'secret_key': user_secret_key
        }, status=status.HTTP_200_OK)
        
class EnableTwoFactorAuthView(APIView):
    def post(self, request):
        if request.user.two_factor_enabled:
            return Response({'detail': 'Two-factor authentication is already enabled'}, status=status.HTTP_400_BAD_REQUEST)
        
        totp = pyotp.TOTP(request.data['secret_key'])

        if totp.verify(request.data['otp']):
            request.user.two_factor_enabled = True
            request.user.last_2fa_login = timezone.now()
            request.user.secret_key = request.data['secret_key']
            request.user.save()
            return Response({'detail': 'Two-factor authentication is enabled'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid OTP'}, status=status.HTTP_401_UNAUTHORIZED)
        
class VerifyTwoFactorAuthView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        two_factor_cookie = request.COOKIES.get(settings.SIMPLE_JWT['TWO_FACTOR_AUTH_COOKIE'])
        if (two_factor_cookie is None or two_factor_cookie == 'null' or two_factor_cookie == 'undefined'):
            return Response({'detail': 'Something went wrong, try login again'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = jwt.decode(two_factor_cookie, settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=['HS256'])
            username = payload.get('username')
            user = User.objects.get(username=username)
            totp = pyotp.TOTP(user.secret_key)
            
            if totp.verify(request.data['otp']):
                if user.last_2fa_login is None and not user.two_factor_enabled:
                    user.two_factor_enabled = True
                    
                user.last_2fa_login = timezone.now()
                user.save()

                tokens = user.tokens()

                response = Response({'detail': 'Two-factor authentication is successful'}, status=status.HTTP_200_OK)
                response.delete_cookie(settings.SIMPLE_JWT['TWO_FACTOR_AUTH_COOKIE'])
                response = add_cookies(response, access=tokens['access'], refresh=tokens['refresh'])
                return response
            else:
                return Response({'detail': 'Invalid OTP'}, status=status.HTTP_401_UNAUTHORIZED)
            
        except jwt.ExpiredSignatureError:
            response = Response({'detail': 'Two-factor authentication token has expired'}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie(settings.SIMPLE_JWT['TWO_FACTOR_AUTH_COOKIE'])
            return response

class DisableTwoFactorAuthView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        request.user.two_factor_enabled = False
        request.user.secret_key = ''
        request.user.save()
        return Response({'detail': 'Two-factor authentication is disabled'}, status=status.HTTP_200_OK)