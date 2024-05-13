from django.urls import path
from .views import (
    EnableTwoFactorAuthView,
    VerifyTwoFactorAuthView
)

urlpatterns = [
    path('enable-2fa/', EnableTwoFactorAuthView.as_view()),
    path('verify-2fa/', VerifyTwoFactorAuthView.as_view()),
]