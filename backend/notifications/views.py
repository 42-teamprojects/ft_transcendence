from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsNotificationRecipient
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.db.models import Q
import json
# Create your views here.


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated, IsNotificationRecipient]

    #get notifications for the current user
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    #get unread notifications for the current user
    @action(detail=False, methods=['get'])
    def unread(self, request):
        unread_notifications = Notification.objects.filter(recipient=request.user, read=False)
        return Response(self.get_serializer(unread_notifications, many=True).data, status=status.HTTP_200_OK)

    #mark all notifications as read
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        unread_notifications = Notification.objects.filter(recipient=request.user, read=False)
        unread_notifications.update(read=True)
        return Response(status=status.HTTP_200_OK)
