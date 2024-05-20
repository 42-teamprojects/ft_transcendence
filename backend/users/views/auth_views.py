from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from ..serializers import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from ..utils import add_cookies, generate_2fa_token, send_verification

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

