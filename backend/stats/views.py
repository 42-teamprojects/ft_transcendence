from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserStats
from .serializers import UserStatsSerializer

class UpdatePlayerStatsView(generics.GenericAPIView):
    serializer_class = UserStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserStats.objects.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        user_stats = self.get_queryset().first()
        if user_stats is None:
            user_stats = UserStats(user=self.request.user)
            user_stats.save()

        if 'win' in self.request.path:
            user_stats.matches_won += 1
            user_stats.current_win_streak += 1
            if user_stats.current_win_streak > user_stats.longest_win_streak:
                user_stats.longest_win_streak = user_stats.current_win_streak
        elif 'lose' in self.request.path:
            user_stats.matches_lost += 1
            user_stats.current_win_streak = 0

        if 'tournament' in self.request.path:
            if 'win' in self.request.path:
                user_stats.tournaments_won += 1
            elif 'lose' in self.request.path:
                user_stats.tournaments_lost += 1
            user_stats.tournaments_played += 1
        else:
            user_stats.matches_played += 1  

        user_stats.save()
        serializer = UserStatsSerializer(user_stats)
        return Response(serializer.data, status=status.HTTP_200_OK)