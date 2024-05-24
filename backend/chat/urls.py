# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'chats', ChatViewSet)
router.register(r'chats/(?P<chat_id>\d+)/messages', MessageViewSet, basename='chat-messages')
urlpatterns = [
    path('', include(router.urls)),
]
