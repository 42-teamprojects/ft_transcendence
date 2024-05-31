from django.db import models
from accounts.models import User


class Notification(models.Model):
    MESSAGE = 'MSG'
    TOURNAMENT = 'TRN'
    FRIEND_REQUEST = 'FRQ'
    PLAY_REQUEST = 'PRQ'

    NOTIFICATION_TYPES = [
        (MESSAGE, 'Message'),
        (TOURNAMENT, 'Tournament'),
        (FRIEND_REQUEST, 'Friend Request'),
        (PLAY_REQUEST, 'Play Request'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=3, choices=NOTIFICATION_TYPES, default=MESSAGE)
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
