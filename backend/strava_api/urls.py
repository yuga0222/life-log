from django.urls import path
from .views import StravaActivityView

urlpatterns = [
    # http://localhost:8000/api/strava/activities/ で呼び出す設定
    path('activities/', StravaActivityView.as_view(), name='strava-activities'),
]