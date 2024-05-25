from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Chat, Message

class ChatSerializer(ModelSerializer):
    user1 = UserSerializer(read_only=True)
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

class MessageSerializer(ModelSerializer):
    sender = UserSerializer(read_only=True)
    chat = ChatSerializer(read_only=True)
    is_seen = serializers.BooleanField(read_only=True)
    class Meta:
        model = Message
        fields = ['content', 'sender', 'is_seen', 'created_at', 'chat']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        sender_id = instance.sender.id
        chat_id = instance.chat.id
        representation['sender'] = sender_id
        representation['chat'] = chat_id
        return representation