import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Chat
from channels.db import database_sync_to_async
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected to notifications consumer')
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print('disconnected from notifications consumer')
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
 

#
    # def get_recepient_username(self, chatid):
    @database_sync_to_async
    def get_recpient_id(self, chatid, sender_id):
        chat = Chat.objects.get(id=chatid)
        print("user1: ----------------------------", chat.user1.id)
        print("user2: ----------------------------", chat.user2.id)
        if chat.user1.id == sender_id:
            print("returning user2")
            return chat.user2.id
        return chat.user1.id
    

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("got notification: ", data)
        noti_type = data['noti_type']
        info = data['data']
        message = info['message']
        chat_id = info['chat_id']
        sender_id = info['sender_id']
        sender_name = info['sender_name']
        recipient_id = await self.get_recpient_id(chat_id, sender_id)
        self.group_name = f"notifications_{recipient_id}"
        print("recipient_id:-------------------- ", recipient_id)
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'noti_type': noti_type,
                'message': message,
                'chat_id': chat_id,
                'sender_id': sender_id,
                'sender_name': sender_name
            }
        )



    async def notification_message(self, event):
        message = event['message']
        noti_type = event['noti_type']
        chat_id = event['chat_id']
        sender_id = event['sender_id']
        sender_name = event['sender_name']

        await self.send(text_data=json.dumps({
            'message': message,
            'noti_type': noti_type,
            'chat_id': chat_id,
            'sender_id': sender_id,
            'sender_name': sender_name
        }))