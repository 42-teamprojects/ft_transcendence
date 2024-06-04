from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Tournament, TournamentMatch

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['status', 'winner', 'participants', 'organizer', 'total_rounds']

class TournamentMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentMatch
        fields = '__all__'
