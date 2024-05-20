from django.db import models
from users.models import User
# Create your models here.

class Chat(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2')

    def __str__(self):
        return f'chat between {self.user1} and {self.user2}'

class Message(models.Model):
    content = models.TextField()
    chat_id = models.ForeignKey(Chat, on_delete=models.CASCADE)
    is_seen = models.BooleanField(default=False)
    sender_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'message from {self.sender_id} in {self.chat_id}'