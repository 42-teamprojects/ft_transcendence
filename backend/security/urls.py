from django.urls import path
from security.views.reset_two_factor_views import Reset2FAView
from security.views.two_factor_views import (
    DisableTwoFactorAuthView,
    EnableTwoFactorAuthView,
    GetTwoFactorAuthView,
    VerifyTwoFactorAuthView
)

urlpatterns = [
    path('enable-2fa/', EnableTwoFactorAuthView.as_view()),
    path('verify-2fa/', VerifyTwoFactorAuthView.as_view()),
    path('get-2fa/', GetTwoFactorAuthView.as_view()),
    path('reset-2fa/', Reset2FAView.as_view()),
    path('disable-2fa/', DisableTwoFactorAuthView.as_view()),
]