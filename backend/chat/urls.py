from django.urls import path
from .views import ChatListView, MessageListView, UserChatsListView


urlpatterns = [
    path('chats/', ChatListView.as_view(), name='chats'),
    path('messages/', MessageListView.as_view(), name='messages'),
    path('chats/<int:user_id>/', UserChatsListView.as_view(), name='user_chats'),
]
