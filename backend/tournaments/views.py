from django.forms import ValidationError
from django.shortcuts import render
from rest_framework import viewsets
from .models import Tournament, TournamentMatch
from .serializers import TournamentSerializer, TournamentMatchSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework import serializers
# Create your views here.
class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    # override the create method to add the organizer to the tournament
    def perform_create(self, serializer):
        try:
            serializer.save(organizer=self.request.user)
        except ValidationError as e:
            raise serializers.ValidationError({'detail': e.message})