# Generated by Django 4.2.8 on 2024-06-02 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userstats',
            name='friends_count',
            field=models.PositiveIntegerField(default=0),
        ),
    ]