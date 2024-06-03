
from datetime import timedelta
from email.message import EmailMessage
from email.policy import default
from django.db import models
from accounts.models import User
from django.forms import ValidationError
import math
import random
from django.utils import timezone

import tournaments

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
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_tournaments')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='won_tournaments')
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
    participants = models.ManyToManyField(User, related_name='tournaments')
    total_rounds = models.IntegerField(null=True)
    
    def save(self, *args, **kwargs):
        if self.pk is None:  # The tournament is being created
            if Tournament.objects.filter(type=self.type, status='NS').exists():
                raise ValidationError('There\'s already an active tournament of this type.')
            if Tournament.objects.filter(organizer=self.organizer, status='NS').exists():
                raise ValidationError('You are already organizing an active tournament.')
            if self.type not in [choice[0] for choice in self.TYPE_CHOICES]:
                raise ValidationError('Invalid tournament type.')
            super().save(*args, **kwargs)
            self.participants.add(self.organizer)
        else:
            super().save(*args, **kwargs)
            
    def start(self):
        self.validate_start_conditions()
        self.status = 'IP'
        self.calculate_rounds()
        self.save()

        participants = self.randomize_participants()
        matches = self.generate_matches(participants)
        print(matches)
        TournamentMatch.objects.bulk_create(matches)
        # self.notify_participants()

    def validate_start_conditions(self):
        if self.status != 'NS':
            raise ValidationError('The tournament has already started.')
        if self.participants.count() > int(self.type):
            raise ValidationError('The tournament is already full.')
        if self.participants.count() < int(self.type):
            raise ValidationError('The tournament is not full yet.')

    def calculate_rounds(self):
        num_rounds = int(math.log2(self.participants.count()))
        self.total_rounds = num_rounds

    def randomize_participants(self):
        participants = list(self.participants.all())
        random.shuffle(participants)
        return participants

    def generate_matches(self, participants):
        matches = []
        match_number = 0  # Initialize match_number
        for round in range(1, self.total_rounds + 1):
            group = 1
            num_matches = int(2**(self.total_rounds - round))
            for i in range(num_matches):
                player1 = participants.pop() if round == 1 and participants else None
                player2 = participants.pop() if round == 1 and participants else None
                if player1 and player2:
                    matches.append(TournamentMatch(tournament=self, round=round, group=group, match_number=match_number, player1=player1, player2=player2))
                else:
                    matches.append(TournamentMatch(tournament=self, round=round, group=group, match_number=match_number, player1=None, player2=None))
                if i % 2 == 1:  # Increment the group number and reset match_number every two matches
                    group += 1
                    match_number = 0
                else:  # Increment match_number for every match
                    match_number += 1
        return matches

    def add_participant(self, user):
        if self.status != 'NS':
            raise ValidationError('Cannot add participants to a tournament that has already started.')
        if self.participants.count() >= int(self.type):
            raise ValidationError('The tournament is already full.')
        self.participants.add(user)
        self.save()
    
    # print tournament qualification brackets tree
    def print_tree(self):
        print(f'Tournament {self.pk} - {self.type} players')
        for match in self.matches.all():
            print(f'Round {match.round} - Group {match.group}: {match.player1} vs {match.player2}')

    def notify_participants(self):
        for participant in self.participants.all():
            email = EmailMessage(
                'Tournament Started',
                'The tournament you signed up for has started.',
                to=[participant.email]
            )
            email.send()
            # Notification with channels/sockets
    
    def __str__(self):
        return f'Tournament {self.pk}'


class TournamentMatch(models.Model):
    STATUS_CHOICES = [
        ('NS', 'Not Started'),
        ('IP', 'In Progress'),
        ('F', 'Finished'),
    ]
    match_number = models.IntegerField(null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches', null=True)
    round = models.IntegerField()
    group = models.IntegerField()
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player1', null=True)
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player2', null=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
    start_time = models.DateTimeField(auto_now_add=False, null=True)
    
    # on create, if the match is in the first round and doesn't have two players, set it as finished with the winner as player1, and move him to the next round
    def save(self, *args, **kwargs):
        if self.pk is None and self.round == 1 and self.player1 and not self.player2:
            self.status = 'F'
            self.winner = self.player1
            self.assign_winner_to_next_round(self.player1)
        super().save(*args, **kwargs)
    
    def set_winner(self, winner):
        if winner not in [self.player1, self.player2]:
            raise ValidationError('The provided user is not a player in this match.')
        self.winner = winner
        self.status = 'F'
        self.assign_winner_to_next_round(winner)
        self.save()

    def assign_winner_to_next_round(self, winner):
        # Calculate the group and match for the next round
        next_round_group = self.group // 2
        next_round_match_number = self.group % 2

        # Get the match in the next round for the calculated group and match
        next_round_match = TournamentMatch.objects.select_for_update().filter(
            tournament=self.tournament, round=self.round + 1, group=next_round_group, match_number=next_round_match_number).first()

        if next_round_match:
            # Assign the winner to player1 or player2, depending on the current match number
            if self.match_number == 0:
                next_round_match.player1 = winner
            elif self.match_number == 1:
                next_round_match.player2 = winner
            next_round_match.save()

            # If the match is now full, start it after 1 minute
            if next_round_match.player1 is not None and next_round_match.player2 is not None:
                next_round_match.start_time = timezone.now() + timedelta(minutes=1)
                next_round_match.save()
    
    def __str__(self):
        return f'Round {self.round} - {"1st match of" if self.match_number == 0 else "2nd match of"} Group {self.group}: {self.player1} vs {self.player2}, Winner: {self.winner}'