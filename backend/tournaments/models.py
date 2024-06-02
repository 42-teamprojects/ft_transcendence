from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError

class Tournament(models.Model):
    TYPE_CHOICES = [
        ('4', '4-players'),
        ('8', '8-players'),
        ('16', '16-players'),
    ]
    STATUS_CHOICES = [
        ('NS', 'Not Started'),
        ('IP', 'In Progress'),
        ('F', 'Finished'),
    ]
    type = models.CharField(max_length=2, choices=TYPE_CHOICES)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    participants = models.ManyToManyField(User, related_name='tournaments')
    
    def save(self, *args, **kwargs):
        if self.pk is None:  # The tournament is being created
            if Tournament.objects.filter(organizer=self.organizer, status='NS').exists():
                raise ValidationError('You are already organizing an active tournament.')
            super().save(*args, **kwargs)
            self.participants.add(self.organizer)
        else:
            super().save(*args, **kwargs)
    
    def start(self):
        if self.participants.count() < int(self.type):
            raise ValidationError('Not enough participants to start the tournament.')
        self.status = 'IP'
        self.save()
        # Generate rounds and matches here
        # Notify participants here
    
    def __str__(self):
        return f'Tournament {self.pk}'

class Round(models.Model):
    STATUS_CHOICES = [
        ('NS', 'Not Started'),
        ('IP', 'In Progress'),
        ('F', 'Finished'),
    ]
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    number = models.IntegerField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)

class TournamentMatch(models.Model):
    STATUS_CHOICES = [
        ('NS', 'Not Started'),
        ('IP', 'In Progress'),
        ('F', 'Finished'),
    ]
    round = models.ForeignKey(Round, on_delete=models.CASCADE)
    group = models.IntegerField()
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player2')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)
    
    def set_winner(self, winner):
        self.winner = winner
        self.status = 'F'
        self.save()    