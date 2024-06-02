from django.urls import path
from .views import MatchMakingView

urlpatterns = [
    path('', MatchMakingView.as_view({'get': 'list', 'post': 'create'})),
    path('<int:pk>/', MatchMakingView.as_view({'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})),
    path('<int:pk>/finish/', MatchMakingView.as_view({'post': 'finish'})),
    path('<int:pk>/score/', MatchMakingView.as_view({'post': 'score'})),
    path('<int:pk>/winner/', MatchMakingView.as_view({'post': 'winner'})),
]
