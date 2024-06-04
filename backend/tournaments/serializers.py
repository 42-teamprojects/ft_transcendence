from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Tournament, TournamentMatch

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['status', 'winner', 'participants', 'organizer', 'total_rounds']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['participants'] = UserSerializer(instance.participants, many=True).data
        return representation

class TournamentMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentMatch
        fields = '__all__'
