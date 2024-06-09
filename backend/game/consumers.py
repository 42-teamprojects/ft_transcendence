import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async
from .models import GameSession
from match.models import Match
from accounts.models import User
from asgiref.sync import sync_to_async

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
    async def connect(self):
        self.user_id = get_user_id(self.scope)
        if self.user_id is None:
            await self.close()
            return

        self.session = await self.get_or_create_game_session(self.user_id)

        if self.session is None:
            await self.close()
            return
        user_group = f"player_{self.user_id}"
        await self.channel_layer.group_add(
            user_group,
            self.channel_name
        )

        is_vacant = await sync_to_async(self.get_vacant_session)()
        if not is_vacant:
            player1_id = await sync_to_async(self.get_player1_id)()
            player1_group = f"player_{player1_id}"
            player2_id = await sync_to_async(self.get_player2_id)()
            player2_group = f"player_{player2_id}"

            data = {
                "game_session_id": f"{self.session.id}"
            }

            await self.channel_layer.group_send(player1_group, {"type": "game_message", "data": data})
            await self.channel_layer.group_send(player2_group, {"type": "game_message", "data": data})

        await self.accept()
    
    def get_vacant_session(self):
        return self.session.vacant

    @database_sync_to_async
    def get_or_create_game_session(self, user_id):
        session = GameSession.objects.filter(vacant=True).exclude(match__player1_id=user_id).first()
        if session is None:
            match = Match.objects.create(player1_id=user_id)
            session = GameSession.objects.create(match=match)
        else:
            session.match.player2_id = user_id
            session.match.save()
            session.vacant = False
            session.save()
        return session
    
    def get_player1_id(self):
        return self.session.match.player1.id
    def get_player2_id(self):
        return self.session.match.player2.id
    
    async def disconnect(self, close_code):
        await self.delete_game_session()
        await self.channel_layer.group_discard(
            f"player_{self.user_id}",
            self.channel_name
        )
        is_vacant = await sync_to_async(self.get_vacant_session)()
        if not is_vacant:
            player1_id = await sync_to_async(self.get_player1_id)()
            player1_group = f"player_{player1_id}"
            player2_id = await sync_to_async(self.get_player2_id)()
            player2_group = f"player_{player2_id}"
            await self.channel_layer.group_send(player1_group, {"type": "game_message", "data": {"type": "player_left"}})
            await self.channel_layer.group_send(player2_group, {"type": "game_message", "data": {"type": "player_left"}})
    
    async def receive(self, text_data):
        pass

    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps({
            "data": data
        }))
    
    @database_sync_to_async
    def delete_game_session(self):
        self.session.refresh_from_db()
        if self.session is not None and self.session.vacant:
            self.session.delete()
    


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.user_id = get_user_id(self.scope)
        self.session = await self.get_game_session(self.session_id)

        # is_user_in_session = await self.is_user_in_session(self.user_id)
        # if self.session is None or not is_user_in_session:
        #     await self.close()
        #     return

        await self.channel_layer.group_add(
            self.session_id,
            self.channel_name
        )
        await self.channel_layer.group_send(
            self.session_id,
            {
                "type": "game_message",
                "data": {"type": "game_started"},
            }
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_send(
            self.session_id,
            {
                "type": "game_message",
                "data": {"type": "player_left"},
            }
        )

        await self.channel_layer.group_discard(
            self.session_id,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json
        # get match from session and increase_score, if it returns a winnner then send a message to the group with the winner

        if data["type"] == "increase_score":
            match = await sync_to_async(self.get_match)()
            winner_id = await sync_to_async(match.increase_score)(self.user_id)

            # self.session = await self.get_game_session(self.session_id)
            # if winner_id is None:
            score1 = await sync_to_async(self.get_player1_score)()
            score2 = await sync_to_async(self.get_player2_score)()
            # print(score1, score2, flush=True)
            await self.channel_layer.group_send(
                self.session_id,
                {
                    "type": "game_message",
                    "data": {
                        "type": "score_update",
                        "player1_score": await sync_to_async(self.get_player1_score)(),
                        "player2_score": await sync_to_async(self.get_player2_score)(),
                        "winner_id": winner_id if winner_id is not None else "null"
                    }
                }
            )
            # if winner_id is not None:
            #     await self.channel_layer.group_send(
            #         self.session_id,
            #         {
            #             "type": "game_message",
            #             "data": {"type": "game_over", "winner_id": winner_id},
            #         }
            #     )

        if (data["type"] == "game_update" or data["type"] == "ball_update") or data["type"] == "counter":
            # the data have a sender id send don't se
            # nd 2 consecutive messages to the same user
            await self.channel_layer.group_send(
                self.session_id,
                {
                    "type": "game_message",
                    "data": data,
                }
            )

    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps(data))
    
    # @database_sync_to_async
    # def update_score(self):
    #     try:
    #         return GameSession.objects.get(id=session_id)
    #     except GameSession.DoesNotExist:
    #         return None
        
    @database_sync_to_async
    def get_game_session(self, session_id):
        try:
            return GameSession.objects.get(id=session_id)
        except GameSession.DoesNotExist:
            return None

    async def is_user_in_session(self, user_id):
        player1_id = await sync_to_async(self.get_player1_id)()
        player2_id = await sync_to_async(self.get_player2_id)()
        return player1_id == user_id or player2_id == user_id
    
    def get_player1_id(self):
        return self.session.match.player1.id
    def get_player2_id(self):
        return self.session.match.player2.id
    def get_match(self):
        return self.session.match

    def get_player1_score(self):
        return self.session.match.score1
    
    def get_player2_score(self):
        return self.session.match.score2

