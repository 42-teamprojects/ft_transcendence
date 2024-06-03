from django.forms import ValidationError
from django.test import TestCase
from accounts.models import User
from .models import Tournament

class TournamentModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', email="user1@email.com", full_name="userr", password='pass')
        self.user2 = User.objects.create_user(username='user2', email="user2@email.com", full_name="userr", password='pass')
        self.user3 = User.objects.create_user(username='user3', email="user3@email.com", full_name="userr", password='pass')
        self.user4 = User.objects.create_user(username='user4', email="user4@email.com", full_name="userr", password='pass')

    def test_create_tournament(self):
        tournament = Tournament.objects.create(type='4', organizer=self.user1)
        self.assertEqual(tournament.type, '4')
        self.assertEqual(tournament.organizer, self.user1)
        self.assertEqual(tournament.status, 'NS')

    def test_start_tournament(self):
        tournament = Tournament.objects.create(type='4', organizer=self.user1)
        tournament.participants.add(self.user2, self.user3, self.user4)
        tournament.start()
        self.assertEqual(tournament.status, 'IP')

    def test_start_tournament_not_enough_participants(self):
        tournament = Tournament.objects.create(type='4', organizer=self.user1)
        tournament.participants.add(self.user2)
        with self.assertRaises(ValidationError):
            tournament.start()

    def test_start_tournament_already_started(self):
        tournament = Tournament.objects.create(type='4', organizer=self.user1)
        tournament.participants.add(self.user2, self.user3, self.user4)
        tournament.start()
        with self.assertRaises(ValidationError):
            tournament.start()