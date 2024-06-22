import math
import re
from django.db import models
from django.forms import ValidationError
from accounts.models import User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from notifications.models import Notification
from tournaments.models import Tournament
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import timedelta
from backend import settings
from django.db import transaction
from threading import Timer

class Match(models.Model):
    STATUS_CHOICES = [
        ('NS', 'Not Started'),
        ('IP', 'In Progress'),
        ('F', 'Finished'),
    ]
    player1 = models.ForeignKey(User, related_name='match_player1', on_delete=models.CASCADE, null=True)
    player2 = models.ForeignKey(User, related_name='match_player2', on_delete=models.CASCADE, null=True)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    winner = models.ForeignKey(User, related_name='match_winner', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='NS')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    # Fields from TournamentMatch
    match_number = models.IntegerField(null=True, blank=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches', null=True, blank=True)
    round = models.IntegerField(null=True, blank=True)
    group = models.IntegerField(null=True, blank=True)
    start_time = models.DateTimeField(auto_now_add=False, null=True, blank=True)

    def is_tournament_match(self):
        return self.tournament is not None
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) 
        if self.tournament and self.player1 and self.player2 and self.status == 'NS' and self.tournament.status == 'IP' and self.round != 1:
            self.start()
            self.start_next_match()
            
    def start_next_match(self):
        channel_layer = get_channel_layer()
        for user_id in [self.player1.id, self.player2.id]:
            
            notification_data = {
                'type': 'notification_message',
                'notification_type': 'TRN',
                'data': {
                    'type': 'MATCH_STARTED',
                    'link': '/online/tournament?tournamentId=' + str(self.tournament.id) + '&matchId=' + str(self.id),
                    'message': 'Your opponent is ready. Join match now',
                    'match_id': self.id,
                    'tournament_id': self.tournament.id,
                },
                'recipient': user_id,
            } 
            Notification.objects.create(
                recipient=User.objects.get(id=user_id),
                type='TRN',
                data=notification_data['data']
            )
            async_to_sync(channel_layer.group_send)(
                f'notifications_{user_id}',
                notification_data
            )
    
    def set_winner_by_id(self, winner_id):
        if winner_id not in [self.player1.id, self.player2.id]:
            raise ValidationError('The provided user is not a player in this match.')
        winner = User.objects.get(id=winner_id)
        self.set_winner(winner)

    def get_winner(self):
        return self.winner

    def set_winner(self, winner):
        if winner not in [self.player1, self.player2]:
            raise ValidationError('The provided user is not a player in this match.')
        self.winner = winner
        self.status = 'F'
        if self.tournament:
            if self.round < self.tournament.total_rounds:
                self.assign_winner_to_next_round(winner)
            elif self.round == self.tournament.total_rounds:
                self.tournament.winner = winner
                self.tournament.winner.user_stats.tournaments_won += 1
                self.tournament.winner.user_stats.save()
                self.tournament.status = 'F'
                self.tournament.save()
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    str(self.tournament.id), 
                    {
                        'type': 'tournament_update',
                        'data': {
                            'type': 'TOURNAMENT_UPDATE',
                            'message': f'{winner.username} have won the tournament.',
                            'tournament_id': self.tournament.id,
                        }
                    }
                )
        self.save()

    def assign_winner_to_next_round(self, winner):
        # Get all the matches in the next round
        next_round_group = math.ceil(self.group / 2)
        if self.round + 1 == self.tournament.total_rounds:
            next_round_match_number = 0  
        elif self.group % 2 == 1:
            next_round_match_number = 0  
        else:
            next_round_match_number = 1
            
        next_match = Match.objects.filter(
            tournament=self.tournament, round=self.round + 1, group=next_round_group, match_number=next_round_match_number).first()

        if next_match:
            if self.match_number == 0:
                next_match.player1 = winner
            elif self.match_number == 1:
                next_match.player2 = winner
            next_match.save()
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                str(self.tournament.id), 
                {
                    'type': 'tournament_update',
                    'data': {
                        'type': 'TOURNAMENT_UPDATE',
                        'message': 'Winner has been assigned to the next round',
                        'tournament_id': self.tournament.id,
                    }
                }
            )

    def start(self):
        if not self.tournament:
            return
        self.start_time = timezone.now() + timedelta(seconds=30)
        self.status = 'IP'
        self.save()
    
    def increase_score(self, user_id):
        winner = None
        loser = None
        if self.status == 'F':
            return self.winner.id
        if user_id == self.player1.id:
            self.score1 += 1
        elif user_id == self.player2.id:
            self.score2 += 1
        if self.score1 == settings.FINAL_SCORE:
            winner = self.player1.id
            loser = self.player2.id
            self.set_winner(self.player1)
        elif self.score2 == settings.FINAL_SCORE:
            winner = self.player2.id
            loser = self.player1.id
            self.set_winner(self.player2)
        self.save()
        return {"winner": winner, "loser" :loser}
    
    def is_player(self, user_id):
        return self.player1_id == user_id or self.player2_id == user_id
                
    def __str__(self):
        if self.is_tournament_match():
            return f'R{self.round}-{"1" if self.match_number == 0 else "2"}G{self.group}: {self.player1} vs {self.player2}, W: {self.winner}'
        else:
            return f'{self.player1} vs {self.player2}'
        

    # #get all the matches of user
    # def get_user_matches(self, user):
    #     matches = Match.objects.filter(Q(player1=user) | Q(player2=user))
    #     return matches