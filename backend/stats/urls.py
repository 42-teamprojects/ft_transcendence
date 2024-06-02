from django.urls import path
from .views import UpdatePlayerStatsView

urlpatterns = [
    path('win/', UpdatePlayerStatsView.as_view()),
    path('lose/', UpdatePlayerStatsView.as_view()),
    path('win/tournament/', UpdatePlayerStatsView.as_view()),
    path('lose/tournament/', UpdatePlayerStatsView.as_view()),
]
