
from django.core.management.base import BaseCommand
from django.utils import timezone
from tournaments.models import Tournament

class Command(BaseCommand):
    help = 'Starts the matches of tournaments whose start time has passed'

    def handle(self, *args, **options):
        tournaments = Tournament.objects.filter(status='IP', start_time__lte=timezone.now())
        for tournament in tournaments:
            tournament.start_matches()
            self.stdout.write(self.style.SUCCESS('Successfully started matches for tournament "%s"' % tournament.name))