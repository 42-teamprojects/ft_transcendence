from django.db import models
from accounts.models import User

class Friendship(models.Model):
    user1 = models.ForeignKey(User, related_name='friendships_initiated', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='friendships_received', on_delete=models.CASCADE)
    is_blocked = models.BooleanField(default=False)
    blocked_by = models.ForeignKey(User, null=True, blank=True, related_name='blockings', on_delete=models.SET_NULL)

    class Meta:
        unique_together = (('user1', 'user2'),)

    def __str__(self):
        return f"Friendship({self.user1.username}, {self.user2.username})"
