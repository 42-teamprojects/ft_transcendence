import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["chat_id"]
        print(self.channel_name)
        # await self.channel_layer.group_add(
        #     self.room_name,
        #     self.channel_name
        # )
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        await self.send(text_data=json.dumps({"message": self.room_name}))
