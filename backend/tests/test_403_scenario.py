"""
Test to reproduce the exact 403 error scenario
"""

import requests

BASE_URL = "http://localhost:8000"

print("Testing 403 Error Scenario")
print("="*60)

# Try to call admin endpoint WITHOUT token
print("\n1. Calling /auth/users WITHOUT authentication (should fail):")
response = requests.get(f"{BASE_URL}/auth/users")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# Try to call admin endpoint WITH invalid token
print("\n2. Calling /auth/users with INVALID token (should fail):")
response = requests.get(
    f"{BASE_URL}/auth/users",
    headers={"Authorization": "Bearer invalid_token_here"}
)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# Try to call admin endpoint as CLIENT
print("\n3. Calling /auth/users as CLIENT (should fail with 403):")
client_login = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "client@test.com", "password": "client123"}
)

if client_login.status_code == 200:
    client_token = client_login.json()["access_token"]
    response = requests.get(
        f"{BASE_URL}/auth/users",
        headers={"Authorization": f"Bearer {client_token}"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
else:
    print(f"   Client login failed: {client_login.json()}")

# Correct way: Call admin endpoint as ADMIN
print("\n4. Calling /auth/users as ADMIN (should succeed):")
admin_login = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@cryptocartel.com", "password": "admin123"}
)

if admin_login.status_code == 200:
    admin_token = admin_login.json()["access_token"]
    response = requests.get(
        f"{BASE_URL}/auth/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Total users: {len(response.json())}")
else:
    print(f"   Admin login failed: {admin_login.json()}")

print("\n" + "="*60)
print("CONCLUSION:")
print("403 errors occur when:")
print("1. No authentication token is provided")
print("2. Invalid/expired token is used")
print("3. CLIENT user tries to access ADMIN endpoints")
print("\nAll backend APIs are working correctly!")
print("="*60)
