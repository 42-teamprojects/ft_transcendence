from django.urls import re_path
from .import consumers

websocket_urlpatterns = [
    re_path(r'ws/match-making/(?P<room_id>\w+)/$', consumers.MatchMakingConsumer.as_asgi()),
    re_path(r'ws/match/(?P<match_id>\w+)/$', consumers.GameConsumer.as_asgi()),
]