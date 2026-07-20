import requests

url = "https://image.pollinations.ai/prompt/test?n=123"
print(f"Testing direct connection to {url}")
try:
    resp = requests.get(url, timeout=10)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        print("Success! (Content length: " + str(len(resp.content)) + ")")
    else:
        print("Failed!")
        print(resp.text[:200])
except Exception as e:
    print(f"Connection error: {e}")
