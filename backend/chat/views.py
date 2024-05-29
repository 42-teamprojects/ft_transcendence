from rest_framework.permissions import IsAuthenticated
from .permissions import IsChatParticipant
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import serializers
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from accounts.models import User
from rest_framework.decorators import action
from django.db.models import Subquery, OuterRef

class ChatViewSet(ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()
    permission_classes = [IsAuthenticated, IsChatParticipant]

    def get_queryset(self):
        user = self.request.user
        
        # Get the latest message time for each chat
        latest_message_time = Message.objects.filter(
            chat=OuterRef('pk')
        ).order_by('-created_at')
        
        # Annotate each chat with the latest message time
        chats = Chat.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).annotate(
            latest_message_time=Subquery(latest_message_time.values('created_at')[:1])
        ).order_by('-latest_message_time')

        return chats.distinct()

    def perform_create(self, serializer):
        user1 = self.request.user
        user2_id = self.request.data.get('user2')
        chat_exists = Chat.objects.filter(Q(user1=user1.id) & Q(user2=user2_id) | Q(user1=user2_id) & Q(user2=user1.id))
        if chat_exists:
            raise serializers.ValidationError({'detail': "Chat already exists", 'chat_id': chat_exists[0].id})
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
    
    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        chat = get_object_or_404(Chat, pk=chat_id)
        user = self.request.user
        if user != chat.user1 and user != chat.user2:
            return Message.objects.none()
        return Message.objects.filter(chat=chat_id).order_by('-created_at')
    
    def perform_create(self, serializer):
        sender = self.request.user
        chat_id = self.kwargs['chat_id']
        chat = get_object_or_404(Chat, pk=chat_id)
        if sender != chat.user1 and sender != chat.user2:
            raise serializers.ValidationError("You are not a participant in this chat.")
        serializer.save(sender=sender, chat_id=chat_id)
