from email.message import EmailMessage
from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError
import math
import random

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
        ('C', 'Cancelled'),
    ]
    type = models.CharField(max_length=2, choices=TYPE_CHOICES)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    participants = models.ManyToManyField(User, related_name='tournaments')
    
    def save(self, *args, **kwargs):
        if self.pk is None:  # The tournament is being created
            if Tournament.objects.filter(type=self.type, status='NS').exists():
                raise ValidationError('There\'s already an active tournament of this type.')
            if Tournament.objects.filter(organizer=self.organizer, status='NS').exists():
                raise ValidationError('You are already organizing an active tournament.')
            super().save(*args, **kwargs)
            self.participants.add(self.organizer)
        else:
            super().save(*args, **kwargs)
    
    def start(self):
        if self.status != 'NS':
            raise ValidationError('The tournament has already started.')
        if self.participants.count() < int(self.type):
            raise ValidationError('Not enough participants to start the tournament.')
        self.status = 'IP'
        self.save()
        
        # Calculate the number of rounds
        num_rounds = int(math.log2(self.participants.count()))

        # Randomize the participants
        participants = list(self.participants.all())
        random.shuffle(participants)
        
        # Generate matches for all rounds
        matches = []
        for round in range(1, num_rounds + 1):
            group = 1
            num_matches = int(self.participants.count() / 2**(round - 1))
            for i in range(num_matches):
                player1 = participants.pop() if round == 1 else None
                player2 = participants.pop() if round == 1 and participants else None
                if player1 and player2:
                    matches.append(TournamentMatch(tournament=self, round=round, group=group, player1=player1, player2=player2))
                elif player1 and not player2:
                    matches.append(TournamentMatch(tournament=self, round=round, group=group, player1=player1, player2=None, status='F', winner=player1))
                if i % 2 == 1: # Increment the group number every two matches
                    group += 1

        # Create all matches at once
        TournamentMatch.objects.bulk_create(matches)
        
        # Notify participants
        # for participant in self.participants.all():
        #     email = EmailMessage(
        #         'Tournament Started',
        #         'The tournament you signed up for has started.',
        #         to=[participant.email]
        #     )
        #     email.send()
            # Notification with channels/sockets
    
    def __str__(self):
        return f'Tournament {self.pk}'


class TournamentMatch(models.Model):
    STATUS_CHOICES = [
        ('NS', 'Not Started'),
        ('IP', 'In Progress'),
        ('F', 'Finished'),
    ]
    round = models.IntegerField()
    group = models.IntegerField()
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player1', null=True)
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player2', null=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)
    
    def set_winner(self, winner):
        self.winner = winner
        self.status = 'F'
        self.save()

        # Check if all matches in the round are finished
        all_matches_in_round = TournamentMatch.objects.filter(tournament=self.tournament, round=self.round)
        if all(match.status == 'F' for match in all_matches_in_round):
            self.assign_winners_to_next_round()

    def assign_winners_to_next_round(self):
        # Get all winners from the previous round
        winners = [match.winner for match in TournamentMatch.objects.filter(tournament=self.tournament, round=self.round)]

        # Assign winners to the matches in the next round based on the group they are in
        next_round_matches = TournamentMatch.objects.filter(tournament=self.tournament, round=self.round + 1).order_by('group')
        for i, match in enumerate(next_round_matches):
            if i % 2 == 0:  # Assign the winner to player1 for even-indexed matches
                match.player1 = winners[i // 2]
            else:  # Assign the winner to player2 for odd-indexed matches
                match.player2 = winners[i // 2]
            match.save()
