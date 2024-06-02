from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from .models import UserStats
from .serializers import UserStatsSerializer
from rest_framework.decorators import action

class UpdatePlayerStatsView(APIView):
    serializer_class = UserStatsSerializer
    model = UserStats
        
    def get(self, request):
        stats = request.user.stats
        serializer = UserStatsSerializer(stats)
        return Response(serializer.to_representation(stats))
    
    def put(self, request):
        stats = request.user.user_stats
        serializer = UserStatsSerializer(stats, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.to_representation(stats))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    