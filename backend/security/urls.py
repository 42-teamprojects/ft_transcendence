from django.urls import path
from .views import (
    EnableTwoFactorAuthView,
    GetTwoFactorAuthView,
    VerifyTwoFactorAuthView
)

urlpatterns = [
    path('enable-2fa/', EnableTwoFactorAuthView.as_view()),
    path('verify-2fa/', VerifyTwoFactorAuthView.as_view()),
    path('get-2fa/', GetTwoFactorAuthView.as_view()),
]