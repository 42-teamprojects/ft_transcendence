from django.urls import path
from .views import UpdatePlayerStatsView

urlpatterns = [
    path('', UpdatePlayerStatsView.as_view({'get': 'list', 'post': 'create'})),
    path('<int:pk>/', UpdatePlayerStatsView.as_view({'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})),
    path('<int:pk>/finish/', UpdatePlayerStatsView.as_view({'post': 'finish'})),
    path('<int:pk>/score/', UpdatePlayerStatsView.as_view({'post': 'score'})),
    path('<int:pk>/winner/', UpdatePlayerStatsView.as_view({'post': 'winner'})),
]
