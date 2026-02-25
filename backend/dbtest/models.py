from django.db import models
from django.utils import timezone

class Dbtest(models.Model):
   activity_id          = models.IntegerField(primary_key=True)
   activity_name        = models.CharField(max_length=255)
   activity_type        = models.CharField(max_length=255)
   distance             = models.FloatField(default=0)
   moving_time          = models.IntegerField(default=0)
   elapsed_time         = models.IntegerField(default=0)
   total_elevation_gain = models.FloatField(default=0)
   #start_date           = models.DateTimeField(default=timezone.now)