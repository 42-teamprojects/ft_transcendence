from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import OneTimePassword


class EmailVerificationView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        otp = request.data.get('otp')
        if not otp:
            return Response({'detail': 'OTP is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Fetch the OTP object using both the OTP and User
            otp_object = OneTimePassword.objects.get(otp=otp, user=request.user)

            # Verify the OTP
            if otp_object:
                otp_object.delete()
                if not request.user.is_verified:
                    request.user.is_verified = True
                    request.user.save()
                    return Response({'detail': 'Email Verified Successfully'}, status=status.HTTP_200_OK)
                return Response({'detail': 'Email Already Verified'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': 'Invalid OTP or Email'}, status=status.HTTP_400_BAD_REQUEST)
        except OneTimePassword.DoesNotExist:
            return Response({'detail': 'Invalid OTP or Email'}, status=status.HTTP_400_BAD_REQUEST)
        
