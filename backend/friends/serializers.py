    
from rest_framework import serializers
from accounts.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Friendship
from users.serializers import UserSerializer

class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    is_blocked = serializers.BooleanField(read_only=True)
    blocked_by = UserSerializer(read_only=True)
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'is_blocked', 'blocked_by']

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
    is_blocked = serializers.BooleanField(read_only=True)
    blocked_by = UserSerializer(read_only=True)
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'is_blocked', 'blocked_by']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user1 = UserSerializer(instance.user1)
        user2 = UserSerializer(instance.user2)
        representation['user1'] = user1.data
        representation['user2'] = user2.data
        return representation