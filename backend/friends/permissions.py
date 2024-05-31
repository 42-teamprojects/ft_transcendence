from rest_framework import permissions
from .models import Friendship

class AreFriends(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if isinstance(obj, Friendship):
            return obj.user1 == user or obj.user2 == user