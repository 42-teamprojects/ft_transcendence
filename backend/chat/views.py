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

class MessageListView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        # chat = request.data.get('chat')
        # sender = request.data.get('sender')
        # content = request.data.get('content')

        # try:
        #     chat = Chat.objects.get(id=chat_id)
        # except Chat.DoesNotExist:
        #     return Response({'detail': 'Chat does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # if sender_id!= chat.user1_id and sender_id!= chat.user2_id:
        #     return Response({'detail': 'You are not a member of this chat.'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

class UserChatsListView(generics.ListAPIView):
    serializer_class = ChatSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Chat.objects.filter(Q(user1=user_id) | Q(user2=user_id))

# class MessageListView(generics.ListCreateAPIView):
#     queryset = Message.objects.all()
#     serializer_class = MessageSerializer

#     def create(self, request, *args, **kwargs):
#         chat_id = request.data.get('chat_id')
#         sender_id = request.data.get('sender_id')
#         content = request.data.get('content')
#         is_seen = request.data.get('is_seen')


#         chat = Chat.objects.filter(id=chat_id).first()
#         if not chat:
#             return Response(
#                 {'detail': 'Chat does not exist.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if sender_id != chat.user1_id and sender_id != chat.user2_id:
#             return Response(
#                 {'detail': 'You are not a member of this chat.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         return super().create(request, *args, **kwargs)

# class UserChatsLIstView(generics.ListAPIView):
#     serializer_class = ChatSerializer

#     def get_queryset(self):
#         user_id = self.kwargs.get('user_id')
#         return Chat.objects.filter(Q(user1=user_id) | Q(user2=user_id))