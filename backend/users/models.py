from django.db import models
from django.conf import settings


# Extending User Model Using a One-To-One Link
class Profile(models.Model):
    user = models.OneToOneField(settings.USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    bio = models.TextField()

    def __str__(self):
        return self.user.username