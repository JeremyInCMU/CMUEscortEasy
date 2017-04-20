# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('AndrewID', models.CharField(max_length=20)),
                ('Email', models.CharField(max_length=50)),
                ('FirstName', models.CharField(max_length=10)),
                ('LastName', models.CharField(max_length=10)),
                ('Address', models.CharField(max_length=50)),
                ('Password', models.CharField(max_length=20)),
                ('Status', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Escort',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('Route', models.CharField(max_length=20)),
                ('BusID', models.CharField(max_length=20)),
                ('Date', models.CharField(max_length=20)),
                ('Time', models.CharField(max_length=20)),
                ('Avaliable', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='ReservedSeat',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('AndrewID', models.CharField(max_length=20)),
                ('BusID', models.CharField(max_length=20)),
                ('SeatID', models.CharField(max_length=20)),
                ('Date', models.CharField(max_length=20)),
                ('Time', models.CharField(max_length=20)),
                ('Route', models.CharField(max_length=20)),
            ],
        ),
    ]
