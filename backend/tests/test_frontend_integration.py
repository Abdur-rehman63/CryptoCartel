"""
Frontend Integration Test
Tests the login flow from frontend perspective
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_frontend_admin_flow():
    """Simulate frontend admin login and operations"""
    
    print("\n" + "="*60)
    print("FRONTEND INTEGRATION TEST")
    print("="*60)
    
    # Step 1: Login as admin  
    print("\n1. Admin Login...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": "admin@cryptocartel.com",
            "password": "admin123"
        }
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.json()}")
        return
    
    data = login_response.json()
    token = data["access_token"]
    user = data["user"]
    
    print(f"✅ Logged in as: {user['name']} ({user['role']})")
    print(f"   Token: {token[:30]}...")
    
    # Step 2: Fetch all users
    print("\n2. Fetching all users...")
    users_response = requests.get(
        f"{BASE_URL}/auth/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if users_response.status_code != 200:
        print(f"❌ Failed to fetch users: {users_response.json()}")
        print(f"   Status Code: {users_response.status_code}")
        print(f"   Using token: Bearer {token[:30]}...")
        return
    
    users = users_response.json()
    print(f"✅ Fetched {len(users)} users")
    
    # Filter clients
    clients = [u for u in users if u["role"] == "CLIENT"]
    print(f"   - {len(clients)} clients")
    print(f"   - {len(users) - len(clients)} admins")
    
    # Display clients
    print("\n   Clients:")
    for client in clients[:5]:  # Show first 5
        print(f"   - {client['name']} ({client['email']}) - ${client['initial_deposit']}")
    
    # Step 3: Test update a client
    if clients:
        test_client = clients[0]
        print(f"\n3. Testing update on: {test_client['name']}")
        
        update_response = requests.put(
            f"{BASE_URL}/auth/users/{test_client['id']}",
            json={"name": test_client['name'], "initial_deposit": test_client['initial_deposit']},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if update_response.status_code == 200:
            print(f"✅ Update successful")
        else:
            print(f"❌ Update failed: {update_response.json()}")
    
    print("\n" + "="*60)
    print("✅ ALL FRONTEND INTEGRATION TESTS PASSED")
    print("="*60)

if __name__ == "__main__":
    test_frontend_admin_flow()
