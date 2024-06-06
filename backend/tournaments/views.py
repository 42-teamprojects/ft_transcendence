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
            if request.user != tournament.organizer:
                return Response({'detail': 'You are not the organizer of this tournament.'}, status=status.HTTP_403_FORBIDDEN)
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
    
    # Get the user's upcoming tournaments, such as the ones they are one of the participants in, that are NS or IP
    @action(detail=False)
    def upcoming_tournaments(self, request):
        return Response(TournamentSerializer(Tournament.objects.filter(status__in=['NS', 'IP'], participants=request.user), many=True).data, status=status.HTTP_200_OK)

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
            if tournament.status == 'NS':
                return Response({'detail': 'Tournament not started yet.'}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as e:
            return Response(e, status=status.HTTP_404_NOT_FOUND)
        return Response(TournamentMatchSerializer(tournament.matches.all(), many=True).data, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        tournament = self.get_object()
        if request.user != tournament.organizer:
            return Response({'detail': 'You are not the organizer of this tournament.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        tournament = self.get_object()
        if request.user != tournament.organizer:
            return Response({'detail': 'You are not the organizer of this tournament.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    
class TournamentMatchViewSet(viewsets.ModelViewSet):
    queryset = TournamentMatch.objects.all()
    serializer_class = TournamentMatchSerializer

    def get_object(self):
        try:
            return TournamentMatch.objects.get(pk=self.kwargs['pk'])
        except TournamentMatch.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Match not found.'})
    
    @action(detail=True, methods=['post'])
    def set_winner(self, request, pk=None):
        try:
            match = self.get_object()
        except serializers.ValidationError as e:
            return Response(e, status=status.HTTP_404_NOT_FOUND)
        try:
            match.set_winner(request.user)
        except ValidationError as e:
            raise serializers.ValidationError({'detail': e.message})
        return Response({'detail': 'Winner set successfully.'}, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        return Response({'detail': 'Method "POST" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def update(self, request, *args, **kwargs):
        return Response({'detail': 'Method "PUT" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response({'detail': 'Method "PATCH" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'Method "DELETE" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)