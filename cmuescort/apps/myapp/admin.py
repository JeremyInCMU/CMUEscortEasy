from django.contrib import admin
from django.contrib import admin
from cmuescort.apps.myapp.models import Client
from cmuescort.apps.myapp.models import ReservedSeat
# Register your models here.
admin.site.register(Client)
admin.site.register(ReservedSeat)
