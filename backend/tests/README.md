# Backend Tests

This directory contains comprehensive API tests for the backend.

## Test Files

### test_auth_flow.py
Complete authentication and authorization flow test covering:
- User registration (client and admin)
- Login functionality
- Token-based authentication
- Role-based access control
- User CRUD operations (admin only)

### test_frontend_integration.py
Simulates the exact frontend login flow:
- Admin login
- Fetching all users
- Updating user information

### test_403_scenario.py
Reproduces 403 Forbidden error scenarios:
- Missing authentication
- Invalid token
- Insufficient permissions (client accessing admin endpoints)

## Running Tests

```bash
# Run all tests
python3 tests/test_auth_flow.py
python3 tests/test_frontend_integration.py
python3 tests/test_403_scenario.py

# Or individually
cd backend
python3 tests/test_auth_flow.py
```

## Test Results Summary

All backend APIs are working correctly:
- ✅ User Registration
- ✅ User Login (both client and admin)
- ✅ Authentication via JWT tokens
- ✅ Role-based authorization
- ✅ Get all users (admin only)
- ✅ Update user (admin only)
- ✅ Delete user (admin only)
- ✅ Proper 403 errors for unauthorized access
