import base64
import json
import urllib.request
import os

with open('/root/.openclaw/workspace/lobster_mascot.jpg', 'rb') as f:
    mascot_base64 = base64.b64encode(f.read()).decode('utf-8')

payload = {
    "model": "image-01",
    "prompt": "A cute space lobster mascot reading data and code on holographic screens, analyzing AI trends, looking excited, cartoon 3D style, warm colors",
    "aspect_ratio": "16:9",
    "response_format": "base64",
    "image": mascot_base64
}

req = urllib.request.Request(
    'https://api.minimaxi.com/v1/image_generation',
    data=json.dumps(payload).encode('utf-8'),
    headers={
        'Authorization': 'Bearer sk-api-D5WkTBoQFUDbxMEoiq9Ar7WjWhNiuPK5qEzf7Om_12BupI2VUIjPslnLq_UMvYSinWSGoEiPghzoLkqAoAbMCqxxJbiQLifS4ixBZmPR88tzTHqtRYLr9H8',
        'Content-Type': 'application/json'
    }
)

response = urllib.request.urlopen(req)
result = json.loads(response.read().decode('utf-8'))

if 'data' in result and isinstance(result['data'], dict):
    if 'image_base64' in result['data']:
        img_base64 = result['data']['image_base64']
    elif 'image' in result['data']:
        img_base64 = result['data']['image']
    elif 'base64' in result['data']:
        img_base64 = result['data']['base64']
    else:
        print("No image/base64 in data dict:", result['data'].keys())
        exit(1)
elif 'data' in result and isinstance(result['data'], list) and len(result['data']) > 0 and 'base64' in result['data'][0]:
    img_base64 = result['data'][0]['base64']
elif 'base64_data' in result:
    img_base64 = result['base64_data']
else:
    print("Could not find base64 data in response.")
    exit(1)

img_data = base64.b64decode(img_base64)
os.makedirs('/root/.openclaw/workspace/ai-diary/public/images/', exist_ok=True)
with open('/root/.openclaw/workspace/ai-diary/public/images/day-22.jpg', 'wb') as f:
    f.write(img_data)
print("Image saved successfully to day-22.jpg")