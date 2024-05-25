from rest_framework.throttling import UserRateThrottle

class PasswordResetThrottle(UserRateThrottle):
    scope = 'password_reset'

    def get_cache_key(self, request, view):
        email = request.data.get('email')
        return f'{self.scope}_{email}'

    def allow_request(self, request, view):
        # Check if the request is for password reset
        if view.__class__.__name__ in ['ResetPasswordRequestView', 'ResetPasswordConfirmView']:
            # Throttle only password reset requests
            return super().allow_request(request, view)
        
        # Allow all other requests without throttling
        return True
  
class EmailVerificationThrottle(UserRateThrottle):
    scope = 'email_verification'

    def get_cache_key(self, request, view):
        return f'{self.scope}_{request.user.id}'

    def allow_request(self, request, view):
        # Check if the request is for email verification
        if view.__class__.__name__ == 'EmailVerificationView':
            # Throttle only email verification requests
            return super().allow_request(request, view)
        
        # Allow all other requests without throttling
        return True