from django.urls import path
from .views import MatchView

urlpatterns = [
    path('', MatchView.as_view({'get': 'list'})),
    path('<int:user_id>/', MatchView.as_view({'get': 'get_matches_by_user'}), name='matches_by_user'),
]
