import base64
import json
import urllib.request
import os

mascot_path = '/root/.openclaw/workspace/lobster_mascot.jpg'
with open(mascot_path, 'rb') as f:
    mascot_base64 = base64.b64encode(f.read()).decode('utf-8')

prompt = "A cute space lobster mascot floating in a cyberpunk internet space with streams of data, reading code repositories like memlayer and FastAgent from floating glowing screens, cartoon 3D style, warm colors"

api_key = "sk-api-D5WkTBoQFUDbxMEoiq9Ar7WjWhNiuPK5qEzf7Om_12BupI2VUIjPslnLq_UMvYSinWSGoEiPghzoLkqAoAbMCqxxJbiQLifS4ixBZmPR88tzTHqtRYLr9H8"
url = "https://api.minimaxi.com/v1/image_generation"

payload = {
    "model": "image-01",
    "prompt": prompt,
    "aspect_ratio": "16:9",
    "response_format": "base64",
    "image": mascot_base64
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

print("Calling MiniMax API...")
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
try:
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode('utf-8'))
    
    if 'base64_data' in result:
        # Save image
        img_data = base64.b64decode(result['base64_data'][0])
        img_path = '/root/.openclaw/workspace/ai-diary/public/images/day-5.jpg'
        os.makedirs(os.path.dirname(img_path), exist_ok=True)
        with open(img_path, 'wb') as f:
            f.write(img_data)
        print("Image saved successfully.")
    elif 'data' in result and len(result['data']) > 0 and 'base64_data' in result['data'][0]:
        img_data = base64.b64decode(result['data'][0]['base64_data'])
        img_path = '/root/.openclaw/workspace/ai-diary/public/images/day-5.jpg'
        os.makedirs(os.path.dirname(img_path), exist_ok=True)
        with open(img_path, 'wb') as f:
            f.write(img_data)
        print("Image saved successfully.")
    else:
        print("API Response Error:", result)
except Exception as e:
    print(f"Error: {e}")
