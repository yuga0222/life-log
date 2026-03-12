from django.urls import path
from .views import StravaActivityView, StravaSavedActivityView

urlpatterns = [
    # Strava APIから取得＋DB保存（同期用）
    path('activities/', StravaActivityView.as_view(), name='strava-activities'),
    # DB保存済みデータを返す（フロント参照用・高速）
    path('activities/saved/', StravaSavedActivityView.as_view(), name='strava-saved-activities'),
]