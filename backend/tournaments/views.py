from django.forms import ValidationError
from django.shortcuts import render
from rest_framework import viewsets
from .models import Tournament, TournamentMatch
from .serializers import TournamentSerializer, TournamentMatchSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.decorators import action
# Create your views here.
class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    def get_object(self):
        try:
            return Tournament.objects.get(pk=self.kwargs['pk'])
        except Tournament.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Tournament not found.'})

    # override the create method to add the organizer to the tournament
    def perform_create(self, serializer):
        try:
            serializer.save(organizer=self.request.user)
        except ValidationError as e:
            raise serializers.ValidationError({'detail': e.message})
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        try:
            tournament = self.get_object()
        except serializers.ValidationError as e:
            return Response(e, status=status.HTTP_404_NOT_FOUND)
        try:
            tournament.start()
        except ValidationError as e:
            raise serializers.ValidationError({'detail': e.message})
        return Response({'detail': 'Tournament started successfully.'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        try:
            tournament = self.get_object()
        except serializers.ValidationError as e:
            return Response(e, status=status.HTTP_404_NOT_FOUND)
        try:
            tournament.add_participant(request.user)
        except ValidationError as e:
            raise serializers.ValidationError({'detail': e.message})
        return Response({'detail': 'Participant added successfully.'}, status=status.HTTP_200_OK)
    
    # Get only NS tournaments
    def get_queryset(self):
        return Tournament.objects.filter(status='NS')

    # Get the in-progress tournaments
    @action(detail=False)
    def in_progress(self, request):
        return Response(TournamentSerializer(Tournament.objects.filter(status='IP'), many=True).data, status=status.HTTP_200_OK)
    
    # Get the finished tournaments
    @action(detail=False)
    def finished(self, request):
        return Response(TournamentSerializer(Tournament.objects.filter(status='F'), many=True).data, status=status.HTTP_200_OK)
    
    # Get the matches for a tournament
    @action(detail=True)
    def matches(self, request, pk=None):
        try:
            tournament = self.get_object()
        except serializers.ValidationError as e:
            return Response(e, status=status.HTTP_404_NOT_FOUND)
        return Response(TournamentMatchSerializer(tournament.matches.all(), many=True).data, status=status.HTTP_200_OK)
    