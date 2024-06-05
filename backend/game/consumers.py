import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
# from channels.db import database_sync_to_async

class GameState:
    def __init__(self):
        self.paddle_1_y = 0
        self.paddle_2_y = 0
        self.ball_x = 0
        self.ball_y = 0

    def reset(self):
        self.paddle_1_y = 0
        self.paddle_2_y = 0
        self.ball_x = 0
        self.ball_y = 0

    @property
    def state(self):
        return {
            "type": "game_update",
            "paddle_1_y": self.paddle_1_y,
            "paddle_2_y": self.paddle_2_y,
            "ball_x": self.ball_x,
            "ball_y": self.ball_y
        }
    
    @state.setter
    def state(self, data):
        self.paddle_1_y = data["paddle_1_y"]
        self.paddle_2_y = data["paddle_2_y"]
        self.ball_x = data["ball_x"]
        self.ball_y = data["ball_y"]


def get_user_id(scope):
    if (scope["cookies"] is None) or ("access" not in scope["cookies"]):
        return None
    access_token = scope["cookies"]["access"]
    try:
        #! to replace with access token
        UntypedToken(access_token)
    
    except (InvalidToken, TokenError):
        return None

    return UntypedToken(access_token).payload['user_id']

class MatchMakingConsumer(AsyncWebsocketConsumer):
    loby = []
    async def connect(self):

        self.user_id = get_user_id(self.scope)
        if self.user_id is None:
            await self.close()
            return
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
        if self.user_id in MatchMakingConsumer.loby:
            MatchMakingConsumer.loby.remove(self.user_id)
        print("disco : ", self.loby, flush=True)
        # print("disconnected : ", self.player.username)
    
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
        self.paddle_1_y = 110
        self.paddle_2_y = 110
        self.ball_x = 0
        self.ball_y = 0

    connected_users = []
    game_session = GameState()
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['match_id']
        self.user_id = get_user_id(self.scope)
        if (self.user_id in GameConsumer.connected_users) or len(GameConsumer.connected_users) > 2:
            print("room full")
            await self.close()
            return
        if self.user_id is None:
            await self.close()
            return
        GameConsumer.connected_users.append(self.user_id)
        print(f"user {self.user_id} connected to room {self.room_name} , playing users = {GameConsumer.connected_users}", flush=True)
        self.room_group_name = f'game_{self.room_name}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        if len(GameConsumer.connected_users) >= 2:
            print(f"connected 2 users : {GameConsumer.connected_users}", flush=True)
        

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_message",
                    "data": {"type": "game_started", "paddle_1_y": self.paddle_1_y},
                }
            )
        await self.accept()
    

#message type : start_game, player_left, game_update
    async def disconnect(self, close_code):
        if len(GameConsumer.connected_users) == 0:
            GameConsumer.data.reset()

        if self.user_id in GameConsumer.connected_users:
            GameConsumer.connected_users.remove(self.user_id)
        print(f"user {self.user_id} disconnected from room {self.room_name}", flush=True)
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
        print(f"users left = {GameConsumer.connected_users}", flush=True)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # print(text_data_json, flush=True)
        data = text_data_json
        
        # GameState.state = data

        print(data, flush=True)

        # print(data["type"], flush=True) 
        if (data["type"] == "game_update"):
            if data["action"] == "move-up":
                self.paddle_1_y -= 10
            if data["action"] == "move-down":
                self.paddle_1_y += 10
            
            state = {
                "type": "game_update",
                "paddle_1_y": self.paddle_1_y,
                "ball_x": self.ball_x,
                "ball_y": self.ball_y
            }
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_message",
                    "data": state,
                }
            )

    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps(data))