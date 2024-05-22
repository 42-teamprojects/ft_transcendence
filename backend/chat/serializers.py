from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()
    user2 = UserSerializer()

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
