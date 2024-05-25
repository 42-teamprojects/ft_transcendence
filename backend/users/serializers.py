from rest_framework import serializers
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'last_login', 'status']

class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'last_login', 'status', 'is_superuser', 'is_staff', 'is_verified', 'date_joined', 'provider', 'two_factor_enabled']
        