# Generated by Django 4.2.8 on 2024-06-02 13:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stats', '0002_userstats_friends_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userstats',
            name='friends_count',
        ),
        migrations.AlterField(
            model_name='userstats',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_stats', to=settings.AUTH_USER_MODEL),
        ),
    ]