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
        print("getting data")
        user = request.user
        if not user:
            return Response(
                {'detail': 'You are not authenticated.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return super().get(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user:
            return Response(
                {'detail': 'You are not authenticated.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        user1_id = user
        user2_id = request.data.get('user2')
        existing_chat = Chat.objects.filter(
            Q(user1=user1_id, user2=user2_id) | Q(user1=user2_id, user2=user1_id)
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

class UserChatMessagesListView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs.get('chat_id')
        chat = Chat.objects.filter(id=chat_id).first()
        if not chat:
            return Message.objects.none()

        return Message.objects.filter(chat=chat)

class UserChatsListView(generics.GenericAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not user:
            return Response(
                {'detail': 'You are not authenticated.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        chats = self.queryset.filter(Q(user1=user) | Q(user2=user))
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

    # def get_queryset(self):
    #     user_id = self.kwargs.get('user_id')
    #     try:
    #         user = User.objects.get(id=user_id)
    #     except User.DoesNotExist:
    #         return Chat.objects.none()  
    #     #! check if user does not exist return 400
    #     user_chats = Chat.objects.filter(Q(user1=user) | Q(user2=user))
    #     return user_chats
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