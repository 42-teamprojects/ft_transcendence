from django.urls import path, re_path
from django.views import View
from .views import (
    JWTRefreshView,
    JWTVerifyView,
    LoginView,
    RegisterView,
    LogoutView,
    OTPVerificationView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('jwt/refresh/', JWTRefreshView.as_view()),
    path('jwt/verify/', JWTVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('verify-email/', OTPVerificationView.as_view(), name='verify-email'),
]
