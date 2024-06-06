from rest_framework.serializers import ModelSerializer
from .models import Notification

class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'data', 'type', 'read', 'timestamp']
        # make all not required only the read attribute is required
        extra_kwargs = {
            'recipient': {'required': False},
            'data': {'required': False},
            'type': {'required': False},
            'timestamp': {'required': False},
        }
