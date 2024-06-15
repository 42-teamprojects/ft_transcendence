from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from backend import settings
from .serializers import MatchSerializer
from .models import Match

class MatchView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    queryset = Match.objects.all()

    def list(self, request, *args, **kwargs):   
        user = request.user
        matches = Match.objects.filter(Q(player1=user) | Q(player2=user), Q(score1__gte=settings.FINAL_SCORE) | Q(score2__gte=settings.FINAL_SCORE), status='F')
        #sort list by status
        matches = sorted(matches, key=lambda x: x.created_at, reverse=True)
        return Response(self.serializer_class(matches, many=True).data, status=status.HTTP_200_OK)
    
    def get_matches_by_user(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        matches = Match.objects.filter(Q(player1_id=user_id) | Q(player2_id=user_id), status='F')
        return Response(self.serializer_class(matches, many=True).data, status=status.HTTP_200_OK)
    