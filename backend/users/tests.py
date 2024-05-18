from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import OneTimePassword
from users.utils import verify_otp

User = get_user_model()

class OTPVerificationTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create(username='hamza', email='talhaouiah@gmail.com.com')
        # Create a test OTP for the user
        self.otp = OneTimePassword.objects.create(user=self.user, otp='098041')

    def test_successful_verification(self):
        # Verify OTP with correct OTP
        result = verify_otp(self.user, '098041')
        self.assertTrue(result)

    def test_unsuccessful_verification(self):
        # Verify OTP with incorrect OTP
        result = verify_otp(self.user, '654321')
        self.assertFalse(result)

    def test_invalid_user(self):
        # Verify OTP for non-existent user
        result = verify_otp(None, '098041')
        self.assertFalse(result)

    def test_missing_otp(self):
        # Verify OTP with missing OTP
        result = verify_otp(self.user, '')
        self.assertFalse(result)
