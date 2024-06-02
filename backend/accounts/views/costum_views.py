from ..serializers import PaddleTypeSerializer
from rest_framework.permissions import IsAuthenticated
from ..models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import TableThemeSerializer


class CustomPaddleTypeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = User.objects.get(username=request.user)
        serializer = PaddleTypeSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        user = User.objects.get(username=request.user)
        serializer = PaddleTypeSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomTableThemeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = User.objects.get(username=request.user)
        serializer = TableThemeSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        user = User.objects.get(username=request.user)
        print(request.data)
        serializer = TableThemeSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)