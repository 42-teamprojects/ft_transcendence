from backend import settings
from .models import User
import os

def delete_orphaned_avatars():
    # get a list of all avatar files that are associated with a user
    used_avatars = [user.avatar.name for user in User.objects.all() if user.avatar]

    # iterate over all files in the avatar directory
    for filename in os.listdir(os.path.join(settings.MEDIA_ROOT, 'avatars')):
        # if the file is not associated with a user, delete it
        if filename not in used_avatars:
            os.remove(os.path.join(settings.MEDIA_ROOT, 'avatars', filename))
            print(f'Deleted orphaned avatar: {filename}')