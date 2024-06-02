import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
# from channels.db import database_sync_to_async


class GameConsumer(AsyncWebsocketConsumer):
    loby = []
    async def connect(self):
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
        self.loby.append(self.user_id)
        user_group = f"player_{self.user_id}"
        await self.channel_layer.group_add(
            user_group,
            self.channel_name
        )
        if len(self.loby) >= 2:
            print("connected : ", self.loby, flush=True)
    
            self.player1 = self.loby.pop(0)
            self.player2 = self.loby.pop(0)
            print("loby full", flush=True)
        
            #creating a channel for the players
            player1_group = f"player_{self.player1}"
            player2_group = f"player_{self.player2}"
            
            data = {
                "player1": self.player1,
                "player2": self.player2,
                "match_id": f"{self.player1}_{self.player2}"
            }
            
            await self.channel_layer.group_send(
                player1_group,
                {
                    "type": "game_message",
                    "data": data
                }
            )
            
            await self.channel_layer.group_send(
                player2_group,
                {
                    "type": "game_message",
                    "data": data
                }
            )
                
        
        await self.accept()
    
    async def disconnect(self, close_code):
        GameConsumer.loby.remove(self.user_id)
        print("disco : ", self.loby, flush=True)
        # print("disconnected : ", self.player.username)
    
    async def receive(self, text_data):
        pass

    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps({
            "data": data
        }))

