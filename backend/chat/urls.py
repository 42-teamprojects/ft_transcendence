from django.urls import path
from .views import *


urlpatterns = [
    path('', ChatListView.as_view(), name='chats'),
    path('<int:chat_id>/', ChatMessagesListView.as_view(), name='chat_messages'),
]
