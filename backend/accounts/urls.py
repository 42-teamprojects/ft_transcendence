from django.urls import path
from accounts.views.auth_views import JWTRefreshView, JWTVerifyView, LoginView, LogoutView, RegisterView
from accounts.views.email_views import EmailVerificationResendView, EmailVerificationView
from accounts.views.password_reset_views import ResetPasswordConfirmView, ResetPasswordRequestView
from accounts.views.custom_views import CustomPaddleTypeView, CustomTableThemeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('jwt/refresh/', JWTRefreshView.as_view()),
    path('jwt/verify/', JWTVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('resend-verify-email/', EmailVerificationResendView.as_view(), name='resend-verify-email'),
    path('reset-password/', ResetPasswordRequestView.as_view(), name='reset-password'),
    path('reset-password-confirm/', ResetPasswordConfirmView().as_view(), name='reset-password-confirm'),
    path('paddle-type/', CustomPaddleTypeView.as_view(), name='paddle-type'),
    path('table-theme/', CustomTableThemeView.as_view(), name='table-theme')
]