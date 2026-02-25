from django.db import models

class StravaActivity(models.Model):
   activity_id = models.IntegerField(primary_key=True)
   activity_name = models.CharField(max_length=255)
   activity_description = models.TextField()
   activity_type = models.CharField(max_length=255)
   
