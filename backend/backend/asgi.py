import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

def get_application():
    import chat.routing
    import notifications.routing
    import tournaments.routing
    import game.routing
    return chat.routing.websocket_urlpatterns + notifications.routing.websocket_urlpatterns + tournaments.routing.websocket_urlpatterns + game.routing.websocket_urlpatterns

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            get_application()
        )
    ),
})