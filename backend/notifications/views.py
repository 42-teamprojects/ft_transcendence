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

    # #mark all notifications as read
    # def mark_all_as_read(self, request):
    #     notifications = Notification.objects.filter(recipient=request.user, read=False)
    #     notifications.update(read=True)
    #     return Response({'detail': 'All notifications marked as read.'}, status=status.HTTP_200_OK)