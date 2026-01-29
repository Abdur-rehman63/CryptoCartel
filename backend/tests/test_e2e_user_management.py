"""
End-to-End Test: Create, Edit, Delete User
Tests the complete workflow as requested by user
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("\n" + "="*60)
print("END-TO-END USER MANAGEMENT TEST")
print("="*60)

# Step 1: Login as Admin
print("\n1️⃣  Logging in as admin...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@cryptocartel.com", "password": "admin123"}
)

if login_response.status_code != 200:
    print(f"❌ Admin login failed: {login_response.json()}")
    exit(1)

admin_token = login_response.json()["access_token"]
admin_user = login_response.json()["user"]
print(f"✅ Logged in as {admin_user['name']} (Role: {admin_user['role']})")

headers = {"Authorization": f"Bearer {admin_token}"}

# Step 2: Create a new test user
print("\n2️⃣  Creating new test user...")
new_user_data = {
    "email": f"test.e2e.{int(__import__('time').time())}@example.com",
    "name": "E2E Test User",
    "password": "testpass123",
    "initial_deposit": 15000,
    "role": "CLIENT"
}

create_response = requests.post(
    f"{BASE_URL}/auth/register",
    json=new_user_data
)

if create_response.status_code != 201:
    print(f"❌ User creation failed: {create_response.json()}")
    exit(1)

created_user = create_response.json()
user_id = created_user["id"]
print(f"✅ User created successfully")
print(f"   ID: {user_id}")
print(f"   Name: {created_user['name']}")
print(f"   Email: {created_user['email']}")
print(f"   Initial Deposit: ${created_user['initial_deposit']}")

# Step 3: Fetch all users to verify creation
print("\n3️⃣  Fetching all users to verify creation...")
users_response = requests.get(f"{BASE_URL}/auth/users", headers=headers)

if users_response.status_code != 200:
    print(f"❌ Failed to fetch users: {users_response.json()}")
    exit(1)

all_users = users_response.json()
test_user_in_list = [u for u in all_users if u["id"] == user_id]

if test_user_in_list:
    print(f"✅ User found in list ({len(all_users)} total users)")
else:
    print(f"❌ User not found in list")
    exit(1)

# Step 4: Edit the user (change name and initial deposit)
print("\n4️⃣  Editing user (changing name and initial deposit)...")
update_data = {
    "name": "E2E Test User UPDATED",
    "initial_deposit": 25000
}

update_response = requests.put(
    f"{BASE_URL}/auth/users/{user_id}",
    json=update_data,
    headers=headers
)

if update_response.status_code != 200:
    print(f"❌ User update failed: {update_response.json()}")
    exit(1)

updated_user = update_response.json()
print(f"✅ User updated successfully")
print(f"   New Name: {updated_user['name']}")
print(f"   New Initial Deposit: ${updated_user['initial_deposit']}")

# Step 5: Verify the edit
print("\n5️⃣  Verifying the edit...")
verify_response = requests.get(
    f"{BASE_URL}/auth/users/{user_id}",
    headers=headers
)

if verify_response.status_code != 200:
    print(f"❌ Failed to verify user: {verify_response.json()}")
    exit(1)

verified_user = verify_response.json()
if (verified_user['name'] == update_data['name'] and 
    verified_user['initial_deposit'] == update_data['initial_deposit']):
    print(f"✅ Edit verified - changes persisted correctly")
else:
    print(f"❌ Edit verification failed - changes not persisted")
    exit(1)

# Step 6: Delete the user
print("\n6️⃣  Deleting the test user...")
delete_response = requests.delete(
    f"{BASE_URL}/auth/users/{user_id}",
    headers=headers
)

if delete_response.status_code != 204:
    print(f"❌ User deletion failed: Status {delete_response.status_code}")
    if delete_response.content:
        print(f"   Response: {delete_response.json()}")
    exit(1)

print(f"✅ User deleted successfully")

# Step 7: Verify deletion
print("\n7️⃣  Verifying deletion...")
final_users_response = requests.get(f"{BASE_URL}/auth/users", headers=headers)

if final_users_response.status_code != 200:
    print(f"❌ Failed to fetch users: {final_users_response.json()}")
    exit(1)

final_users = final_users_response.json()
deleted_user_in_list = [u for u in final_users if u["id"] == user_id]

if not deleted_user_in_list:
    print(f"✅ User successfully deleted and removed from database")
    print(f"   Current total users: {len(final_users)}")
else:
    print(f"❌ User still exists in database")
    exit(1)

print("\n" + "="*60)
print("🎉 ALL TESTS PASSED!")
print("="*60)
print("\n✅ Summary:")
print("   - Admin login: WORKING")
print("   - Create user: WORKING")
print("   - List users: WORKING")
print("   - Edit user: WORKING")
print("   - Delete user: WORKING")
print("\n📝 Backend APIs are 100% functional!")
print("="*60 + "\n")
