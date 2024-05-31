from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from accounts.models import User
from .serializers import UserMeSerializer, UserSerializer, ChangePasswordSerializer
from rest_framework import status
from accounts.models import User
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from .serializers import AvatarSerializer
from users.serializers import FriendshipSerializer
from rest_framework import serializers
from .permissions import AreFriends
from .models import Friendship

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    serializer = UserMeSerializer(user)
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
    users = User.objects.filter(
        Q(username__icontains=keyword) |
        Q(email__icontains=keyword) |
        Q(full_name__icontains=keyword)
    ).exclude(id=request.user.id)
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
    


class FriendshipView(APIView):
    serializer_class = FriendshipSerializer

    def post(self, request, format=None):
        user1 = request.user
        user2_id = request.data.get('user2')
        friendship = Friendship.objects.filter(Q(user1=user1.id) & Q(user2=user2_id) | Q(user1=user2_id) & Q(user2=user1.id))
        if friendship:
            raise serializers.ValidationError({'detail': "Friendship already exists", 'friendship_id': friendship[0].id})
        if not user2_id:
            raise serializers.ValidationError("user2 field is required.")
        if user1.id == int(user2_id):
            raise serializers.ValidationError("user1 and user2 cannot be the same user.")
        user2 = User.objects.get(pk=user2_id)
        serializer = self.serializer_class(data=request.data)  # Instantiate the serializer with request data
        if serializer.is_valid():
            serializer.save(user1=user1, user2=user2)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlockFriendshipView(APIView):
    serializer_class = FriendshipSerializer
    permission_classes = [AreFriends]

    def post(self, request, friendship_id, format=None):
        friendship = Friendship.objects.get(pk=friendship_id)
        if friendship.is_blocked:
            raise serializers.ValidationError({'detail': "Friendship is already blocked"})
        friendship.is_blocked = True
        friendship.blocked_by = request.user
        friendship.save()
        serializer = self.serializer_class(friendship)
        return Response(serializer.data, status=status.HTTP_200_OK)