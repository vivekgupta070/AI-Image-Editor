import requests
import os

BASE_URL = "http://127.0.0.1:8000"

# 1. Create a dummy image first if needed, but we can use the one from previous tests
# Or just upload a new one
from PIL import Image
os.makedirs("uploads", exist_ok=True)
img = Image.new('RGB', (100, 100), color = 'red')
img.save('uploads/test_feature.png')

image_url = f"{BASE_URL}/uploads/test_feature.png"

def test_operation(op):
    print(f"Testing {op}...")
    try:
        response = requests.post(
            f"{BASE_URL}/ai/process",
            json={
                "image_url": image_url,
                "prompt": "test",
                "operation": op
            }
        )
        if response.status_code == 200:
            print(f"[PASS] {op}: {response.json()['processed_image_url']}")
        else:
            print(f"[FAIL] {op}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[ERROR] {op}: {e}")

test_operation("grayscale")
test_operation("blur")
test_operation("sepia")
