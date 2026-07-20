import requests
import json

url = "http://127.0.0.1:8000/ai/process"
payload = {
    "image_url": "http://placeholder", # Dummy URL, ignored for generation
    "prompt": "star",
    "operation": "generate"
}

try:
    print(f"Testing API at {url}...")
    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    print("Success!")
    print(f"Message: {data.get('message')}")
    print(f"Image URL: {data.get('processed_image_url')}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'response') and e.response:
        print(f"Status: {e.response.status_code}")
        print(f"Body: {e.response.text}")
