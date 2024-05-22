from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_('Email is invalid'))
        
    def create_user(self, email, username, full_name, password, **extra_fields):
        if not email:
            raise ValueError(_('Email is required'))
        if not username:
            raise ValueError(_('Username is required'))
        if not full_name:
            raise ValueError(_('Full name is required'))
        if not password:
            raise ValueError(_('Password is required'))
        
        email = self.normalize_email(email)
        self.email_validator(email)
        
        user = self.model(
            email=email,
            username=username,
            full_name=full_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
        
    def create_superuser(self, email, username, full_name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        
        return self.create_user(email, username, full_name, password, **extra_fields)
    
     