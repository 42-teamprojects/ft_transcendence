from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class UserStatus(models.TextChoices):
    ONLINE = 'ON', _('Online')
    OFFLINE = 'OF', _('Offline')
    PLAYING = 'PL', _('Playing')

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(_('Username'), max_length=100, unique=True)
    email = models.EmailField(_('Email Address'), unique=True, max_length=255)
    full_name = models.CharField(_('Full Name'), max_length=100)
    status = models.CharField(_('Status'), max_length=2, choices=UserStatus.choices, default=UserStatus.OFFLINE)
    is_active = models.BooleanField(_('Is Active'), default=True)
    is_staff = models.BooleanField(_('Is Staff'), default=False)
    is_superuser = models.BooleanField(_('Is Superuser'), default=False)
    is_verified = models.BooleanField(_('Is Verified'), default=False)
    date_joined = models.DateTimeField(_('Date Joined'), auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    USERNAME_FIELDS = ['username']
    
    REQUIRED_FIELDS = ['full_name', 'username']
    
    objects = UserManager()
    
    def __str__(self):
        return self.username
    
    @property
    def get_full_name(self):
        return self.full_name
    
    @property
    def get_user_name(self):
        return self.username
    
    def tokens(self):
        pass
    

class OneTimePassword(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.otp
        
    