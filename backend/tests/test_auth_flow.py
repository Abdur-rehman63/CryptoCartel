"""
Comprehensive API Tests for Backend
Tests authentication flow, user management, and authorization
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
headers = {"Content-Type": "application/json"}

# Test data
test_user = {
    "email": "testuser@example.com",
    "name": "Test User",
    "password": "testpass123",
    "initial_deposit": 5000,
    "role": "CLIENT"
}

admin_user = {
    "email": "admin@cryptocartel.com",
    "name": "Admin User",
    "password": "admin123",
    "initial_deposit": 0,
    "role": "ADMIN"
}

def print_test(test_name):
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print('='*60)

def print_result(status, data=None, error=None):
    if status == "PASS":
        print(f"✅ PASS")
        if data:
            print(f"Response: {json.dumps(data, indent=2)}")
    else:
        print(f"❌ FAIL")
        if error:
            print(f"Error: {error}")
        if data:
            print(f"Response: {json.dumps(data, indent=2)}")

# Test 1: Register Client User
print_test("Register Client User")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=test_user,
        headers=headers
    )
    if response.status_code == 201:
        print_result("PASS", response.json())
        test_user_id = response.json().get("id")
    else:
        print_result("FAIL", response.json())
        test_user_id = None
except Exception as e:
    print_result("FAIL", error=str(e))
    test_user_id = None

# Test 2: Register Admin User
print_test("Register Admin User")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=admin_user,
        headers=headers
    )
    if response.status_code == 201:
        print_result("PASS", response.json())
        admin_user_id = response.json().get("id")
    else:
        print_result("FAIL", response.json())
        admin_user_id = None
except Exception as e:
    print_result("FAIL", error=str(e))
    admin_user_id = None

# Test 3: Login as Client
print_test("Login as Client User")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": test_user["email"], "password": test_user["password"]},
        headers=headers
    )
    if response.status_code == 200:
        data = response.json()
        client_token = data.get("access_token")
        print_result("PASS", {"token_preview": client_token[:50] + "...", "user": data.get("user")})
    else:
        print_result("FAIL", response.json())
        client_token = None
except Exception as e:
    print_result("FAIL", error=str(e))
    client_token = None

# Test 4: Login as Admin
print_test("Login as Admin User")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": admin_user["email"], "password": admin_user["password"]},
        headers=headers
    )
    if response.status_code == 200:
        data = response.json()
        admin_token = data.get("access_token")
        print_result("PASS", {"token_preview": admin_token[:50] + "...", "user": data.get("user")})
    else:
        print_result("FAIL", response.json())
        admin_token = None
except Exception as e:
    print_result("FAIL", error=str(e))
    admin_token = None

# Test 5: Get Current User (Client)
print_test("Get Current User Info (Client)")
if client_token:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        if response.status_code == 200:
            print_result("PASS", response.json())
        else:
            print_result("FAIL", response.json())
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No client token")

# Test 6: Get Current User (Admin)
print_test("Get Current User Info (Admin)")
if admin_token:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 200:
            print_result("PASS", response.json())
        else:
            print_result("FAIL", response.json())
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No admin token")

# Test 7: Get All Users (Client - Should FAIL)
print_test("Get All Users as Client (Should Fail with 403)")
if client_token:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/users",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        if response.status_code == 403:
            print_result("PASS", {"message": "Correctly denied access"})
        else:
            print_result("FAIL", {"message": "Should have been denied", "response": response.json()})
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No client token")

# Test 8: Get All Users (Admin - Should PASS)
print_test("Get All Users as Admin (Should Pass)")
if admin_token:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 200:
            users = response.json()
            print_result("PASS", {"total_users": len(users), "users": users})
        else:
            print_result("FAIL", response.json())
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No admin token")

# Test 9: Update User (Admin)
print_test("Update User as Admin")
if admin_token and test_user_id:
    try:
        update_data = {
            "name": "Updated Test User",
            "initial_deposit": 10000
        }
        response = requests.put(
            f"{BASE_URL}/auth/users/{test_user_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 200:
            print_result("PASS", response.json())
        else:
            print_result("FAIL", response.json())
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No admin token or user ID")

# Test 10: Delete User (Admin)
print_test("Delete User as Admin")
if admin_token and test_user_id:
    try:
        response = requests.delete(
            f"{BASE_URL}/auth/users/{test_user_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 204:
            print_result("PASS", {"message": "User deleted successfully"})
        else:
            print_result("FAIL", response.json())
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No admin token or user ID")

# Test 11: Verify User Deleted
print_test("Verify User Was Deleted")
if admin_token:
    try:
        response = requests.get(
            f"{BASE_URL}/auth/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 200:
            users = response.json()
            deleted_user = [u for u in users if u.get("id") == test_user_id]
            if not deleted_user:
                print_result("PASS", {"message": "User successfully deleted and not in list"})
            else:
                print_result("FAIL", {"message": "User still exists", "user": deleted_user})
        else:
            print_result("FAIL", response.json())
    except Exception as e:
        print_result("FAIL", error=str(e))
else:
    print("⏭️  SKIPPED - No admin token")

print(f"\n{'='*60}")
print("TEST SUITE COMPLETE")
print('='*60)
