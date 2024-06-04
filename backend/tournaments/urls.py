from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TournamentViewSet

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]