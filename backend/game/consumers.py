import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async

from notifications.models import Notification
from .models import GameSession
from match.models import Match
from accounts.models import User
from asgiref.sync import sync_to_async
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
from datetime import timedelta

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




""" 
    MatchMakingConsumer
"""
class MatchMakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.initialize_match_variables()
        if not await self.authorize_user():
            await self.close(code=401, reason="Unauthorized")
            return
        
        if self.is_friendly:
            self.session = await self.get_or_create_private_game_session(self.p1_id, self.p2_id)
        elif self.is_tournament:
            self.session = await self.get_or_create_tournament_game_session(self.match_id) 
        else:
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
    
    def initialize_match_variables(self):
        self.p1_id = self.scope['url_route']['kwargs'].get('p1_id')
        self.p2_id = self.scope['url_route']['kwargs'].get('p2_id')
        self.match_id = self.scope['url_route']['kwargs'].get('match_id')
        self.user_id = get_user_id(self.scope)
        
        self.is_friendly = False
        self.is_random = False
        self.is_tournament = False
        if self.p1_id is not None and self.p2_id is not None:
            self.is_friendly = True
        elif self.match_id is not None:
            self.is_tournament = True
        else:
            self.is_random = True
    
    async def authorize_user(self):
        if self.user_id is None:
            return False
        elif self.is_friendly and (int(self.user_id) != int(self.p1_id) and int(self.user_id) != int(self.p2_id)):
            return False
        elif self.is_tournament:
            match = await sync_to_async(Match.objects.get)(pk=self.match_id)
            if not match.is_player(self.user_id) and match.status != "IP":
                return False
        return True
    
    def get_vacant_session(self):
        return self.session.vacant
    
    @database_sync_to_async
    def get_or_create_game_session(self, user_id):
        session = GameSession.objects.filter(vacant=True, private=False).exclude(match__player1_id=user_id).first()
        if session is None:
            match = Match.objects.create(player1_id=user_id)
            session = GameSession.objects.create(match=match)
        else:
            session.match.player2_id = user_id
            session.match.save()
            session.vacant = False
            session.save()
        return session
    
    @database_sync_to_async
    def get_or_create_private_game_session(self, p1_id, p2_id):
        session = GameSession.objects.filter(vacant=True, private=True).filter(
            Q(match__player1_id=p1_id, match__player2_id=p2_id) |
            Q(match__player1_id=p2_id, match__player2_id=p1_id)
        ).first()
        if session is None:
            match = Match.objects.create(player1_id=p1_id, player2_id=p2_id)
            session = GameSession.objects.create(match=match, private=True)
        else:
            session.vacant = False
            session.save()
        return session
    
    @database_sync_to_async
    def get_or_create_tournament_game_session(self, match_id):
        session = GameSession.objects.filter(vacant=True, private=True, match_id=match_id).first()
        if session is None:
            match = Match.objects.get(id=match_id)
            session = GameSession.objects.create(match=match, private=True)
        else:
            session.vacant = False
            session.save()
        return session
    
    def get_player1_id(self):
        return self.session.match.player1.id
    def get_player2_id(self):
        return self.session.match.player2.id
    
    async def disconnect(self, close_code):
        await self.delete_game_session()
        is_vacant = await sync_to_async(self.get_vacant_session)()
        if not is_vacant:
            player1_id = await sync_to_async(self.get_player1_id)()
            player1_group = f"player_{player1_id}"
            player2_id = await sync_to_async(self.get_player2_id)()
            player2_group = f"player_{player2_id}"
            await self.channel_layer.group_send(player1_group, {"type": "game_message", "data": {"type": "player_left"}})
            await self.channel_layer.group_send(player2_group, {"type": "game_message", "data": {"type": "player_left"}})
        await self.channel_layer.group_discard(
            f"player_{self.user_id}",
            self.channel_name
        )
    
    async def receive(self, text_data):
        # No need for a recieve method in this consumer, so we just pass
        pass

    async def game_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps({
            "data": data
        }))
    
    @database_sync_to_async
    def delete_game_session(self):
        if self.session is not None:
            self.session.refresh_from_db()
        if self.session is not None and self.session.vacant:
            self.session.delete()

""" 
    GameConsumer
"""
class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.user_id = get_user_id(self.scope)
        self.session = await self.get_game_session(self.session_id)
        print("user connected for game", self.user_id, flush=True)
        # is_user_in_session = await self.is_user_in_session(self.user_id)
        if self.session is None:
            await self.close()
            return

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
        #the other player
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
        player1_id = await sync_to_async(self.get_player1_id)()
        player2_id = await sync_to_async(self.get_player2_id)()
        match = await sync_to_async(self.get_match)()

        winner_from_db = await sync_to_async(match.get_winner)()


        if player1_id == self.user_id:
            winner_id = player2_id
        elif player2_id == self.user_id:
            winner_id = player1_id

        if winner_from_db is None:
            try:
                await sync_to_async(match.set_winner_by_id)(winner_id)
            except Exception as e:
                print("erorr: ", e, flush=True)
        else:
            pass
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json
        # get match from session and increase_score, if it returns a winnner then send a message to the group with the winner
        if data["type"] == "increase_score":
            match = await sync_to_async(self.get_match)()
            users = await sync_to_async(match.increase_score)(self.user_id)
            winner_id = users.get("winner")
            loser_id = users.get("loser")

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
            if winner_id is not None:
                winner = await sync_to_async(User.objects.get)(id=winner_id)
                loser = await sync_to_async(User.objects.get)(id=loser_id)
                await self.update_winner_stats(winner)
                await self.update_loser_stats(loser)

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
        try:
            await self.send(text_data=json.dumps(data))
        except Exception as e:
            print("Error: ", e, flush=True)
    
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
        self.session.refresh_from_db()
        return self.session.match

    def get_player1_score(self):
        return self.session.match.score1
    
    def get_player2_score(self):
        return self.session.match.score2
    
    def get_winner(self):
        return self.session.match.winner
    
    @sync_to_async
    def update_winner_stats(self, winner):
        winner.user_stats.matches_played += 1
        winner.user_stats.matches_won += 1
        winner.user_stats.current_win_streak += 1
        winner.user_stats.longest_win_streak = max(winner.user_stats.longest_win_streak, winner.user_stats.current_win_streak)
        winner.user_stats.save()

    @sync_to_async
    def update_loser_stats(self, loser):
        loser.user_stats.matches_played += 1
        loser.user_stats.matches_lost += 1
        loser.user_stats.current_win_streak = 0
        loser.user_stats.save()