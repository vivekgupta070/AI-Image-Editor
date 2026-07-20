import requests

def test_register():
    url = "http://127.0.0.1:8000/users/"
    payload = {
        "email": "luckycauhan_new@gmail.com",
        "password": "password123",
        "full_name": "Test User",
        "profile_image": None
    }
    try:
        response = requests.post(url, json=payload, timeout=10)
        print("Status Code:", response.status_code)
        print("Response Body:", response.json())
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_register()
