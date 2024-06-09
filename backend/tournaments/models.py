
from datetime import timedelta
from email.message import EmailMessage
from email.policy import default
from os import write
from threading import Timer
from django.db import models
from accounts.models import User
from django.forms import ValidationError
import math
import random
from django.utils import timezone
from backend import settings
from django.core.mail import send_mail
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.apps import apps

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
    created_at = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField(auto_now_add=False, null=True)
    
    def save(self, *args, **kwargs):
        if self.pk is None:  # The tournament is being created
            if Tournament.objects.filter(type=self.type, status='NS').exists() :
                raise ValidationError('There\'s already an active tournament of this type.')
            if Tournament.objects.filter(organizer=self.organizer, status='NS').exists():
                raise ValidationError('You are already organizing an active tournament.')
            if self.type not in [choice[0] for choice in self.TYPE_CHOICES]:
                raise ValidationError('Invalid tournament type.')
            if self.organizer.tournaments.filter(status='NS').exists() or self.organizer.tournaments.filter(status='IP').exists():
                raise ValidationError('You are already a participant in another tournament.')
            super().save(*args, **kwargs)
            self.participants.add(self.organizer)
        else:
            super().save(*args, **kwargs)
            
    def start(self):
        self.validate_start_conditions()
        self.status = 'IP'
        self.calculate_rounds()
        self.save()
        Match = apps.get_model('match', 'Match')

        participants = self.randomize_participants()
        matches = self.generate_matches(participants)
        Match.objects.bulk_create(matches)
        self.start_time = timezone.now() + timedelta(minutes=1)
        self.save()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            str(self.id), 
            {
                'type': 'tournament_update',
                'data': 'The tournament is starting in 1 minute.'
            }
        )
        # Calculate the delay until the start_time
        delay = (self.start_time - timezone.now()).total_seconds()
        Timer(delay, self.start_matches).start()
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
        Match = apps.get_model('match', 'Match')
        matches = []
        match_number = 0  # Initialize match_number
        for round in range(1, self.total_rounds + 1):
            group = 1
            num_matches = int(2**(self.total_rounds - round))
            for i in range(num_matches):
                player1 = participants.pop() if round == 1 and participants else None
                player2 = participants.pop() if round == 1 and participants else None
                if player1 and player2:
                    match = Match(tournament=self, round=round, group=group, match_number=match_number, player1=player1, player2=player2)
                    matches.append(match)
                else:
                    matches.append(Match(tournament=self, round=round, group=group, match_number=match_number, player1=None, player2=None))
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
        if user in self.participants.all():
            raise ValidationError('You are already a participant in this tournament.')
        if user.tournaments.filter(status='NS').exists():
            raise ValidationError('You are already a participant in another tournament.')
        self.participants.add(user)
        self.save()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            str(self.id), 
            {
                'type': 'tournament_update',
                'data': f'{user.username} has joined the tournament.'
            }
        )

        if self.participants.count() == int(self.type):
            self.start()
    
    # print tournament qualification brackets tree
    def print_tree(self):
        print(f'Tournament {self.pk} - {self.type} players')
        # get all matches order by round and group
        matches = self.matches.all().order_by('round', 'group', 'match_number')
        for match in matches:
            print(match)

    def notify_participants(self):
        for participant in self.participants.all():
            send_mail(
                'Tournament Started',
                'The tournament you signed up for has started.',
                settings.EMAIL_HOST_USER
                [participant.email],
                fail_silently=False,
            )
    
    def cancel(self):
        self.status = 'C'
        self.save()
    
    def remove_participant(self, user):
        # Cant leave if there's more than half of the required participants
        if self.participants.count() > int(self.type) / 2:
            raise ValidationError('Cannot leave a tournament that is already half full')
        if user == self.organizer:
            new_organizer = self.participants.exclude(pk=user.pk).first()
            if new_organizer:
                self.organizer = new_organizer
                self.save()
            else:
                self.delete()
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    "all_users", 
                    {
                        'type': 'tournament_update',
                        'data': f'Tournament has been cancelled.'
                    }
                )
                return
                
        if self.status == 'IP':
            raise ValidationError('Cannot leave a tournament that has already started.')
        if user not in self.participants.all():
            raise ValidationError('You are not a participant in this tournament.')
        self.participants.remove(user)
        self.save()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            str(self.id), 
            {
                'type': 'tournament_update',
                'data': f'{user.username} has left the tournament.'
            }
        )
    
    def start_matches(self):
        if self.status != 'IP':
            raise ValidationError('The tournament has not started yet.')
        if self.status == 'IP' and timezone.now() >= self.start_time:
            for match in self.matches.filter(status='NS'):
                if match.player1 is not None and match.player2 is not None:
                    match.start()

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                str(self.id), 
                {
                    'type': 'tournament_update',
                    'data': 'The tournament has started.'
                }
            )
    
    def __str__(self):
        return f'Tournament {self.pk}'


# class TournamentMatch(models.Model):
#     STATUS_CHOICES = [
#         ('NS', 'Not Started'),
#         ('IP', 'In Progress'),
#         ('F', 'Finished'),
#     ]
#     match_number = models.IntegerField(null=True)
#     tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches', null=True)
#     round = models.IntegerField()
#     group = models.IntegerField()
#     player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player1', null=True)
#     player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_player2', null=True)
#     winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
#     start_time = models.DateTimeField(auto_now_add=False, null=True)
    
#     def save(self, *args, **kwargs):
#         super().save(*args, **kwargs) 
#         if self.player1 and self.player2 and self.status == 'NS' and self.tournament.status == 'IP':
#             self.start()
    
#     def set_winner(self, winner):
#         if winner not in [self.player1, self.player2]:
#             raise ValidationError('The provided user is not a player in this match.')
#         self.winner = winner
#         self.status = 'F'
#         if self.round < self.tournament.total_rounds:
#             self.assign_winner_to_next_round(winner)
#         elif self.round == self.tournament.total_rounds:
#             self.tournament.winner = winner
#             self.tournament.status = 'F'
#             self.tournament.save()
#         self.save()

#     def assign_winner_to_next_round(self, winner):
#         # Get all the matches in the next round
#         next_round_group = math.ceil(self.group / 2)
#         next_round_match = 0 if self.group % 2 == 1 else 1
#         next_round_match = TournamentMatch.objects.select_for_update().filter(
#             tournament=self.tournament, round=self.round + 1, group=next_round_group, match_number=next_round_match).first()

#         if next_round_match:
#             if self.match_number == 0:
#                 next_round_match.player1 = winner
#             elif self.match_number == 1:
#                 next_round_match.player2 = winner
#             next_round_match.save()

#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             str(self.id), 
#             {
#                 'type': 'tournament_update',
#                 'data': f'Match {self.pk} has finished.'
#             }
#         )
    
#     def start(self):
#         self.start_time = timezone.now() + timedelta(seconds=30)
#         self.status = 'IP'
#         self.save()
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             str(self.id), 
#             {
#                 'type': 'tournament_update',
#                 'data': f'Match {self.pk} has started.'
#             }
#         )
                
#     def __str__(self):
#         return f'R{self.round}-{"1" if self.match_number == 0 else "2"}G{self.group}: {self.player1} vs {self.player2}, W: {self.winner}'