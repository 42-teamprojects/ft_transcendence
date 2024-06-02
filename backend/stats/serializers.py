from rest_framework import serializers
from .models import UserStats

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = ['matches_played', 'matches_won', 'matches_lost', 'tournaments_played', 'tournaments_won', 'tournaments_lost', 'current_win_streak', 'longest_win_streak']

    def update(self, instance, validated_data):
        played = validated_data.get('matches_played', 0)
        win = validated_data.get('matches_won', 0)
        loss = validated_data.get('matches_lost', 0)
        tournament_played = validated_data.get('tournaments_played', 0)
        tournament_win = validated_data.get('tournaments_won', 0)
        tournament_loss = validated_data.get('tournaments_lost', 0)

        instance.matches_played += win + loss 
        instance.matches_won += win
        instance.matches_lost += loss
        instance.tournaments_won += tournament_win
        instance.tournaments_lost += tournament_loss
        instance.tournaments_played += tournament_loss + tournament_win 

        if win:
            instance.matches_played += 1
            instance.current_win_streak += win
            if instance.current_win_streak > instance.longest_win_streak:
                instance.longest_win_streak = instance.current_win_streak
        if loss:
            instance.matches_played += 1
            instance.current_win_streak = 0

        instance.save()
        return instance
    
    def to_representation(self, instance):
        return {
            'matches_played': instance.matches_played,
            'matches_won': instance.matches_won,
            'matches_lost': instance.matches_lost,
            'tournaments_played': instance.tournaments_played,
            'tournaments_won': instance.tournaments_won,
            'tournaments_lost': instance.tournaments_lost,
            'current_win_streak': instance.current_win_streak,
            'longest_win_streak': instance.longest_win_streak
        }