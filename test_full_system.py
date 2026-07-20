import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"
HEADERS = {"Content-Type": "application/json"}

def print_result(step, success, details=""):
    symbol = "[PASS]" if success else "[FAIL]"
    print(f"{symbol} {step}: {details}")

print("===================================================")
print("       STARTING FULL SYSTEM VERIFICATION")
print("===================================================\n")

# 1. Test Registration
user_email = f"test_full_{int(time.time())}@example.com"
user_data = {
    "email": user_email,
    "password": "securepassword123",
    "full_name": "Test User"
}
try:
    resp = requests.post(f"{BASE_URL}/users/", json=user_data, headers=HEADERS)
    if resp.status_code == 200:
        print_result("Registration", True, f"Created {user_email}")
    else:
        print_result("Registration", False, f"Status: {resp.status_code} - {resp.text}")
except Exception as e:
    print_result("Registration", False, f"Exception: {e}")

# 2. Test Login (Token)
token = None
try:
    # OAuth2 specifies form data, usually application/x-www-form-urlencoded
    data = {'username': user_email, 'password': 'securepassword123'}
    resp = requests.post(f"{BASE_URL}/users/token", data=data)
    if resp.status_code == 200:
        token = resp.json().get("access_token")
        print_result("Login/Token", True, "Authentication successful")
    else:
        print_result("Login/Token", False, f"Failed to get token: {resp.text}")
except Exception as e:
    print_result("Login/Token", False, f"Exception: {e}")

# 3. Test AI Operations
operations = ["generate", "remove_bg", "style_transfer", "enhance"]
ai_url = f"{BASE_URL}/ai/process"

for op in operations:
    payload = {
        "image_url": "dummy_input",
        "prompt": "Test Prompt",
        "operation": op
    }
    try:
        resp = requests.post(ai_url, json=payload, headers=HEADERS)
        if resp.status_code == 200:
            data = resp.json()
            url = data.get("processed_image_url", "")
            if "uploads/" in url and (url.endswith(".svg") or url.endswith(".png")):
                print_result(f"AI: {op}", True, f"Returned local file: {url.split('/')[-1]}")
            else:
                print_result(f"AI: {op}", False, f"Invalid URL returned: {url}")
        else:
            print_result(f"AI: {op}", False, f"Status: {resp.status_code}")
    except Exception as e:
        print_result(f"AI: {op}", False, f"Exception: {e}")

print("\n===================================================")
print("            VERIFICATION COMPLETE")
print("===================================================")
