from rest_framework import permissions
from .models import Notification

class IsNotificationRecipient(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if isinstance(obj, Notification):
            return obj.recipient == user
