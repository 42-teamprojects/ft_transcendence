import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Tournament
from channels.db import database_sync_to_async

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["tournament_id"]
        if (self.scope["cookies"] is None) or ("access" not in self.scope["cookies"]):
            await self.close()
            return
        self.access_token = self.scope["cookies"]["access"]
        try:
            #! to replace with access token
            UntypedToken(self.access_token)
        
        except (InvalidToken, TokenError):
            await self.close()
            return

        self.user_id = UntypedToken(self.access_token).payload['user_id']

        # if not await self.is_user_in_tournament(self.user_id, self.room_name):
        #     await self.close()
        #     return

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "tournament_update",
                "data": text_data_json, 
            }
        )

    async def tournament_update(self, event):
        await self.send(text_data=json.dumps({
            "data": event["data"],
        }))
        pass

    @database_sync_to_async
    def is_user_in_tournament(self, user, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id, participants=user)
        except Tournament.DoesNotExist:
            return False

