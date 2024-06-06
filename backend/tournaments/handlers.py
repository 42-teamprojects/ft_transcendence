# from django.dispatch import receiver
# from django.utils import timezone
# from datetime import timedelta
# from django.core.mail import send_mail
# from .models import Tournament
# from .signals import tournament_full
# from backend import settings

# @receiver(tournament_full)
# def on_tournament_full(sender, **kwargs):
#     tournament = kwargs['tournament']
#     tournament.start()