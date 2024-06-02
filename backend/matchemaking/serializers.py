from rest_framework import serializers
from .models import MatchMaking



class MatchMakingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchMaking
        fields = '__all__'