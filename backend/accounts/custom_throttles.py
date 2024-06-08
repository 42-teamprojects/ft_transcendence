from rest_framework.throttling import UserRateThrottle

class CustomAnonRateThrottle(UserRateThrottle):
    scope = 'anon'

    def get_cache_key(self, request, view):
        email = request.data.get('email')
        return f'{self.scope}_{email}'

    def allow_request(self, request, view):
        # Check if the request is for password reset
        if view.__class__.__name__ in ['ResetPasswordRequestView', 'Reset2FAView']:
            # Throttle only password reset requests
            return super().allow_request(request, view)
        
        # Allow all other requests without throttling
        return True
  
class ResendRateThrottle(UserRateThrottle):
    scope = 'resend'

    def get_cache_key(self, request, view):
        return f'{self.scope}_{request.user.id}'
  
    def allow_request(self, request, view):
        # Check if the request is for email verification resend
        if view.__class__.__name__ in ['EmailVerificationResendView']:
            # Throttle only email verification resend requests
            return super().allow_request(request, view)
        # Allow all other requests without throttling
        return True


class ResetPasswordRateThrottle(UserRateThrottle):
    scope = 'anon'

    def get_cache_key(self, request, view):
        return f'{self.scope}_{request.data.get("email")}'

    def allow_request(self, request, view):
        # Check if the request is for password reset
        if view.__class__.__name__ in ['ResetPasswordConfirmView']:
            # Throttle only password reset requests
            return super().allow_request(request, view)
        
        # Allow all other requests without throttling
        return True