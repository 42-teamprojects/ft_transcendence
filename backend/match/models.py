from django.db import models
from accounts.models import User
from django.utils.translation import gettext_lazy as _

class MatchStatus(models.TextChoices):
    STARTING = 'S', _('Starting')
    WAITING = 'W', _('Waiting')
    ONGOING = 'O', _('Ongoing')
    FINISHED = 'F', _('Finished')

class Match(models.Model):
    player1 = models.ForeignKey(User, related_name='match_player1', on_delete=models.CASCADE, null=True)
    player2 = models.ForeignKey(User, related_name='match_player2', on_delete=models.CASCADE, null=True)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    winner = models.ForeignKey(User, related_name='match_winner', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(_('Status'), max_length=1, choices=MatchStatus.choices, default=MatchStatus.WAITING)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
