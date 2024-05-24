from rest_framework.permissions import IsAuthenticated
from .permissions import IsChatParticipant
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from accounts.models import User
from rest_framework.decorators import action

class ChatViewSet(ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()
    permission_classes = [IsAuthenticated, IsChatParticipant]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(Q(user1=user) | Q(user2=user))

    def perform_create(self, serializer):
        user1 = self.request.user
        user2_id = self.request.data.get('user2')
        if not user2_id:
            raise serializers.ValidationError("user2 field is required.")
        if user1.id == int(user2_id):
            raise serializers.ValidationError("user1 and user2 cannot be the same user.")
        user2 = User.objects.get(pk=user2_id)
        serializer.save(user1=user1, user2=user2)


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    permissions_classes = [IsAuthenticated, IsChatParticipant]
    
    def perform_create(self, serializer):
        user = self.request.user
        chat_id = self.request.data.get('chat')
        chat = Chat.objects.get(pk=chat_id)
        sender_id = self.request.data.get('sender')
        if user != chat.user1 and user != chat.user2:
            raise serializers.ValidationError("You are not a participant in this chat.")
        if sender_id != user:
            raise serializers.ValidationError("You can only send messages as yourself.")

    # @action(detail=True, methods=['get'])
    # def chat_messages(self, request, pk=None):
    #     chat = self.get_object().chat
    #     messages = Message.objects.filter(chat=chat)
    #     serializer = self.get_serializer(messages, many=True)
    #     return Response(serializer.data)

