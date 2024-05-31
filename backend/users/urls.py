from django.urls import path
from .views import ChangePasswordView, get_all_users_excluding_me, get_user_data, get_users_by_keyword_excluding_me
from .views import UploadAvatarView, FriendshipView

urlpatterns = [
    path('me/', get_user_data, name='user-data'),
    path('<str:keyword>', get_users_by_keyword_excluding_me, name='users-by-keyword'),
    path('all/', get_all_users_excluding_me, name='users-list'),
    path('set_password/', ChangePasswordView.as_view(), name='change-password'),
    path('avatar/', UploadAvatarView.as_view(), name='upload-avatar'),
    path("friendship/", FriendshipView.as_view(), name="friendship"),

]
