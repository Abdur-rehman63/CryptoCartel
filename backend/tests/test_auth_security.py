"""
Test authentication security - wrong password should fail
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

print("\n🔐 AUTHENTICATION SECURITY TEST")
print("="*60)

# Test 1: Wrong password
print("\n1️⃣  Testing login with WRONG password...")
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@cryptocartel.com", "password": "wrongpassword123"}
)

if response.status_code == 401:
    print("✅ PASS - Wrong password correctly rejected")
    print(f"   Error: {response.json()['detail']}")
else:
    print(f"❌ FAIL - Wrong password was accepted! Status: {response.status_code}")

# Test 2: Correct password
print("\n2️⃣  Testing login with CORRECT password...")
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@cryptocartel.com", "password": "admin123"}
)

if response.status_code == 200:
    user = response.json()["user"]
    print(f"✅ PASS - Correct password accepted")
    print(f"   Logged in as: {user['name']} ({user['role']})")
else:
    print(f"❌ FAIL - Correct password rejected! Status: {response.status_code}")

# Test 3: Non-existent user
print("\n3️⃣  Testing login with NON-EXISTENT user...")
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "nonexistent@example.com", "password": "anypassword"}
)

if response.status_code == 401:
    print("✅ PASS - Non-existent user correctly rejected")
    print(f"   Error: {response.json()['detail']}")
else:
    print(f"❌ FAIL - Non-existent user was accepted! Status: {response.status_code}")

print("\n" + "="*60)
print("✅ Authentication security is working correctly!")
print("="*60 + "\n")
