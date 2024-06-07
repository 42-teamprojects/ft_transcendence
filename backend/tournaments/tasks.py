from celery import shared_task

@shared_task
def start_tournament_matches(tournament):
    tournament.start_matches()