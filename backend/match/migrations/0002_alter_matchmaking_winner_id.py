# Generated by Django 4.2.8 on 2024-06-02 10:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('match', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchmaking',
            name='winner_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='match_winner', to=settings.AUTH_USER_MODEL),
        ),
    ]