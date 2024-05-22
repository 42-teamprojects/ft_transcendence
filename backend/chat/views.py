from rest_framework import generics, permissions, status
from .permissions import IsChatParticipant
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import viewsets, serializers
from rest_framework.response import Response
from django.db.models import Q
from accounts.models import User
from rest_framework.decorators import action

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsChatParticipant]

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

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    permissions_classes = [permissions.IsAuthenticated, IsChatParticipant]
    
    @action(detail=True, methods=['get'])
    def chat_messages(self, request, pk=None):
        chat = self.get_object().chat
        messages = Message.objects.filter(chat=chat)
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

        
        

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

