from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from accounts.models import User
from rest_framework import status
from accounts.models import User
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.models import Chat
from .serializers import FriendshipSerializer
from rest_framework import serializers
from .permissions import AreFriends
from .models import Friendship
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

class FriendshipViewSet(ModelViewSet):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated, AreFriends]
    

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(
            (Q(user1=user) | Q(user2=user)) & Q(is_blocked=False)
        ).distinct()

    def perform_create(self, serializer):
        user1 = self.request.user
        user2_id = self.request.data.get('user2')
        if not user2_id:
            raise serializers.ValidationError("user2 field is required.")
        if user1.id == int(user2_id):
            raise serializers.ValidationError("user1 and user2 cannot be the same user.")
        
        # Check if the friendship already exists
        friendship_exists = Friendship.objects.filter(
            Q(user1=user1.id, user2=user2_id) | Q(user1=user2_id, user2=user1.id)
        ).exists()

        if friendship_exists:
            raise serializers.ValidationError({'detail': "Friendship already exists"})
        
        user2 = User.objects.get(pk=user2_id)
        serializer.save(user1=user1, user2=user2)

    def destroy(self, request, *args, **kwargs):
        # Retrieve the friendship_id from kwargs
        friendship_id = kwargs.get('pk')
        
        try:
            friendship = Friendship.objects.get(pk=friendship_id)
            if friendship.user1 != request.user and friendship.user2 != request.user:
                raise serializers.ValidationError("You do not have permission to delete this friendship.")
            friendship.delete()
            return Response({'detail': 'Friendship deleted successfully'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            raise serializers.ValidationError("Friendship not found.")
    
    @action(detail=False, methods=['get'])
    def blocked(self, request):
        user = request.user
        blocked_friendships = Friendship.objects.filter(
            (Q(user1=user) | Q(user2=user)) & Q(is_blocked=True) & Q(blocked_by=user)
        ).distinct()
        serializer = self.get_serializer(blocked_friendships, many=True)
        return Response(serializer.data)


class BlockFriendshipView(APIView):
    permission_classes = [IsAuthenticated, AreFriends]

    def post(self, request, friendship_id, format=None):
        try:
            friendship = Friendship.objects.get(pk=friendship_id)
            if friendship.is_blocked:
                raise serializers.ValidationError({'detail': f"Friendship is already blocked by {friendship.blocked_by.username}"})
            friendship.is_blocked = True
            friendship.blocked_by = request.user
            friendship.save()
            
            # Delete all chats between the two users
            Chat.objects.filter(
                Q(user1=request.user, user2=friendship.user2) | 
                Q(user1=friendship.user2, user2=request.user)
            ).delete()
        except Friendship.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Friendship not found'})    
        return Response({'detail': 'Friendship blocked successfully'}, status=status.HTTP_200_OK)
    

class UnblockFriendshipView(APIView):
    permission_classes = [IsAuthenticated, AreFriends]

    def post(self, request, friendship_id, format=None):
        try:
            friendship = Friendship.objects.get(pk=friendship_id)
            if not friendship.is_blocked:
                raise serializers.ValidationError({'detail': 'Friendship is not blocked'})
            friendship.is_blocked = False
            friendship.blocked_by = None
            friendship.save()
        except Friendship.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Friendship not found'})
        return Response({'detail': 'Friendship unblocked successfully'}, status=status.HTTP_200_OK)
