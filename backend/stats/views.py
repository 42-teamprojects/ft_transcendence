from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import UserStats
from .serializers import PlayerStatsSerializer
from django.http import Http404

class UpdatePlayerStatsView(APIView):
    serializer_class = PlayerStatsSerializer
    model = UserStats
    permission_classes = [IsAuthenticated]

    def get_object(self, user):
        try:
            return UserStats.objects.get(user=user)
        except UserStats.DoesNotExist:
            stats = UserStats(user=user)
            stats.save()
            return stats
        
    def get(self, request):
        stats = self.get_object(request.user)
        serializer = PlayerStatsSerializer(stats)
        return Response(serializer.to_representation(stats))
    
    def put(self, request):
        stats = self.get_object(request.user)
        serializer = PlayerStatsSerializer(stats, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.to_representation(stats))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    