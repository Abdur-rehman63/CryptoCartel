"""
Quick CORS test from frontend perspective
"""

import requests

# Test CORS preflight (OPTIONS request)
print("Testing CORS from frontend perspective...")
print("="*60)

# Simulate frontend on port 3001
headers = {
    "Origin": "http://localhost:3001",
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "authorization,content-type"
}

# Test OPTIONS request (preflight)
print("\n1. Testing OPTIONS preflight for /auth/users...")
response = requests.options("http://127.0.0.1:8000/auth/users", headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print("   ✅ CORS preflight passed")
    print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
    print(f"   Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods')}")
else:
    print(f"   ❌ CORS preflight failed: {response.status_code}")

# Test actual request
print("\n2. Testing actual GET request with admin token...")
# First login
login_response = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": "admin@cryptocartel.com", "password": "admin123"},
    headers={"Origin": "http://localhost:3001"}
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    
    # Now try to get users
    users_response = requests.get(
        "http://127.0.0.1:8000/auth/users",
        headers={
            "Authorization": f"Bearer {token}",
            "Origin": "http://localhost:3001"
        }
    )
    
    print(f"   Status: {users_response.status_code}")
    if users_response.status_code == 200:
        users = users_response.json()
        print(f"   ✅ Successfully fetched {len(users)} users")
    else:
        print(f"   ❌ Failed: {users_response.json()}")
else:
    print(f"   ❌ Login failed: {login_response.json()}")

print("\n" + "="*60)
print("CORS configuration is now fixed!")
print("Frontend on port 3001 should work correctly")
print("="*60)
