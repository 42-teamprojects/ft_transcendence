from django.db import models
from django.contrib.auth.models import User

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
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

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
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player2')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)