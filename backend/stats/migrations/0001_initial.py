# Generated by Django 4.2.8 on 2024-06-01 18:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('matches_played', models.PositiveIntegerField(default=0)),
                ('matches_won', models.PositiveIntegerField(default=0)),
                ('matches_lost', models.PositiveIntegerField(default=0)),
                ('tournaments_played', models.PositiveIntegerField(default=0)),
                ('tournaments_won', models.PositiveIntegerField(default=0)),
                ('tournaments_lost', models.PositiveIntegerField(default=0)),
                ('current_win_streak', models.PositiveIntegerField(default=0)),
                ('longest_win_streak', models.PositiveIntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_stats', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]