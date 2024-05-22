from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user1 = UserSerializer(instance.user1)
        user2 = UserSerializer(instance.user2)
        representation['user1'] = user1.data
        representation['user2'] = user2.data
        return representation

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
