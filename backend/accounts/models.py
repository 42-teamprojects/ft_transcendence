from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

from stats.models import UserStats
from .managers import UserManager
import os
from backend import settings
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime

def avatar_upload_to(instance, filename):
    return f'avatars/{instance.username}.png'

class UserStatus(models.TextChoices):
    ONLINE = 'ON', _('Online')
    OFFLINE = 'OF', _('Offline')
    PLAYING = 'PL', _('Playing')


class PaddleType(models.TextChoices):
    Basic = 'B', _('Basic')
    FIRE = 'F', _('Fire')
    Ice = 'I', _('Ice')

class TableTheme(models.TextChoices):
    Classic = 'C', _('Classic')
    Standard = 'S', _('Standard')
    Football = 'F', _('Football')

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
    secret_key = models.CharField(_('Secret Key'), max_length=100, blank=True, null=True)
    two_factor_enabled = models.BooleanField(_('Two Factor Enabled'), default=False)
    last_2fa_login = models.DateTimeField(_('Last 2FA Login'), blank=True, null=True)
    provider = models.CharField(_('Provider'), max_length=100, blank=True, null=True)
    avatar = models.ImageField(upload_to=avatar_upload_to, null=True, blank=True)
    paddle_type = models.CharField(_('Paddle Type'), max_length=1, choices=PaddleType.choices, default=PaddleType.Basic)
    table_theme = models.CharField(_('Table Theme'), max_length=1, choices=TableTheme.choices, default=TableTheme.Standard)
    user_stats = models.OneToOneField(UserStats, on_delete=models.CASCADE, null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['full_name', 'email']
    
    objects = UserManager()
    
    def save(self, *args, **kwargs):
        # If the user is being created (i.e., it doesn't have an ID yet), create a UserStats instance for it
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.user_stats:
            UserStats.objects.create()
            self.user_stats = UserStats.objects.latest('id')
            self.save()
    
    def __str__(self):
        return self.username
    
    @property
    def get_full_name(self):
        return self.full_name
    
    @property
    def get_user_name(self):
        return self.username
    
    @property
    def get_user_stats(self):
        return self.user_stats
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        access_token = refresh.access_token
        
        return {
            'refresh': str(refresh),
            'access': str(access_token)
        }
    


class OneTimePassword(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Set on_delete to CASCADE
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(_('created At'), auto_now_add=True)
    expire_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.otp}'
    
    @property
    def is_expired(self):
        if self.expire_at:
            return self.expire_at < datetime.now()
        return False
    

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    is_used = models.BooleanField(default=False)