from django.db import models
from accounts.models import User
from django.utils.translation import gettext_lazy as _

class NotificationType(models.TextChoices):
    MESSAGE = 'MSG', _('Message')
    TOURNAMENT = 'TRN', _('Tournament')
    PLAY_REQUEST = 'PRQ', _('Play Request')
    FRIEND_ALERT = 'FAL', _('Friend Alert')

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    data = models.JSONField(null=True, blank=True, default=dict)
    type = models.CharField(max_length=3, choices=NotificationType.choices, default=NotificationType.MESSAGE)
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.type} notification for {self.recipient}'

