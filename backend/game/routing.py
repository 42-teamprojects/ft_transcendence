from django.urls import re_path
from .import consumers

websocket_urlpatterns = [
    re_path(r'ws/match-making/', consumers.MatchMakingConsumer.as_asgi()),
    re_path(r'ws/private-match-making/(?P<p1_id>\w+)/(?P<p2_id>\w+)/$', consumers.MatchMakingConsumer.as_asgi()),
    re_path(r'ws/tournament-match-making/(?P<match_id>\w+)/$', consumers.MatchMakingConsumer.as_asgi()),
    re_path(r'ws/match/(?P<session_id>\w+)/$', consumers.GameConsumer.as_asgi()),
]