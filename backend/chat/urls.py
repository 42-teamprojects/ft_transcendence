from django.urls import path
from .views import *


urlpatterns = [
    path('', ChatListView.as_view(), name='chats'),
    path('messages/', MessageListView.as_view(), name='messages'),
    path('users/', UserChatsListView.as_view(), name='user_chats'),
    path('messages/<int:chat_id>/', UserChatMessagesListView.as_view(), name='chat_messages'),
]
