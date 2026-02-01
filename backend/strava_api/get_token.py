import requests

# Strava管理画面からコピペ
client_id = '197131'
client_secret = '3ea2e5f1c38e94d5672d209789ee1e6ac5a33ad6' 

# 手順1でURLからコピーしたコード
code = '8b1d2847f62326a5ef64c520ada294f343733d64'

url = "https://www.strava.com/oauth/token"

payload = {
    'client_id': client_id,
    'client_secret': client_secret,
    'code': code,
    'grant_type': 'authorization_code'
}

response = requests.post(url, data=payload)
print(response.json())