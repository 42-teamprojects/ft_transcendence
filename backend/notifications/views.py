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
    queryset = Notification.objects.all().order_by('-timestamp')
    permission_classes = [IsAuthenticated, IsNotificationRecipient]

    #get notifications for the current user
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    #get unread notifications for the current user
    @action(detail=False, methods=['get'])
    def unread(self, request):
        unread_notifications = Notification.objects.filter(recipient=request.user, read=False)
        return Response(self.get_serializer(unread_notifications, many=True).data, status=status.HTTP_200_OK)

    #get all notifications exept for messages
    @action(detail=False, methods=['get'])
    def exclude_messages(self, request):
        notifications = Notification.objects.filter(recipient=request.user).exclude(type='MSG')
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    #get message notifiction only
    @action(detail=False, methods=['get'])
    def messages(self, request):
        notifications = Notification.objects.filter(recipient=request.user, type='MSG')
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    #get unseen messages
    @action(detail=False, methods=['get'])
    def unseen_messages(self, request):
        notifications = Notification.objects.filter(recipient=request.user, type='MSG', read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    #get unseen notifications except for messages
    @action(detail=False, methods=['get'])
    def unseen_exclude_messages(self, request):
        notifications = Notification.objects.filter(recipient=request.user, read=False).exclude(type='MSG')
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    #mark all notifications as read exept for messages
    @action(detail=False, methods=['put'])
    def mark_as_read_exept_messages(self, request):
        Notification.objects.filter(recipient=request.user).exclude(type='MSG').update(read=True)
        return Response({'message': 'All notifications except messages marked as read'}, status=status.HTTP_200_OK)
    
    #mark all messages as read
    @action(detail=False, methods=['put'])
    def mark_messages_as_read(self, request):
        Notification.objects.filter(recipient=request.user, type='MSG').update(read=True)
        return Response({'message': 'All messages marked as read'}, status=status.HTTP_200_OK)
    #mark all notifications as read
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        unread_notifications = Notification.objects.filter(recipient=request.user, read=False)
        unread_notifications.update(read=True)
        return Response(status=status.HTTP_200_OK)
