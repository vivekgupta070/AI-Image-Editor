import requests
import json
import base64
import os
import sys

# Color for terminal output
def print_pass(msg): print(f"\033[92m[PASS] {msg}\033[0m")
def print_fail(msg): print(f"\033[91m[FAIL] {msg}\033[0m")
def print_info(msg): print(f"\033[94m[INFO] {msg}\033[0m")

API_URL = "http://127.0.0.1:8000/ai/process"

# Use a known image URL (a simple cat image)
TEST_IMAGE_URL = "https://cataas.com/cat"

def test_sticker():
    print_info("Testing STICKER generation...")
    payload = {
        "image_url": TEST_IMAGE_URL,
        "prompt": "sticker test",
        "operation": "sticker"
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        if response.status_code == 200:
            print_pass("Sticker generation successful")
            print_info(f"Result URL: {response.json().get('processed_image_url')}")
        else:
            print_fail(f"Sticker generation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_fail(f"Sticker request error: {e}")
        return False
    return True

def test_meme():
    print_info("Testing MEME generation...")
    payload = {
        "image_url": TEST_IMAGE_URL,
        "prompt": "meme test",
        "operation": "meme",
        "text_top": "TOP TEXT",
        "text_bottom": "BOTTOM TEXT"
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        if response.status_code == 200:
            print_pass("Meme generation successful")
            print_info(f"Result URL: {response.json().get('processed_image_url')}")
        else:
            print_fail(f"Meme generation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_fail(f"Meme request error: {e}")
        return False
    return True

def check_dependencies():
    print_info("Checking dependencies (rembg, PIL)...")
    try:
        import rembg
        print_pass("rembg is installed")
    except ImportError:
        print_fail("rembg is NOT installed. Please run: pip install rembg")
    
    try:
        from PIL import Image, ImageFont, ImageDraw
        print_pass("Pillow is installed")
    except ImportError:
        print_fail("Pillow is NOT installed")

if __name__ == "__main__":
    # check_dependencies()
    print("-" * 30)
    s = test_sticker()
    print("-" * 30)
    m = test_meme()
    
    if s and m:
        print_pass("All tests passed!")
    else:
        print_fail("Some tests failed.")
