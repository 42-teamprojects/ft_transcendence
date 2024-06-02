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
    # @database_sync_to_async
    # def get_recpient_id(self, chatid, sender_id):
    #     chat = Chat.objects.get(id=chatid)
    #     if chat.user1.id == sender_id:
    #         return chat.user2.id
    #     return chat.user1.id
    

    async def receive(self, text_data):
        response = json.loads(text_data)
        self.group_name = f"notifications_{response['recipient']}"
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'notification_type': response['type'] or None,
                'data': response['data'] or None,
                'recipient': response['recipient'] or None,
            }
        )



    async def notification_message(self, event):
        type = event['notification_type']
        data = event['data']
        recipient = event['recipient']

        await self.send(text_data=json.dumps({
            'type': type,
            'data': data,
            'recipient': recipient,
        }))