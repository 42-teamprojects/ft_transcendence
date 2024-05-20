from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'chat_id', 'is_seen', 'created_at']
        
