from datetime import datetime
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from users.serializers import UserMeSerializer
from ..serializers import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from ..utils import add_cookies, generate_2fa_token, get_default_avatar, send_verification
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from ..models import User
from datetime import timedelta
from django.conf import settings

# Register View
class RegisterView(GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        # Save the user instance
        user = serializer.save()

        # Save default avatar
        avatar_path = get_default_avatar(user.username)
        user.avatar = avatar_path
        user.save()
        # Pass the user instance to send_verification
        send_verification(user)
        refresh_token, access_token = user.tokens().values()

        user.last_login = datetime.now()
        user.save()
        
        response = Response({
            'detail': 'User Created Successfully. Check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)

        response = add_cookies(response, access=access_token, refresh=refresh_token)
        return response


# Login View with TokenObtainPairView generic view
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            two_factor_enabled = response.data.get('two_factor_auth_required')
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
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        # Verify the token first
        response = super().post(request, *args, **kwargs)

        # If token is valid, check if user exists
        if response.status_code == status.HTTP_200_OK:
            try:
                # Decode the token
                UntypedToken(request.data['token'])
            except (InvalidToken, TokenError) as e:
                return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

            # Get user_id from the token
            user_id = UntypedToken(request.data['token']).payload['user_id']

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
                user_serializer = UserMeSerializer(user)
                return Response(user_serializer.data, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                response = Response({'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
                response.delete_cookie('access')
                response.delete_cookie('refresh')
                return response

class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        past_date = datetime.now() - timedelta(days=1)
        
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value='',
            expires=past_date)
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value='',
            expires=past_date)
        return response


