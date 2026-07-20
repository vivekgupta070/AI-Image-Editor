import requests
import uuid
import sys
import time

BASE_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

def print_step(msg):
    print(f"\n[TEST] {msg}...")

def test_frontend_reachable():
    print_step("Checking Frontend Availability")
    try:
        resp = requests.get(FRONTEND_URL, timeout=5)
        if resp.status_code == 200:
            print("✅ Frontend is running and reachable.")
        else:
            print(f"⚠️ Frontend returned status code: {resp.status_code}")
    except Exception as e:
        print(f"❌ Frontend unreachable: {e}")

def test_backend_health():
    print_step("Checking Backend Health")
    try:
        resp = requests.get(f"{BASE_URL}/", timeout=5)
        if resp.status_code == 200:
            print("✅ Backend is running.")
        else:
            print(f"❌ Backend returned: {resp.status_code}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Backend unreachable: {e}")
        sys.exit(1)

def test_auth_flow():
    print_step("Testing Authentication (Register & Login)")
    
    # Generate random user
    random_id = str(uuid.uuid4())[:8]
    email = f"test_{random_id}@example.com"
    password = "password123"
    
    # Register
    reg_payload = {"email": email, "password": password, "full_name": "Test User"}
    resp = requests.post(f"{BASE_URL}/users/", json=reg_payload)
    if resp.status_code != 200:
        print(f"❌ Registration failed: {resp.text}")
        return None
    print(f"✅ Registered user: {email}")

    # Login
    login_data = {"username": email, "password": password}
    resp = requests.post(f"{BASE_URL}/users/token", data=login_data)
    if resp.status_code != 200:
        print(f"❌ Login failed: {resp.text}")
        return None
    
    token = resp.json().get("access_token")
    print("✅ Login successful, received token.")
    return token

def test_remove_bg(token):
    print_step("Testing Remove Background")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Use a simple cat image (or placeholder that simulates a photo)
    # We use a reliable public URL for testing
    image_url = "https://cataas.com/cat" 
    
    payload = {
        "image_url": image_url,
        "prompt": "remove background",
        "operation": "remove_bg"
    }
    
    try:
        start_time = time.time()
        print("   Sending request (this may take time for model download)...")
        resp = requests.post(f"{BASE_URL}/ai/process", json=payload, headers=headers, timeout=120)
        end_time = time.time()
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"✅ Remove BG successful! Time: {end_time - start_time:.2f}s")
            print(f"   Result URL: {data.get('processed_image_url')}")
            return data.get('processed_image_url')
        else:
            print(f"❌ Remove BG failed: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"❌ Request error: {e}")
    return None

def test_change_bg(token):
    print_step("Testing Change Background (Red)")
    headers = {"Authorization": f"Bearer {token}"}
    
    image_url = "https://cataas.com/cat"
    
    payload = {
        "image_url": image_url,
        "prompt": "red",
        "operation": "add_bg"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/ai/process", json=payload, headers=headers, timeout=120)
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"✅ Change BG successful!")
            print(f"   Result URL: {data.get('processed_image_url')}")
        else:
            print(f"❌ Change BG failed: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"❌ Request error: {e}")

def test_ai_generation(token):
    print_step("Testing AI Image Generation")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    payload = {
        "image_url": "http://placeholder",
        "prompt": "A beautiful mountain landscape",
        "operation": "generate"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/ai/process", json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            print(f"✅ AI Generation successful!")
            print(f"   Message: {data.get('message')}")
            print(f"   Result URL: {data.get('processed_image_url')}")
        else:
            print(f"❌ AI Generation failed: {resp.text}")
    except Exception as e:
        print(f"❌ AI Request error: {e}")


if __name__ == "__main__":
    print("=== STARTING FULL SYSTEM VERIFICATION ===")
    
    test_frontend_reachable()
    test_backend_health()
    
    token = test_auth_flow()
    if token:
        test_ai_generation(token)
        test_remove_bg(token)
        test_change_bg(token)
    
    print("\n=== VERIFICATION COMPLETE ===")
