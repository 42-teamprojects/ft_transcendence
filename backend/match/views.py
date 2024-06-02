from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Match, MatchStatus
from .serializers import MatchSerializer
from accounts.models import User

class MatchView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    queryset = Match.objects.all()

    def create(self, request, *args, **kwargs):
        user = request.user
        user2 = User.objects.filter(~Q(id=user.id)).first()
        
        if not user2:
            return Response({'detail': 'No other user available for Match'}, status=status.HTTP_400_BAD_REQUEST)
        
        match = Match.objects.create(player1=user, player2=user2)
        return Response(self.serializer_class(match).data, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        user = request.user
        matches = Match.objects.filter(Q(player1=user) | Q(player2=user))
        return Response(self.serializer_class(matches, many=True).data, status=status.HTTP_200_OK)
    
    def update_match_status(self, request, new_status, required_status, *args, **kwargs):
        user = request.user
        match = self.get_object()
        if user != match.player1 and user != match.player2:
            return Response({'detail': 'You are not part of this match'}, status=status.HTTP_400_BAD_REQUEST)
        if match.status != required_status:
            return Response({'detail': f'Match is not in the required status: {required_status}'}, status=status.HTTP_400_BAD_REQUEST)
        match.status = new_status
        match.save()
        return Response(self.serializer_class(match).data, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        return self.update_match_status(request, MatchStatus.STARTING, MatchStatus.WAITING, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return self.update_match_status(request, MatchStatus.ONGOING, MatchStatus.STARTING, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        user = request.user
        match = self.get_object()
        if user != match.player1 and user != match.player2:
            return Response({'detail': 'You are not part of this match'}, status=status.HTTP_400_BAD_REQUEST)
        match.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def finish(self, request, *args, **kwargs):
        user = request.user
        match = self.get_object()
        if user != match.player1 and user != match.player2:
            return Response({'detail': 'You are not part of this match'}, status=status.HTTP_400_BAD_REQUEST)
        if match.status != MatchStatus.ONGOING:
            return Response({'detail': 'Match is not ongoing'}, status=status.HTTP_400_BAD_REQUEST)
        match.status = MatchStatus.FINISHED
        match.save()
        return Response(self.serializer_class(match).data, status=status.HTTP_200_OK)
    
    def score(self, request, *args, **kwargs):
        user = request.user
        match = self.get_object()
        if user != match.player1 and user != match.player2:
            return Response({'detail': 'You are not part of this match'}, status=status.HTTP_400_BAD_REQUEST)
        if match.status != MatchStatus.ONGOING:
            return Response({'detail': 'Match is not ongoing'}, status=status.HTTP_400_BAD_REQUEST)
        
        score1 = request.data.get('score1')
        score2 = request.data.get('score2')

        if score1 is None and score2 is None:
            return Response({'detail': 'Score is not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        if score1 is not None:
            match.score1 = score1
            if match.score1 >= settings.SCORE_WINNER:
                match.status = MatchStatus.FINISHED
                match.winner = match.player1
        
        if score2 is not None:
            match.score2 = score2
            if match.score2 >= settings.SCORE_WINNER:
                match.status = MatchStatus.FINISHED
                match.winner = match.player2
        
        match.save()
        return Response(self.serializer_class(match).data, status=status.HTTP_200_OK)
    
    def winner(self, request, *args, **kwargs):
        user = request.user
        match = self.get_object()
        if user != match.player1 and user != match.player2:
            return Response({'detail': 'You are not part of this match'}, status=status.HTTP_400_BAD_REQUEST)
        if match.status != MatchStatus.FINISHED:
            return Response({'detail': 'Match is not finished'}, status=status.HTTP_400_BAD_REQUEST)
        winner = request.data.get('winner')
        if user == match.player1:
            match.winner = match.player1 if winner == 1 else match.player2
        else:
            match.winner = match.player2 if winner == 2 else match.player1
        match.save()
        return Response(self.serializer_class(match).data, status=status.HTTP_200_OK)
