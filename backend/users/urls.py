from django.urls import path
from .views import ChangePasswordView, get_all_users_excluding_me, get_my_data, get_user_data, get_users_by_keyword_excluding_me, get_user_data_by_id
from .views import UploadAvatarView, UpdateUserView

urlpatterns = [
    path('me/', get_my_data, name='my-data'),
    path('search/<str:keyword>', get_users_by_keyword_excluding_me, name='users-by-keyword'),
    path('all/', get_all_users_excluding_me, name='users-list'),
    path('set_password/', ChangePasswordView.as_view(), name='change-password'),
    path('avatar/', UploadAvatarView.as_view(), name='upload-avatar'),
    path('<str:username>/', get_user_data, name='user-data'),
    path('get/<int:user_id>/', get_user_data_by_id, name='user-data'),
    path('', UpdateUserView.as_view(), name='update_user'),    
]
