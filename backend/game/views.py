from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GameSession
from .serializers import GameSessionSerializer

@api_view(['GET'])
def get_game_session(request, session_id):
    user_id = request.user.id
    session = GameSession.objects.filter(id=session_id).first()
    if session is not None and session.match.player1.id == user_id or session.match.player2.id == user_id:
        return Response(GameSessionSerializer(session).data)
    return Response({"detail": "Invalid session"}, status=400)