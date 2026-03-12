'use client';

import { useEffect, useState } from 'react';
import type { Activity } from '../types/activity';
import ActivityCard from '../components/ActivityCard';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = 'http://127.0.0.1:8000/api/strava/activities/saved';
        console.log('[API] リクエスト送信:', apiUrl);
        
        // タイムアウト設定（10秒）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        console.log('[API] レスポンス受信:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
        }
        
        const data = await response.json();
        // 原因特定用: 実際のAPIレスポンスをコンソールに出力（ブラウザのF12→Consoleで確認）
        console.log('[Strava API] 生レスポンス:', data);
        console.log('[Strava API] 型:', Array.isArray(data) ? '配列' : 'オブジェクト', typeof data === 'object' && data !== null ? 'キー一覧: ' + Object.keys(data).join(', ') : '');
        console.log('[Strava API] 抽出した件数:', data.length);
        setActivities(data);
      } catch (err) {
        console.error('[API] エラー詳細:', err);
        let errorMessage = 'An error occurred';
        
        if (err instanceof TypeError && err.message.includes('fetch')) {
          // ERR_EMPTY_RESPONSE または Connection refused の場合
          const errorString = String(err);
          const errorName = err instanceof Error ? err.name : '';
          
          // Connection refused または ERR_EMPTY_RESPONSE の場合
          if (errorString.includes('ERR_EMPTY_RESPONSE') || 
              errorString.includes('Failed to fetch') || 
              errorName === 'AbortError' ||
              errorString.includes('Connection refused')) {
            
            errorMessage = `❌ バックエンドAPIサーバーに接続できません

【原因】
バックエンドAPIサーバー（http://127.0.0.1:8000）が起動していない可能性が高いです。

【確認方法】
ターミナルで以下を実行してください:
  curl -v http://127.0.0.1:8000/api/strava/activities/

「Connection refused」と表示される場合、サーバーが起動していません。

【解決方法】
1. バックエンドAPIサーバーを起動してください
   - FastAPIの場合: uvicorn main:app --host 0.0.0.0 --port 8000
   - Djangoの場合: python manage.py runserver 0.0.0.0:8000
   - Flaskの場合: flask run --host 0.0.0.0 --port 8000

2. WSL2環境の場合、--host 0.0.0.0 を指定してください

3. サーバーが起動したら、再度このページをリロードしてください

【その他の可能性】
- サーバーが起動しているが、エンドポイントが存在しない
- CORS設定の問題
- ファイアウォールがポート8000をブロックしている`;
          } else {
            // その他のfetchエラー
            errorMessage = `接続エラー: バックエンドAPIサーバー（http://127.0.0.1:8000）に接続できませんでした。
          
考えられる原因:
1. バックエンドAPIサーバーが起動していない
2. CORS（クロスオリジン）の設定が必要
3. ネットワーク接続の問題（WSL2環境の場合、ホスト設定を確認）
4. ファイアウォールがポート8000をブロックしている

ブラウザの開発者ツール（F12）の「Console」タブと「Network」タブで詳細を確認してください。`;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="p-8">Loading activities...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">
          <h2 className="text-2xl font-bold mb-2">エラーが発生しました</h2>
          <p className="whitespace-pre-wrap">{error}</p>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2 text-blue-900">🔧 次のステップ:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>
              <strong>バックエンドAPIサーバーを起動してください</strong>
              <div className="ml-6 mt-1 p-2 bg-gray-800 text-green-400 rounded font-mono text-xs">
                # FastAPIの場合<br/>
                uvicorn main:app --host 0.0.0.0 --port 8000<br/><br/>
                # Djangoの場合<br/>
                python manage.py runserver 0.0.0.0:8000
              </div>
            </li>
            <li>サーバーが起動したら、このページをリロード（F5）してください</li>
            <li>まだエラーが出る場合、ブラウザの開発者ツール（F12）→「Network」タブでリクエストの詳細を確認</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Strava Activities</h1>
        <p className="text-slate-500 mt-1">取得したアクティビティ一覧</p>
      </header>

      {activities.length === 0 ? (
        <p className="text-slate-500">No activities found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.activity_id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
