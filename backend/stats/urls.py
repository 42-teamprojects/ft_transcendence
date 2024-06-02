from django.urls import path
from .views import UpdatePlayerStatsView

urlpatterns = [
    path('', UpdatePlayerStatsView.as_view(), name='update-stats')
]
