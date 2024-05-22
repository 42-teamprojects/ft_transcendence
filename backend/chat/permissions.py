from rest_framework import permissions
from .models import Chat, Message

class IsChatParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Chat):
            return obj.user1 == request.user or obj.user2 == request.user
        if isinstance(obj, Message):
            return obj.chat.user1 == request.user or obj.chat.user2 == request.user
    