from django.urls import path
from .views import MatchMakingView

urlpatterns = [
    path('win/', MatchMakingView.as_view({'post': 'win'})),
    path('lost/', MatchMakingView.as_view({'post': 'lose'})),
    path('win/tournament/', MatchMakingView.as_view({'post': 'tournament'})),
    path('lost/tournament/', MatchMakingView.as_view({'post': 'tournament'})),
]
