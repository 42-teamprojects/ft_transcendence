import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Chat
from accounts.models import User, UserStatus
from channels.db import database_sync_to_async
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'
        self.group_name_all = 'all_users'
        await self.channel_layer.group_add(
            self.group_name_all,
            self.channel_name
        )
            
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.set_status_update()
        

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        await self.set_offline_status()


    async def receive(self, text_data):
        response = json.loads(text_data)
        if response['type'] != 'NEW_STATUS' and response['type'] != 'TOURNAMENT_UPDATE':
            self.group_name = f"notifications_{response['recipient']}"
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'notification_message',
                    'id' : response['id'] if 'id' in response else None,
                    'notification_type': response['type'] or None,
                    'data': response['data'] or None,
                    'recipient': response['recipient'] or None,
                }
            )
        elif response['type'] == 'TOURNAMENT_UPDATE':
            await self.channel_layer.group_send(
                self.group_name_all,
                {
                    'type': 'tournament_update',
                    'data': response['data'],
                }
            )
        else:
            await self.channel_layer.group_send(
                self.group_name_all,
                {
                    'type': 'new_status_update',
                    'user_id': self.user_id,
                    'status': response['status'],
                }
            )
        
    async def notification_message(self, event):
        notification_type = event['notification_type']
        data = event['data']
        recipient = event['recipient']

        await self.send(text_data=json.dumps({
            'type': notification_type,
            'id' : event['id'] if 'id' in event else None,
            'data': data,
            'recipient': recipient,
        }))
        
    async def new_status_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'NEW_STATUS',
            'user_id': event['user_id'],
            'status': event['status']
        }))
    
    async def tournament_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'TOURNAMENT_UPDATE',
            'data': event['data'],
        }))
        
    @database_sync_to_async
    def set_status_update(self):
        user = User.objects.get(id=self.user_id)
        user.status = UserStatus.ONLINE
        user.save()
    
    @database_sync_to_async
    def set_offline_status(self):
        user = User.objects.get(id=self.user_id)
        user.status = UserStatus.OFFLINE
        user.save()
