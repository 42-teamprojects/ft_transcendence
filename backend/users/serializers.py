from rest_framework import serializers
from accounts.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Friendship

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'last_login', 'status', 'avatar']

class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name','avatar', 'email', 'last_login', 'status', 'is_superuser', 'is_staff', 'is_verified', 'date_joined', 'provider', 'two_factor_enabled']

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
    
class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user1 = UserSerializer(instance.user1)
        user2 = UserSerializer(instance.user2)
        representation['user1'] = user1.data
        representation['user2'] = user2.data
        return representation
    


class ListFriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user1 = UserSerializer(instance.user1)
        user2 = UserSerializer(instance.user2)
        representation['user1'] = user1.data
        representation['user2'] = user2.data
        return representation