
from django.db import models
from match.models import Match

# Create your models here
class GameSession(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='game_session')
    vacant = models.BooleanField(default=True)
    private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"GameSession {self.id} for match {self.match.id} tournament {self.match.tournament}"

    def delete(self, *args, **kwargs):
        if not self.match.tournament:
            self.match.delete()
        super().delete(*args, **kwargs)