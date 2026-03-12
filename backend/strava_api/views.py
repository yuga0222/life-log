import os
from pathlib import Path # ★追加
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StravaActivity  # モデルをインポート
import requests

# .envファイルをロード
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / '.env')

class StravaActivityView(APIView):
    def save_activity(self, activity_data):
        """
        Strava APIから取得したデータをデータベースへ保存する関数。
        - activity_data: dict（Strava APIのアクティビティ1件分のデータ）
        """
        # 主キーはactivity_idであることを想定
        activity_id = activity_data.get('id')
        if not activity_id:
            return None  # idがなければ何もしない

        # 既存レコードを更新 or 新規追加
        obj, created = StravaActivity.objects.update_or_create(
            activity_id=activity_id,
            defaults={
                "activity_name": activity_data.get('name', ''),
                "activity_type": activity_data.get('type', ''),
                "distance": activity_data.get('distance', 0),
                "moving_time": activity_data.get('moving_time', 0),
                "elapsed_time": activity_data.get('elapsed_time', 0),
                "total_elevation_gain": activity_data.get('total_elevation_gain', 0),
            }
        )
        return obj
    # ★追加機能：アクセストークンを自動発行する関数
    def get_access_token(self):
        # .envから会員証情報を読み込む
        client_id = os.environ.get("STRAVA_CLIENT_ID")
        client_secret = os.environ.get("STRAVA_CLIENT_SECRET")
        refresh_token = os.environ.get("STRAVA_REFRESH_TOKEN")

        if not all([client_id, client_secret, refresh_token]):
            print("エラー: .envに必要な情報が足りません")
            return None

        # Stravaに「新しいチケットください」とお願いするURL
        auth_url = "https://www.strava.com/oauth/token"
        
        # 提出する書類
        payload = {
            'client_id': client_id,
            'client_secret': client_secret,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token', # 「更新をお願いします」という合図
            'f': 'json'
        }

        # ポスト投函！
        try:
            res = requests.post(auth_url, data=payload, verify=False, timeout=10)
        except requests.RequestException as e:
            print(f"トークン取得で接続エラー: {e}")
            return None

        try:
            data = res.json()
        except ValueError:
            print(f"トークンAPIのレスポンスがJSONではありません: {res.text[:200]}")
            return None

        if res.status_code == 429:
            print("Strava API: レート制限(429)です。しばらく待ってから再試行してください。")
            return None
        if res.status_code != 200:
            print(f"トークン取得失敗 status={res.status_code}, body={data}")
            return None

        access_token = data.get('access_token')
        if access_token:
            print(f"新しいトークンを発行しました: {access_token[:20]}...")
        return access_token

    def get(self, request):
        # 1. ここで自動発行関数を呼び出す！
        access_token = self.get_access_token()

        if not access_token:
            return Response(
                {"error": "トークンの自動発行に失敗しました。.envを確認するか、Stravaのレート制限(429)の場合は時間をおいて再試行してください。"},
                status=503
            )

        url = "https://www.strava.com/api/v3/athlete/activities"
        headers = {'Authorization': f"Bearer {access_token}"}

        try:
            response = requests.get(url, headers=headers, timeout=15)
        except requests.RequestException as e:
            return Response(
                {"error": "Stravaへの接続に失敗しました", "details": str(e)},
                status=503
            )

        # レート制限(429)を明示的に処理
        if response.status_code == 429:
            return Response({
                "error": "Strava APIのレート制限に達しました",
                "message": "15分あたり約100リクエスト、1日1000リクエストの制限があります。時間をおいて再試行してください。"
            }, status=429)

        if response.status_code != 200:
            try:
                details = response.json()
            except ValueError:
                details = response.text[:500]
            return Response({
                "error": "Stravaからのデータ取得に失敗しました",
                "status_code": response.status_code,
                "details": details
            }, status=502)

        try:
            all_activities = response.json()
        except ValueError:
            return Response(
                {"error": "StravaのレスポンスがJSONではありません", "raw": response.text[:300]},
                status=502
            )

        if not isinstance(all_activities, list):
            return Response({"error": "予期せぬデータ形式です", "data": all_activities})

        if len(all_activities) == 0:
            return Response({"message": "アクティビティデータがありません"})

        for activity_data in all_activities:
            self.save_activity(activity_data)
            print(f"アクティビティデータを保存しました: {activity_data['name']}")
            
        return Response(all_activities)


class StravaSavedActivityView(APIView):
    """
    DBに保存済みのアクティビティ一覧を返すAPI（フロント参照用）
    Strava APIを呼ばないので高速・レート制限の心配なし
    """
    def get(self, request):
        activities = StravaActivity.objects.all().order_by('-activity_id')
        data = [
            {
                "activity_id": a.activity_id,
                "activity_name": a.activity_name,
                "activity_type": a.activity_type,
                "distance": float(a.distance),
                "moving_time": a.moving_time,
                "elapsed_time": a.elapsed_time,
                "total_elevation_gain": float(a.total_elevation_gain),
                "start_date": a.start_date.isoformat(),
            }
            for a in activities
        ]
        return Response(data)