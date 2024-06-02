from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsNotificationRecipient
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
# Create your views here.


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated, IsNotificationRecipient]

    #get only unread notifications
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user, read=False)

    #get all notifications
    
    @action(detail=False, methods=['get'])
    def all(self, request):
        notifications = Notification.objects.filter(recipient=request.user)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

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
        
