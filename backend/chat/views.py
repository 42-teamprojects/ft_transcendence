from rest_framework.permissions import IsAuthenticated

from friends.models import Friendship
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
        
        blocked_friendship_exists = Friendship.objects.filter(
            Q(user1=user1, user2_id=user2_id, is_blocked=True) | 
            Q(user1_id=user2_id, user2=user1, is_blocked=True)
        ).exists()

        if blocked_friendship_exists:
            raise serializers.ValidationError("You have a blocked friendship with this user.")
        
        user2 = User.objects.get(pk=user2_id)
        serializer.save(user1=user1, user2=user2)

    @action(detail=False, methods=['get'])
    def get_chat_by_user(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        chat = Chat.objects.filter(Q(user1=request.user, user2=user) | Q(user1=user, user2=request.user)).first()
        if chat is None:
            return Response({'detail': 'Chat does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(chat)
        return Response(serializer.data)


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
        
        receiver = chat.user1 if sender != chat.user1 else chat.user2
        blocked_friendship_exists = Friendship.objects.filter(
            Q(user1=sender, user2=receiver, is_blocked=True) | 
            Q(user1=receiver, user2=sender, is_blocked=True)
        ).exists()

        if blocked_friendship_exists:
            raise serializers.ValidationError("You have a blocked friendship with the receiver.")
        
        serializer.save(sender=sender, chat_id=chat_id)
        
    #mark all messages that not belong to the user as read
    @action(detail=False, methods=['post'])
    def mark_read(self, request, chat_id):
        chat = get_object_or_404(Chat, pk=chat_id)
        user = self.request.user
        if user != chat.user1 and user != chat.user2:
            return Response({'detail': 'You are not a participant in this chat.'}, status=status.HTTP_400_BAD_REQUEST)
        Message.objects.filter(chat=chat_id).exclude(sender=user).update(is_seen=True)
        return Response({'detail': 'All messages marked as read.'}, status=status.HTTP_200_OK)
