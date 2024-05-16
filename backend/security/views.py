from io import BytesIO
from django.http import FileResponse
from django.shortcuts import render
import pyotp
import qrcode
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from backend import settings
from users.views import add_cookies

# Create your views here.
class EnableTwoFactorAuthView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_secret_key = pyotp.random_base32()
    
        # Save the secret key in the user's profile
        request.user.secret_key = user_secret_key
        request.user.save()
        
        # Generate a TOTP object
        totp = pyotp.TOTP(user_secret_key)
        
        # Generate a URL for a QR code
        otpauth_url = totp.provisioning_uri(name=request.user.email, issuer_name="Blitzpong")
        
        # Generate the QR code
        qr = qrcode.make(otpauth_url).save(settings.MEDIA_ROOT + f'qrcodes/{request.user.username}-qr.png')

        return Response({
            'qr_code': f'{settings.MEDIA_URL}qrcodes/{request.user.username}-qr.png',
            'secret_key': user_secret_key
        }, status=status.HTTP_200_OK)
        
class VerifyTwoFactorAuthView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        totp = pyotp.TOTP(user.secret_key)
        
        if totp.verify(request.data['otp']):
            tokens = user.tokens()
            
            response = Response({'message': 'Two-factor authentication is successful'}, status=status.HTTP_200_OK)
            
            response = add_cookies(response, tokens['access'], tokens['refresh'])
            return response
        else:
            return Response({'message': 'Invalid OTP'}, status=status.HTTP_401_UNAUTHORIZED)