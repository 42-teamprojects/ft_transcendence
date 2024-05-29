import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["chat_id"]
        if (self.scope["cookies"] is None) or ("access" not in self.scope["cookies"]):
            await self.close()
            return
        self.access_token = self.scope["cookies"]["access"]
        try:
            UntypedToken(self.access_token)
        
        except (InvalidToken, TokenError):
            await self.close()
            return

        self.user_id = UntypedToken(self.access_token).payload['user_id']
        print("--------------User ID: ", self.user_id)
         


        # self.user_id = UntypedToken(self.access_token).payload['user_id']
        # print("--------------User ID: ", self.user_id)
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
