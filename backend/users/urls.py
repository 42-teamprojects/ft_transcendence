from django.urls import path
from .views import get_all_users_excluding_me, get_user_data, get_users_by_keyword_excluding_me

urlpatterns = [
    path('me/', get_user_data, name='user-data'),
    path('<str:keyword>', get_users_by_keyword_excluding_me, name='users-by-keyword'),
    path('all/', get_all_users_excluding_me, name='users-list'),
]
