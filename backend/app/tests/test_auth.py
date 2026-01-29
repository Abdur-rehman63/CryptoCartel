import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    def test_register_user(self):
        """Test user registration"""
        response = client.post(
            "/auth/register",
            json={
                "email": "newuser@test.com",
                "name": "New User",
                "password": "password123",
                "role": "CLIENT",
                "initial_deposit": 5000
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@test.com"
        assert data["name"] == "New User"
        assert data["role"] == "CLIENT"
        assert data["initial_deposit"] == 5000
        assert "id" in data
    
    def test_register_duplicate_email(self, admin_user):
        """Test registration with duplicate email"""
        response = client.post(
            "/auth/register",
            json={
                "email": "admin@test.com",
                "name": "Duplicate",
                "password": "password123",
                "role": "CLIENT",
                "initial_deposit": 0
            }
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_login_success(self, admin_user):
        """Test successful login"""
        response = client.post(
            "/auth/login",
            json={
                "email": "admin@test.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "admin@test.com"
    
    def test_login_wrong_password(self, admin_user):
        """Test login with wrong password"""
        response = client.post(
            "/auth/login",
            json={
                "email": "admin@test.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self):
        """Test login with nonexistent user"""
        response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@test.com",
                "password": "password123"
            }
        )
        assert response.status_code == 401
    
    def test_get_current_user(self, admin_token):
        """Test getting current user info"""
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "admin@test.com"
        assert data["role"] == "ADMIN"
    
    def test_get_current_user_unauthorized(self):
        """Test getting current user without token"""
        response = client.get("/auth/me")
        assert response.status_code == 403
    
    def test_get_all_users_as_admin(self, admin_token, client_user):
        """Test getting all users as admin"""
        response = client.get(
            "/auth/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
        assert any(u["email"] == "admin@test.com" for u in data)
        assert any(u["email"] == "client@test.com" for u in data)
    
    def test_get_all_users_as_client(self, client_token):
        """Test getting all users as client (should fail)"""
        response = client.get(
            "/auth/users",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 403
    
    def test_get_user_by_id(self, admin_token, client_user):
        """Test getting user by ID"""
        response = client.get(
            f"/auth/users/{client_user.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == client_user.id
        assert data["email"] == "client@test.com"
    
    def test_client_can_view_own_profile(self, client_token, client_user):
        """Test client viewing their own profile"""
        response = client.get(
            f"/auth/users/{client_user.id}",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 200
    
    def test_client_cannot_view_other_profile(self, client_token, admin_user):
        """Test client cannot view other user's profile"""
        response = client.get(
            f"/auth/users/{admin_user.id}",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 403
    
    def test_update_user(self, admin_token, client_user):
        """Test updating user"""
        response = client.put(
            f"/auth/users/{client_user.id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "name": "Updated Name",
                "initial_deposit": 15000
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["initial_deposit"] == 15000
    
    def test_delete_user(self, admin_token, client_user):
        """Test deleting user"""
        response = client.delete(
            f"/auth/users/{client_user.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204
        
        # Verify user is deleted
        response = client.get(
            f"/auth/users/{client_user.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404
