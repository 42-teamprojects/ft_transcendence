from django.test import TestCase
from django.core.exceptions import ValidationError
from accounts.models import User
from match.models import Match
from .models import Tournament

class TournamentModelTest(TestCase):
    def setUp(self):
        usernames = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15', 'user16']
        emails = ['user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com', 'user5@example.com', 'user6@example.com', 'user7@example.com', 'user8@example.com', 'user9@example.com', 'user10@example.com', 'user11@example.com', 'user12@example.com', 'user13@example.com', 'user14@example.com', 'user15@example.com', 'user16@example.com']
        self.users = [User.objects.create(username=username, email=email) for username, email in zip(usernames, emails)]

    def test_create_tournament(self):
        print("Test: create_tournament")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        self.assertEqual(tournament.status, 'NS')
        self.assertEqual(tournament.total_rounds, None)
        self.assertIn(self.users[0], tournament.participants.all())

    def test_create_tournament_with_same_type(self):
        print("Test: create_tournament_with_same_type")
        Tournament.objects.create(type='4', organizer=self.users[0])
        with self.assertRaises(ValidationError):
            Tournament.objects.create(type='4', organizer=self.users[1])

    def test_create_tournament_with_same_organizer(self):
        Tournament.objects.create(type='4', organizer=self.users[0])
        print("Test: create_tournament_with_same_organizer")
        with self.assertRaises(ValidationError):
            Tournament.objects.create(type='8', organizer=self.users[0])

    def test_create_tournament_with_invalid_type(self):
        print("Test: create_tournament_with_invalid_type")
        with self.assertRaises(ValidationError):
            Tournament.objects.create(type='5', organizer=self.users[0])

    def test_start_tournament(self):
        print("Test: start_tournament")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3])
        tournament.start()
        self.assertEqual(tournament.status, 'IP')
        self.assertEqual(tournament.total_rounds, 2)

    def test_tournament_4_rounds(self):
        print("Test: tournament_4_rounds")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3])
        tournament.start()
        # tournament.print_tree()
        self.assertEqual(tournament.status, 'IP')

    def test_tournament_8_rounds(self):
        print("Test: tournament_8_rounds")
        tournament = Tournament.objects.create(type='8', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3], self.users[4], self.users[5], self.users[6], self.users[7])
        tournament.start()
        # tournament.print_tree()
        self.assertEqual(tournament.status, 'IP')
        self.assertEqual(tournament.total_rounds, 3)

    def test_tournament_16_rounds(self):
        print("Test: tournament_16_rounds")
        tournament = Tournament.objects.create(type='16', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3], self.users[4], self.users[5], self.users[6], self.users[7], self.users[8], self.users[9], self.users[10], self.users[11], self.users[12], self.users[13], self.users[14], self.users[15])
        tournament.start()
        # tournament.print_tree()
        self.assertEqual(tournament.status, 'IP')
        self.assertEqual(tournament.total_rounds, 4)

    def test_create_tournament_with_less_than_required(self):
        print("Test: create_tournament_with_less_than_required")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.participants.add(self.users[1])
        with self.assertRaises(ValidationError):
            tournament.start()

    def test_create_tournament_with_more_than_required(self):
        print("Test: create_tournament_with_more_than_required")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3], self.users[4])
        with self.assertRaises(ValidationError):
            tournament.start()

    def test_add_participant(self):
        print("Test: add_participant")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.add_participant(self.users[1])
        self.assertIn(self.users[1], tournament.participants.all())

    def test_add_participant_to_started_tournament(self):
        print("Test: add_participant_to_started_tournament")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3])
        tournament.start()
        with self.assertRaises(ValidationError):
            tournament.add_participant(self.users[4])

    def test_add_participant_to_full_tournament(self):
        print("Test: add_participant_to_full_tournament")
        tournament = Tournament.objects.create(type='4', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3], self.users[4])
        with self.assertRaises(ValidationError):
            tournament.add_participant(self.users[5])

    def test_print_tree(self):
        print("Test: print_tree")
        tournament = Tournament.objects.create(type='8', organizer=self.users[0])
        tournament.participants.add(self.users[1], self.users[2], self.users[3], self.users[4], self.users[5], self.users[6], self.users[7])
        tournament.start()
        tournament.print_tree()

class TournamentMatchModelTest(TestCase):
    def setUp(self):
        print("Settings up TournamentMatchModelTest")
        usernames = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15', 'user16']
        emails = ['user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com', 'user5@example.com', 'user6@example.com', 'user7@example.com', 'user8@example.com', 'user9@example.com', 'user10@example.com', 'user11@example.com', 'user12@example.com', 'user13@example.com', 'user14@example.com', 'user15@example.com', 'user16@example.com']
        self.users = [User.objects.create(username=username, email=email) for username, email in zip(usernames, emails)]
        self.tournament_4 = Tournament.objects.create(type='4', organizer=self.users[0])
        self.tournament_4.participants.add(self.users[1], self.users[2], self.users[3])
        self.tournament_4.start()
        self.tournament_8 = Tournament.objects.create(type='8', organizer=self.users[0])
        self.tournament_8.participants.add(self.users[1], self.users[2], self.users[3], self.users[4], self.users[5], self.users[6], self.users[7])
        self.tournament_8.start()

    def test_create_match(self):
        print("Test: create_match")
        match = Match.objects.create(tournament=self.tournament_4, round=1, group=1, player1=self.users[0], player2=self.users[1])
        self.assertEqual(match.status, 'NS')
        self.assertEqual(match.winner, None)

    def test_set_winner(self):
        print("Test: set_winner")
        match = Match.objects.create(tournament=self.tournament_4, round=1, group=1, player1=self.users[0], player2=self.users[1])
        match.set_winner(self.users[0])
        self.assertEqual(match.winner, self.users[0])
        self.assertEqual(match.status, 'F')
    
    def test_assign_winner_to_next_round_same_group(self):
        print("Test: assign_winner_to_next_round_same_group")
        match1 = Match.objects.get(tournament=self.tournament_4, round=1, group=1, match_number=0)
        match2 = Match.objects.get(tournament=self.tournament_4, round=1, group=1, match_number=1)
        match1.set_winner(match1.player1)
        match2.set_winner(match2.player2)
        next_round_match = Match.objects.filter(tournament=self.tournament_4, round=2, group=1, match_number=0).first()
        self.assertEqual(next_round_match.player1, match1.player1)
        self.assertEqual(next_round_match.player2, match2.player2)

    def test_assign_winner_to_next_round_different_group(self):
        print("Test: assign_winner_to_next_round_different_group")
        match1 = Match.objects.get(tournament=self.tournament_8, round=1, group=1, match_number=0)
        match2 = Match.objects.get(tournament=self.tournament_8, round=1, group=2, match_number=0)
        match1.set_winner(match1.player1)
        match2.set_winner(match2.player2)
        next_round_match1 = Match.objects.filter(tournament=self.tournament_8, round=2, group=1, match_number=0).first()
        next_round_match2 = Match.objects.filter(tournament=self.tournament_8, round=2, group=1, match_number=1).first()
        self.assertEqual(next_round_match1.player1, match1.player1)
        self.assertEqual(next_round_match2.player1, match2.player2)
    
    def test_assign_winner_to_next_round_to_final(self):
        print("Test: assign_winner_to_next_round_to_final")
        match1_group1 = Match.objects.get(tournament=self.tournament_8, round=1, group=1, match_number=0)
        match2_group1 = Match.objects.get(tournament=self.tournament_8, round=1, group=1, match_number=1)
        match1_group2 = Match.objects.get(tournament=self.tournament_8, round=1, group=2, match_number=0)
        match2_group2 = Match.objects.get(tournament=self.tournament_8, round=1, group=2, match_number=1)
        match1_group1.set_winner(match1_group1.player1)
        match2_group1.set_winner(match2_group1.player1)
        match1_group2.set_winner(match1_group2.player1)
        match2_group2.set_winner(match2_group2.player1)
        # self.tournament_8.print_tree()
        next_round_match1 = Match.objects.filter(tournament=self.tournament_8, round=2, group=1, match_number=0).first()
        next_round_match2 = Match.objects.filter(tournament=self.tournament_8, round=2, group=1, match_number=1).first()
        next_round_match1.set_winner(next_round_match1.player1)
        next_round_match2.set_winner(next_round_match2.player1)
        # self.tournament_8.print_tree()
        final_match = Match.objects.filter(tournament=self.tournament_8, round=3, group=1, match_number=0).first()
        final_match.set_winner(final_match.player1)
        self.tournament_8.refresh_from_db()
        # self.tournament_8.print_tree()
        self.assertEqual(final_match.player1, next_round_match1.player1)
        self.assertEqual(final_match.player2, next_round_match2.player1)
        self.assertEqual(final_match.winner, final_match.player1)
        self.assertEqual(self.tournament_8.winner, final_match.winner)
    
    def test_assign_winner_to_next_round_to_16(self):
        tournament_16 = Tournament.objects.create(type='16', organizer=self.users[0])
        tournament_16.participants.add(self.users[1], self.users[2], self.users[3], self.users[4], self.users[5], self.users[6], self.users[7], self.users[8], self.users[9], self.users[10], self.users[11], self.users[12], self.users[13], self.users[14], self.users[15])
        tournament_16.start()
        
        match1_group1 = Match.objects.get(tournament=tournament_16, round=1, group=1, match_number=0)
        match2_group1 = Match.objects.get(tournament=tournament_16, round=1, group=1, match_number=1)
        match1_group2 = Match.objects.get(tournament=tournament_16, round=1, group=2, match_number=0)
        match2_group2 = Match.objects.get(tournament=tournament_16, round=1, group=2, match_number=1)
        match1_group3 = Match.objects.get(tournament=tournament_16, round=1, group=3, match_number=0)
        match2_group3 = Match.objects.get(tournament=tournament_16, round=1, group=3, match_number=1)
        match1_group4 = Match.objects.get(tournament=tournament_16, round=1, group=4, match_number=0)
        match2_group4 = Match.objects.get(tournament=tournament_16, round=1, group=4, match_number=1)
        
        match1_group1.set_winner(match1_group1.player1)
        match2_group1.set_winner(match2_group1.player1)
        match1_group2.set_winner(match1_group2.player1)
        match2_group2.set_winner(match2_group2.player1)
        match1_group3.set_winner(match1_group3.player1)
        match2_group3.set_winner(match2_group3.player1)
        match1_group4.set_winner(match1_group4.player1)
        match2_group4.set_winner(match2_group4.player1)
        # tournament_16.print_tree()
        next_round_match1 = Match.objects.filter(tournament=tournament_16, round=2, group=1, match_number=0).first()
        next_round_match2 = Match.objects.filter(tournament=tournament_16, round=2, group=1, match_number=1).first()
        next_round_match3 = Match.objects.filter(tournament=tournament_16, round=2, group=2, match_number=0).first()
        next_round_match4 = Match.objects.filter(tournament=tournament_16, round=2, group=2, match_number=1).first()
        next_round_match1.set_winner(next_round_match1.player1)
        next_round_match2.set_winner(next_round_match2.player1)
        next_round_match3.set_winner(next_round_match3.player1)
        next_round_match4.set_winner(next_round_match4.player1)
        # tournament_16.print_tree() 
        next_round_match5 = Match.objects.filter(tournament=tournament_16, round=3, group=1, match_number=0).first()
        next_round_match6 = Match.objects.filter(tournament=tournament_16, round=3, group=1, match_number=1).first()
        next_round_match5.set_winner(next_round_match5.player1)
        next_round_match6.set_winner(next_round_match6.player1)
        # tournament_16.print_tree() 
        final_match = Match.objects.filter(tournament=tournament_16, round=4, group=1, match_number=0).first()
        final_match.set_winner(final_match.player1)
        self.assertEqual(final_match.player1, next_round_match5.player1)
        self.assertEqual(final_match.player2, next_round_match6.player1)
        self.assertEqual(final_match.winner, final_match.player1)
    
    def test_set_invalid_winner(self):
        match = Match.objects.create(tournament=self.tournament_4, round=1, group=1, player1=self.users[0], player2=self.users[1])
        with self.assertRaises(ValidationError):
            match.set_winner(self.users[4])

    def test_assign_winner_to_next_round(self):
        match1 = Match.objects.create(tournament=self.tournament_4, round=1, group=1, match_number=0, player1=self.users[0], player2=self.users[1])
        match2 = Match.objects.create(tournament=self.tournament_4, round=1, group=1, match_number=1, player1=self.users[2], player2=self.users[4])
        match1.set_winner(match1.player1)
        match2.set_winner(match2.player1)
        next_round_match = Match.objects.get(tournament=self.tournament_4, round=2, group=1)
        self.assertEqual(next_round_match.player1, match1.player1)
        self.assertEqual(next_round_match.player2, match2.player1)
