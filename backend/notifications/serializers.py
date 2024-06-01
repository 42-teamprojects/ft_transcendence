from restframework.serializers import ModelSerializer
from .models import Notification

class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'message', 'type', 'read', 'timestamp']
