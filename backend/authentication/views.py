# from django.shortcuts import render
from multiprocessing import context
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .utils import send_otp_email
from .serializers import LoginSerializer, RegisterSerializer
from rest_framework import status
from rest_framework.exceptions import ValidationError


# Register View
class RegisterView(GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        user = serializer.data
        # send_otp_email(user['email'])

        return Response({
            'user': user,
            'message': 'User Created Successfully. Check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)

# Login View
class LoginView(GenericAPIView):
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.data, status=status.HTTP_200_OK)