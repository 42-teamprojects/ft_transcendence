from rest_framework import serializers
from .models import GameSession
from match.serializers import MatchSerializer

class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = '__all__'

    # to representation of the model
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['match'] = MatchSerializer(instance.match).data
        return representation