from django.db import models

class UserStats(models.Model):
    matches_played = models.PositiveIntegerField(default=0)
    matches_won = models.PositiveIntegerField(default=0)
    matches_lost = models.PositiveIntegerField(default=0)
    tournaments_played = models.PositiveIntegerField(default=0)
    tournaments_won = models.PositiveIntegerField(default=0)
    tournaments_lost = models.PositiveIntegerField(default=0)
    current_win_streak = models.PositiveIntegerField(default=0)
    longest_win_streak = models.PositiveIntegerField(default=0)