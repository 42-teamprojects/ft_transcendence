from rest_framework import serializers
from .models import Match
from users.serializers import UserSerializer

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        player1 = UserSerializer(instance.player1) if instance.player1 is not None else None
        player2 = UserSerializer(instance.player2) if instance.player2 is not None else None
        if player1 is not None:
            representation['player1'] = player1.data
        if player2 is not None:
            representation['player2'] = player2.data
        return representation
