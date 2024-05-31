import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected to notifications consumer')
        self.username = self.scope['url_route']['kwargs']['username']
        self.group_name = f'notifications_{self.username}'
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


    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     message = data['message']
    #     await self.channel_layer.group_send(
    #         self.group_name,
    #         {
    #             'type': 'notification_message',
    #             'message': message
    #         }
    #     )

    # async def notification_message(self, event):
    #     message = event['message']
    #     await self.send(text_data=json.dumps({
    #         'message': message
    #     }))