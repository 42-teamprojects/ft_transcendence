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
from .serializers import UpdateUserSerializer
from rest_framework import generics

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
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
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
    

class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
    
        if serializer.is_valid():
            username = serializer.data.get("username")
            full_name = serializer.data.get("full_name")
            email = serializer.data.get("email")
    
            if username is not None:
                self.object.username = username
            if full_name is not None:
                self.object.full_name = full_name
            if email is not None:
                self.object.email = email
    
            self.object.save()
    
            return Response({'detail' : 'User updated successfully'}, status=status.HTTP_200_OK)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)