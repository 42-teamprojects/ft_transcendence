from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from accounts.models import User
from .serializers import UserMeSerializer, UserSerializer

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