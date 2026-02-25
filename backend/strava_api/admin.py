from django.contrib import admin

# Register your models here.
from .models import StravaActivity

admin.site.register(StravaActivity)