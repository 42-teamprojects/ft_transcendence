from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlockFriendshipView, FriendshipViewSet, UnblockFriendshipView

router = DefaultRouter()
router.register(r'friends', FriendshipViewSet, basename='friendship')

urlpatterns = [
    # Other URL patterns
    path('', include(router.urls)),
    path('friends/block/<int:friendship_id>/', BlockFriendshipView.as_view(), name='block-friendship'),
    path('friends/unblock/<int:friendship_id>/', UnblockFriendshipView.as_view(), name='unblock-friendship'),
]