from rest_framework import serializers
from accounts.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
import re
from stats.serializers import UserStatsSerializer

class UserSerializer(serializers.ModelSerializer):
    user_stats = UserStatsSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'last_login', 'status', 'avatar', 'date_joined', 'paddle_type', 'table_theme', 'user_stats']

class UserMeSerializer(serializers.ModelSerializer):
    user_stats = UserStatsSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name','avatar', 'email', 'last_login', 'status', 'is_superuser', 'is_staff', 'is_verified', 'date_joined', 'provider', 'two_factor_enabled', 'paddle_type', 'table_theme', 'user_stats']

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['avatar']

class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'full_name', 'email']
        extra_kwargs = {
            'username': {'required': False},
            'full_name': {'required': False},
            'email': {'required': False}
        }

    def validate_username(self, value):
        regex = re.compile('^[a-zA-Z0-9_]*$')
        if not regex.match(value):
            raise serializers.ValidationError("Username contains special characters")
        return value

    def validate_full_name(self, value):
        regex = re.compile('^[a-zA-Z ]*$')
        if not regex.match(value):
            raise serializers.ValidationError("Full name contains special characters")
        return value

    def validate_email(self, value):
        if self.instance.provider == 'google' or self.instance.provider == 'fortytwo':
            raise serializers.ValidationError("Email cannot be changed")
        if self.instance.email != value:
            if User.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Email already exists")
            validator = EmailValidator()
            try:
                validator(value)
            except ValidationError:
                raise serializers.ValidationError("Invalid email")
        return value

    def update(self, instance, validated_data):
        if validated_data.get('email', instance.email) != instance.email:
            instance.is_verified = False
        return super().update(instance, validated_data)
