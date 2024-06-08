from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TournamentMatchViewSet, TournamentViewSet

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'tournament-matches', TournamentMatchViewSet)

urlpatterns = [
    path('', include(router.urls)),
]