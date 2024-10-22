# Generated by Django 4.2.8 on 2024-06-09 09:03

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
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('4', '4-players'), ('8', '8-players'), ('16', '16-players')], max_length=2)),
                ('status', models.CharField(choices=[('NS', 'Not Started'), ('IP', 'In Progress'), ('F', 'Finished'), ('C', 'Cancelled')], default='NS', max_length=2)),
                ('total_rounds', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('start_time', models.DateTimeField(null=True)),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organized_tournaments', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(related_name='tournaments', to=settings.AUTH_USER_MODEL)),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='won_tournaments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
