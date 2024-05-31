from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FriendshipViewSet

router = DefaultRouter()
router.register(r'friendships', FriendshipViewSet, basename='friendship')

urlpatterns = [
    # Other URL patterns
    path('', include(router.urls)),
]