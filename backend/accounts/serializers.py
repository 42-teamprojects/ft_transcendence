from datetime import datetime
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        
        
        refresh_token, access_token = user.tokens().values()

        return {
            'two_factor_auth_required': user.two_factor_enabled,
            'access': access_token,
            'refresh': refresh_token
        }
            

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        self.user.last_login = datetime.now()
        self.user.save()
        return {
            'username' : self.user.username,
            'last_2fa_login' : self.user.last_2fa_login,
            'two_factor_auth_required': self.user.two_factor_enabled,
            **attrs,
        }
    

class PaddleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['paddle_type']

        def update(self, instance, validated_data):
            instance.paddle_type = validated_data.get('paddle_type', instance.paddle_type)
            instance.save()
            return instance
        
class TableThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['table_theme']

        def update(self, instance, validated_data):
            instance.table_theme = validated_data.get('table_theme', instance.table_theme)
            instance.save()
            return instance