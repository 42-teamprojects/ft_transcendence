from django.urls import path
from .views import OAuth2LoginView, OAuth2CallbackView

urlpatterns = [
    path('login/<str:provider>/', OAuth2LoginView.as_view(), name='oauth_login'),
    path('callback/<str:provider>/', OAuth2CallbackView.as_view(), name='oauth_callback'),
]
