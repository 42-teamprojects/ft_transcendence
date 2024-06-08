from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from accounts.models import User
from friends.models import Friendship
from .serializers import UserMeSerializer, UserSerializer, ChangePasswordSerializer
from rest_framework import status
from accounts.models import User
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from .serializers import AvatarSerializer
from .serializers import UpdateUserSerializer
from rest_framework import generics
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from rest_framework import status
import re

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_data(request):
    user = request.user
    serializer = UserMeSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request, username):
    try:
        user = User.objects.get(username=username)
        blocked_friendship_exists = Friendship.objects.filter(
            Q(user1=request.user, user2=user, is_blocked=True) | 
            Q(user1=user, user2=request.user, is_blocked=True)
        ).exists()
        if blocked_friendship_exists:
            raise User.DoesNotExist
    except User.DoesNotExist:
        return Response({'detail': 'User not found or you have a blocked friendship with this user'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data)

#get user data by userid
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        blocked_friendship_exists = Friendship.objects.filter(
            Q(user1=request.user, user2=user, is_blocked=True) | 
            Q(user1=user, user2=request.user, is_blocked=True)
        ).exists()
        if blocked_friendship_exists:
            raise User.DoesNotExist
    except User.DoesNotExist:
        return Response({'detail': 'User not found or you have a blocked friendship with this user'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users_excluding_me(request):
    users = User.objects.exclude(id=request.user.id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_keyword_excluding_me(request, keyword):
    blocked_users1 = Friendship.objects.filter(
        Q(user1=request.user, is_blocked=True)
    ).values_list('user2', flat=True)

    blocked_users2 = Friendship.objects.filter(
        Q(user2=request.user, is_blocked=True)
    ).values_list('user1', flat=True)

    blocked_users = list(blocked_users1) + list(blocked_users2)

    users = User.objects.filter(
        Q(username__icontains=keyword) |
        Q(email__icontains=keyword) |
        Q(full_name__icontains=keyword)
    ).exclude(id__in=blocked_users).exclude(id=request.user.id)

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class ChangePasswordView(UpdateAPIView):
        """
        An endpoint for changing password.
        """
        serializer_class = ChangePasswordSerializer
        model = User
        permission_classes = [IsAuthenticated]

        def get_object(self, queryset=None):
            obj = self.request.user
            return obj

        def update(self, request, *args, **kwargs):
            self.object = self.get_object()
            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                # Check old password
                if not self.object.check_password(serializer.data.get("current_password")):
                    return Response({"current_password": ["Wrong password"]}, status=status.HTTP_400_BAD_REQUEST)
                # set_password also hashes the password that the user will get
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()

                return Response({'detail' : 'Password updated successfully'}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UploadAvatarView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request, format=None):
        serializer = AvatarSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj
    
    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(self.object, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)