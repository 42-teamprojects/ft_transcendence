from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import OneTimePassword
from django.utils import timezone
from accounts.custom_throttles import ResendRateThrottle

from accounts.utils import send_verification


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
            if otp_object: # If OTP is valid
                otp_object.delete()
                if timezone.now() > otp_object.expire_at:
                    return Response({'detail': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
                request.user.is_verified = True
                request.user.save()
                return Response({'detail': 'Email verified successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except OneTimePassword.DoesNotExist:
            raise ValidationError({'detail': 'Invalid OTP'})
        except Exception as e:
            print(e)
            return Response({'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EmailVerificationResendView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ResendRateThrottle]

    def post(self, request):
        is_sent = send_verification(request.user)
        if is_sent:
            return Response({'detail': 'Verification email sent successfully'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Failed to send verification email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)