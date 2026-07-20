import requests
import json
import time

# Color for terminal output
def print_pass(msg): print(f"\033[92m[PASS] {msg}\033[0m")
def print_fail(msg): print(f"\033[91m[FAIL] {msg}\033[0m")
def print_info(msg): print(f"\033[94m[INFO] {msg}\033[0m")

API_URL = "http://127.0.0.1:8000/ai/process"
TEST_IMAGE_URL = "https://cataas.com/cat" # Simple test image

def test_operation(op_name):
    print_info(f"Testing operation: {op_name}...")
    payload = {
        "image_url": TEST_IMAGE_URL,
        "prompt": f"test {op_name}",
        "operation": op_name
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=15)
        if response.status_code == 200:
            print_pass(f"{op_name} working. URL: {response.json().get('processed_image_url')}")
            return True
        else:
            print_fail(f"{op_name} FAILED: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_fail(f"{op_name} Error: {e}")
        return False

if __name__ == "__main__":
    ops = ["brightness", "saturation", "vignette"]
    all_pass = True
    for op in ops:
        if not test_operation(op):
            all_pass = False
    
    if all_pass:
        print_pass("All filter operations are working correctly on the backend.")
    else:
        print_fail("Some operations failed.")
