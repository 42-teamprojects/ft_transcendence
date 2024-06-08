import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async



def get_user_id(scope):
    if not scope["cookies"] or "access" not in scope["cookies"]:
        return None
    access_token = scope["cookies"]["access"]
    try:
        token = UntypedToken(access_token)
        return token.payload['user_id']
    except (InvalidToken, TokenError):
        return None

class MatchMakingConsumer(AsyncWebsocketConsumer):
    loby = []

    async def connect(self):
        self.user_id = get_user_id(self.scope)
        if self.user_id is None:
            await self.close()
            return

        matchmaking_type = self.scope['url_route']['kwargs']['matchmaking_type']
        self.loby.append(self.user_id)

        user_group = f"player_{self.user_id}"
        await self.channel_layer.group_add(user_group, self.channel_name)

        if len(self.loby) >= 2:
            self.player1 = self.loby.pop(0)
            self.player2 = self.loby.pop(0)
        
            #creating a channel for the players
            player1_group = f"player_{self.player1}"
            player2_group = f"player_{self.player2}"
            
            data = {
                "player1": self.player1,
                "player2": self.player2,
                "match_id": f"{self.player1}_{self.player2}"
            }
            
            await self.channel_layer.group_send(player1_group, {"type": "game_message", "data": data})            
            await self.channel_layer.group_send(player2_group, {"type": "game_message", "data": data})

        await self.accept()
    
    async def disconnect(self, close_code):
        if self.user_id in MatchMakingConsumer.loby:
            MatchMakingConsumer.loby.remove(self.user_id)
    
    async def receive(self, text_data):
        pass

    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps({
            "data": data
        }))


class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    connected_users = []
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['match_id']
        self.user_id = get_user_id(self.scope)
        if (self.user_id in GameConsumer.connected_users) or len(GameConsumer.connected_users) > 2:
            await self.close()
            return
        if self.user_id is None:
            await self.close()
            return
        GameConsumer.connected_users.append(self.user_id)
        self.room_group_name = f'game_{self.room_name}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        if len(GameConsumer.connected_users) == 2:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_message",
                    "data": {"type": "game_started"},
                }
            )
        await self.accept()
    

#message type : start_game, player_left, game_update
    async def disconnect(self, close_code):
        if self.user_id in GameConsumer.connected_users:
            GameConsumer.connected_users.remove(self.user_id)
        #semd data to other user that the user has left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_message",
                "data": {"type": "player_left"},
            }
        )

        await self.channel_layer.group_discard( 
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json

        if (data["type"] == "game_update" or data["type"] == "ball_update") or data["type"] == "counter":
            # the data have a sender id send don't send 2 consecutive messages to the same user
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_message",
                    "data": data,
                }
            )
 
    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps(data))

