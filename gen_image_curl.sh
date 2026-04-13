#!/bin/bash
MASCOT=$(base64 -w 0 /root/.openclaw/workspace/lobster_mascot.jpg)
curl -X POST "https://api.minimaxi.com/v1/image_generation" \
     -H "Authorization: Bearer sk-api-D5WkTBoQFUDbxMEoiq9Ar7WjWhNiuPK5qEzf7Om_12BupI2VUIjPslnLq_UMvYSinWSGoEiPghzoLkqAoAbMCqxxJbiQLifS4ixBZmPR88tzTHqtRYLr9H8" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "image-01",
       "prompt": "A cute space lobster mascot reading data and code on holographic screens, analyzing AI trends, looking excited, cartoon 3D style, warm colors",
       "aspect_ratio": "16:9",
       "response_format": "base64",
       "image": "'$MASCOT'"
     }' > /root/.openclaw/workspace/ai-diary/api_resp.json
