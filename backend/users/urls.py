from django.urls import path
from users.views.auth_views import JWTRefreshView, JWTVerifyView, LoginView, LogoutView, RegisterView
from users.views.email_views import EmailVerificationView
from users.views.password_reset_views import ResetPasswordConfirmView, ResetPasswordRequestView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('jwt/refresh/', JWTRefreshView.as_view()),
    path('jwt/verify/', JWTVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('reset-password/', ResetPasswordRequestView.as_view(), name='reset-password'),
    path('reset-password-confirm/', ResetPasswordConfirmView().as_view(), name='reset-password-confirm')
]