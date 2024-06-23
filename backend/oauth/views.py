from datetime import datetime
import re
import secrets
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import requests
from urllib.parse import urlencode
import json
import os
from accounts.models import User
from accounts.utils import add_cookies, generate_2fa_token

class OAuth2LoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, provider):
        provider_config = settings.OAUTH2_PROVIDERS.get(provider)
        if not provider_config:
            return Response({"detail" : "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)

        state = secrets.token_hex(16)

        params = {
            'client_id': provider_config['client_id'],
            'redirect_uri': provider_config['redirect_uri'],
            'scope': ' '.join(provider_config['scope']),
            'response_type': 'code',
            'state': state
        }

        authorization_url = provider_config['authorization_url'] + '?' + urlencode(params)

        request.session['oauth_state'] = params['state']
        request.session['oauth_provider'] = provider

        return redirect(authorization_url)

class OAuth2CallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, provider):
        provider_config = settings.OAUTH2_PROVIDERS.get(provider)
        if not provider_config:
            return Response({"detail" : "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)

        state = request.session.get('oauth_state')
        oauth_provider = request.session.get('oauth_provider')

        if not state or oauth_provider != provider:
            return Response({"detail" : "State not found or provider mismatch."}, status=status.HTTP_400_BAD_REQUEST)

        code = request.GET.get('code')

        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': provider_config['redirect_uri'],
            'client_id': provider_config['client_id'],
            'client_secret': provider_config['client_secret']
        }

        response = requests.post(provider_config['token_url'], data=data)
        response.raise_for_status()

        token = response.json().get('access_token')

        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(provider_config['profile_url'], headers=headers)
        response.raise_for_status()

        profile = response.json()

        # Clear session state
        del request.session['oauth_state']
        del request.session['oauth_provider']
        
        email = profile['email']
        if (provider == 'google'):
            full_name = profile['name']
            username = profile['email'].split('@')[0]
            # =s96-c
            image_url = profile['picture'].replace('s96-c', 's600-c')
        
        if (provider == 'fortytwo'):
            full_name = profile['displayname']
            username = profile['login']
            image_url = profile['image']['link']
        
        #check if username already exists
        try:
            user = User.objects.get(email=email)
            response = Response(status=status.HTTP_200_OK)
            user.last_login = datetime.now()
            user.save()

            if user.two_factor_enabled: #and (last_2fa_login is None or last_2fa_login < timezone.now() - timezone.timedelta(days=1)): # Delete access and refresh cookies
                # Generate intermediate token
                response = generate_2fa_token(user.username)
            else:
                refresh_token, access_token = user.tokens().values()
                response = add_cookies(response, access=access_token, refresh=refresh_token)
            return response
        except User.DoesNotExist:
            if User.objects.filter(username=username).exists():
                username = username + str(User.objects.count())
            # Download the avatar
            image = requests.get(image_url)
            avatar_path = f'avatars/{username}.png'

            # create the storage directory and avatars directory if it doesn't exist
            if not os.path.exists('storage'):
                os.makedirs('storage')
            if not os.path.exists('storage/avatars'):
                os.makedirs('storage/avatars')

            # Save it as a file in the storage
            try:
                with open('storage/' + avatar_path, 'wb') as f:
                    f.write(image.content)
            except:
                pass
        
            user = User.objects.create(username=username, email=email, full_name=full_name, is_verified=True, avatar=avatar_path)
            user.provider = provider
            user.last_login = datetime.now()
            user.set_unusable_password()
            user.save()
            response = Response(status=status.HTTP_200_OK)
            refresh_token, access_token = user.tokens().values()
            response = add_cookies(response, access=access_token, refresh=refresh_token)
            return response
        except:
            return Response({"detail" : "Something went wrong, please try again."}, status=status.HTTP_401_UNAUTHORIZED)

    