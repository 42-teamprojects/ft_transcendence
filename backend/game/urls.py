# urls.py
from django.urls import path
from .views import get_game_session

urlpatterns = [
    path('session/<int:session_id>/', get_game_session),
]
