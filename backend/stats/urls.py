from django.urls import path
from .views import UpdatePlayerStatsView

urlpatterns = [
    path('update-stats/', UpdatePlayerStatsView.as_view(), name='update-stats')
]
