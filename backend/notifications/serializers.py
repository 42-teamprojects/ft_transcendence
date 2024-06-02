from rest_framework.serializers import ModelSerializer
from .models import Notification

class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'data', 'type', 'read', 'timestamp']
