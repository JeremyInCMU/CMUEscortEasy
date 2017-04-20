from django.db import models

# Create your models here.
class Client(models.Model):
    AndrewID = models.CharField(max_length=20)
    Email = models.CharField(max_length=50)
    FirstName = models.CharField(max_length=10)
    LastName = models.CharField(max_length=10)
    Address = models.CharField(max_length=50)
    Password = models.CharField(max_length=20)
    Status = models.CharField(max_length=20)

class Escort(models.Model):
    Route = models.CharField(max_length=20)
    BusID = models.CharField(max_length=20)
    Date = models.CharField(max_length=20)
    Time = models.CharField(max_length=20)
    Avaliable = models.CharField(max_length=20)


import datetime
class ReservedSeat(models.Model):
    AndrewID = models.CharField(max_length=20)
    BusID = models.CharField(max_length=20)
    SeatID = models.CharField(max_length=20)
    Date = models.CharField(max_length=20)
    Time = models.CharField(max_length=20)
    Route = models.CharField(max_length=20)



