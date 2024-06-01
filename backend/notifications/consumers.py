import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Chat
from channels.db import database_sync_to_async
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
 

#
    # def get_recepient_username(self, chatid):
    @database_sync_to_async
    def get_recpient_id(self, chatid, sender_id):
        chat = Chat.objects.get(id=chatid)
        if chat.user1.id == sender_id:
            return chat.user2.id
        return chat.user1.id
    

    async def receive(self, text_data):
        data = json.loads(text_data)
        notification_type = data['notification_type']
        info = data['data']
        message = info['message']
        chat_id = info['chat_id']
        sender_id = info['sender_id']
        sender_name = info['sender_name']
        recipient_id = await self.get_recpient_id(chat_id, sender_id)
        self.group_name = f"notifications_{recipient_id}"
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'notification_type': notification_type,
                'message': message,
                'chat_id': chat_id,
                'sender_id': sender_id,
                'sender_name': sender_name
            }
        )



    async def notification_message(self, event):
        message = event['message']
        notification_type = event['notification_type']
        chat_id = event['chat_id']
        sender_id = event['sender_id']
        sender_name = event['sender_name']

        await self.send(text_data=json.dumps({
            'message': message,
            'notification_type': notification_type,
            'chat_id': chat_id,
            'sender_id': sender_id,
            'sender_name': sender_name
        }))