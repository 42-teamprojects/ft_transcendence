from django.db import models
from accounts.models import User

class UserStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_stats')
    matches_played = models.PositiveIntegerField(default=0)
    matches_won = models.PositiveIntegerField(default=0)
    matches_lost = models.PositiveIntegerField(default=0)
    tournaments_played = models.PositiveIntegerField(default=0)
    tournaments_won = models.PositiveIntegerField(default=0)
    tournaments_lost = models.PositiveIntegerField(default=0)
    current_win_streak = models.PositiveIntegerField(default=0)
    longest_win_streak = models.PositiveIntegerField(default=0)



    def __str__(self):
        return self.user.username