import requests
import json

url = "http://127.0.0.1:8000/ai/process"
headers = {"Content-Type": "application/json"}
data = {
    "image_url": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3", 
    "prompt": "make it grayscale",
    "operation": "generate"
}

try:
    print(f"Attempting to generate image at {url}...")
    response = requests.post(url, headers=headers, json=data)
    
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response Text: {response.text}")
    
    if response.status_code == 200:
        print("\nSUCCESS: Image generation request successful!")
    else:
        print("\nFAILURE: Something went wrong.")

except Exception as e:
    print(f"\nCRITICAL ERROR: Could not connect to backend. {e}")
