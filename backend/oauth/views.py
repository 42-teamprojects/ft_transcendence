from random import Random
from django.conf import settings
from django.http import HttpResponseBadRequest, HttpResponseRedirect, JsonResponse
from rest_framework.views import APIView
from requests_oauthlib import OAuth2Session
import os
from users.models import User
from users.views import add_cookies
from rest_framework.response import Response
from rest_framework import status
from django.core import serializers

# http://localhost:8000/api/oauth2/login/google/
# http://localhost:8000/api/oauth2/login/fortytwo/

class OAuth2LoginView(APIView):
    def get(self, request, provider):
        provider_config = settings.OAUTH2_PROVIDERS.get(provider)
        if not provider_config:
            return Response({"error" : "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)

        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Only for development
        oauth = OAuth2Session(
            provider_config['client_id'],
            redirect_uri=provider_config['redirect_uri'],
            scope=provider_config['scope']
        )
        authorization_url, state = oauth.authorization_url(provider_config['authorization_url'])

        # Save the state and provider in the session to validate the response later
        request.session['oauth_state'] = state
        request.session['oauth_provider'] = provider

        return Response({ 'authorization_url': authorization_url }, status=status.HTTP_200_OK)

class OAuth2CallbackView(APIView):
    def get(self, request, provider):
        provider_config = settings.OAUTH2_PROVIDERS.get(provider)
        if not provider_config:
            return Response({"error" : "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)

        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Only for development

        # Ensure 'oauth_state' exists in the session
        state = request.session.get('oauth_state')
        oauth_provider = request.session.get('oauth_provider')
        if not state or oauth_provider != provider:
            return Response({"error" : "State not found or provider mismatch."}, status=status.HTTP_400_BAD_REQUEST)

        oauth = OAuth2Session(
            provider_config['client_id'],
            redirect_uri=provider_config['redirect_uri'],
            state=state
        )
        token = oauth.fetch_token(
            provider_config['token_url'],
            authorization_response=request.build_absolute_uri(),
            client_secret=provider_config['client_secret']
        )

        # Fetch user profile
        response = oauth.get(provider_config['profile_url'])
        profile = response.json()

        # Clear session state
        del request.session['oauth_state']
        del request.session['oauth_provider']
        
        email = profile['email']
        if (provider == 'google'):
            full_name = profile['name']
            username = profile['email'].split('@')[0]
        
        if (provider == 'fortytwo'):
            full_name = profile['displayname']
            username = profile['login']
        
        ok = False
        #check if username already exists
        try:
            user = User.objects.get(email=email)
            ok = True
        except User.DoesNotExist:
            if User.objects.filter(username=username).exists():
                username = username + str(User.objects.count())
            
            user = User.objects.create(username=username, email=email, full_name=full_name, is_verified=profile.get('verified_email', False))
            user.set_unusable_password()
            user.save()
            ok = True
            
        if ok:
            response = Response(status=status.HTTP_200_OK)
            access_token, refresh_token = user.tokens().values()
            response = add_cookies(response, access_token, refresh_token)
        else:
            response = Response({"error" : "Something went wrong, please try again."}, status=status.HTTP_401_UNAUTHORIZED)

        return response
        

