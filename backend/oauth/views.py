from django.conf import settings
from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.views import View
from requests_oauthlib import OAuth2Session
import os

class OAuth2LoginView(View):
    def get(self, request, provider):
        provider_config = settings.OAUTH2_PROVIDERS.get(provider)
        if not provider_config:
            return HttpResponseBadRequest("Unsupported provider")

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

        return HttpResponseRedirect(authorization_url)

class OAuth2CallbackView(View):
    def get(self, request, provider):
        provider_config = settings.OAUTH2_PROVIDERS.get(provider)
        if not provider_config:
            return HttpResponseBadRequest("Unsupported provider")

        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Only for development

        # Ensure 'oauth_state' exists in the session
        state = request.session.get('oauth_state')
        oauth_provider = request.session.get('oauth_provider')
        if not state or oauth_provider != provider:
            return HttpResponseBadRequest("State not found or provider mismatch.")

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
        profile = response.content

        # Clear session state
        del request.session['oauth_state']
        del request.session['oauth_provider']

        return HttpResponse(profile)
