import os
from pathlib import Path # ★追加
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
import requests

# .envファイルをロード
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / '.env')

class StravaActivityView(APIView):
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
        res = requests.post(auth_url, data=payload, verify=False)
        access_token = res.json().get('access_token')
        
        print(f"新しいトークンを発行しました: {access_token}") # 確認用ログ
        return access_token

    def get(self, request):
        # 1. ここで自動発行関数を呼び出す！
        access_token = self.get_access_token()
        
        if not access_token:
            return Response({"error": "トークンの自動発行に失敗しました。.envを確認してください。"})
   
        url = "https://www.strava.com/api/v3/athlete/activities"
        headers = {'Authorization': f"Bearer {access_token}"}
        
        # 1. Stravaからデータを取得
        response = requests.get(url, headers=headers)
        
        # エラーチェック：もし通信に失敗したら、その理由を表示して終了
        if response.status_code != 200:
            return Response({
                "error": "Stravaからのデータ取得に失敗しました",
                "details": response.json()
            })

        # ここで変数を定義します
        all_activities = response.json()
        
        # 2. データが空っぽ（まだ一度も走っていない等）の場合の処理
        # all_activities がリスト（配列）でない場合や、空の場合をチェック
        if not isinstance(all_activities, list):
             return Response({"error": "予期せぬデータ形式です", "data": all_activities})

        if len(all_activities) == 0:
             return Response({"message": "アクティビティデータがありません"})

        # 3. 最新のアクティビティ（リストの0番目）を取り出して加工
        latest_activity = all_activities[0]

        # 距離(m)をkmに変換
        distance_km = latest_activity['distance'] / 1000 
        
        # 表示したいデータだけを辞書にまとめる
        custom_data = {
            "title": "最新の走行データ",
            "name": latest_activity['name'],
            "distance_km": round(distance_km, 2), # 小数点第2位まで
            "date": latest_activity['start_date']
        }
        
        return Response(custom_data)