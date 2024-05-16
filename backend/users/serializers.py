import re
from urllib import request
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.db.models import Q

from django.contrib.auth import authenticate
from .models import User
from rest_framework.exceptions import AuthenticationFailed
from django.http import HttpResponse

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'full_name', 'password']

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user

        
class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    # access_token = serializers.CharField(max_length=255, read_only=True)
    # refresh_token = serializers.CharField(max_length=255, read_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'full_name']
    
    def validate(self, attrs):
        username = attrs.get('username', None)
        password = attrs.get('password', None)
        request = self.context.get('request')
        
        user = authenticate(request=request, username=username, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        
        # if not user.is_verified:
        #     raise AuthenticationFailed('Account is not verified')

        return {
            'two_factor_auth_required': user.two_factor_enabled,
        }
            
