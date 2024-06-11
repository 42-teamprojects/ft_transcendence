from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/tournaments/(?P<tournament_id>\w+)/$', consumers.TournamentConsumer.as_asgi()),
    # re_path(r'ws/tournaments/(?P<tournament_id>\w+)/(?P<match_id>\w+)$', consumers.TournamentConsumer.as_asgi())
]
