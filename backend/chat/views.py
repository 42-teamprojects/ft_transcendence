from rest_framework import generics, permissions, status
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Q


class ChatListView(generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def create(self, request, *args, **kwargs):
        user1 = request.data.get('user1')
        user2 = request.data.get('user2')

        existing_chat = Chat.objects.filter(
            Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
        ).first()

        if existing_chat:
            return Response(
                {'detail': 'A chat between these users already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)