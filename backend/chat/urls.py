from django.urls import path
from .views import ChatListView

urlpatterns = [
    path('chats/', ChatListView.as_view(), name='chats'),
]
