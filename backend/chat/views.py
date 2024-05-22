from rest_framework import generics, permissions, status
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Q
from users.models import User

class ChatListView(generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]  

    def get(self, request, *args, **kwargs):
        user = request.user
        # return all the chats that involve the user
        chats = self.queryset.filter(Q(user1=user) | Q(user2=user))
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = request.user
        user1_id = int(request.data.get('user1'))
        user2_id = int(request.data.get('user2'))
        if user1_id != user.id and user2_id != user.id:
            return Response(
                {'detail': 'You cannot create a chat which does not involve you.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if user1_id == user2_id:
            return Response(
                {'detail': 'You cannot create a chat with yourself.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        existing_chat = Chat.objects.filter(
            Q(user1=user1_id, user2=user2_id) | Q(user1=user2_id, user2=user1_id)
        ).first()

        if existing_chat:
            serializer = ChatSerializer(existing_chat)
            return Response(serializer.data)
        return super().create(request, *args, **kwargs)


class ChatMessagesListView(generics.ListCreateAPIView):
    queryset = Message.objects.all()    
    serializer_class = MessageSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        chat_id = kwargs.get('chat_id')
        chat = Chat.objects.filter(id=chat_id).first()
        if not chat:
            return Response(
                {'detail': 'Chat does not exist.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = request.user
        if chat.user1 != user and chat.user2 != user:
            return Response(
                {'detail': 'You are not a member of this chat.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = MessageSerializer(Message.objects.filter(chat=chat), many=True)
        return Response(serializer.data)

