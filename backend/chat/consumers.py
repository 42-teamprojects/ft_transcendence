import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["chat_id"]
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        content = text_data_json["content"]
        sender = text_data_json["sender"]

        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "content": content,
                "sender": sender
            }
        )

    async def chat_message(self, event):
        content = event["content"]
        sender = event["sender"]
        await self.send(text_data=json.dumps({
            "content": content,
            "sender": sender,
        }))

