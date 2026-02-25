from django.contrib import admin
from .models import Dbtest


@admin.register(Dbtest)
class DbtestAdmin(admin.ModelAdmin):
    list_display = ['activity_id', 'activity_name', 'activity_type', 'distance', 'moving_time']
