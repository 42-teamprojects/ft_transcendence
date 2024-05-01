# from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .utils import send_otp_email
from .serializers import UserRegisterSerializer
from rest_framework import status
from rest_framework.exceptions import ValidationError

class UserRegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.get_serializer(data=user_data)
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
