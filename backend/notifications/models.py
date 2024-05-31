from django.db import models
from accounts.models import User


class Notification(models.Model):
    MESSAGE = 'MSG'
    TOURNAMENT = 'TRN'
    PLAY_REQUEST = 'PRQ'
    FRIEND_ALERT = 'FAL'

    NOTIFICATION_TYPES = [
        (MESSAGE, 'Message'),
        (TOURNAMENT, 'Tournament'),
        (PLAY_REQUEST, 'Play Request'),
        (FRIEND_ALERT, 'Friend Alert'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=3, choices=NOTIFICATION_TYPES, default=MESSAGE)
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.type} notification for {self.recipient}'