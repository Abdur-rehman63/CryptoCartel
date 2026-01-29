import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.core.security import get_password_hash
from app.models.models import User, UserRole
import secrets

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Setup and teardown test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_db():
    """Get test database session"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def admin_user(test_db):
    """Create test admin user"""
    user = User(
        id=secrets.token_urlsafe(16),
        email="admin@test.com",
        name="Test Admin",
        hashed_password=get_password_hash("password123"),
        role=UserRole.ADMIN,
        initial_deposit=0
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def client_user(test_db):
    """Create test client user"""
    user = User(
        id=secrets.token_urlsafe(16),
        email="client@test.com",
        name="Test Client",
        hashed_password=get_password_hash("password123"),
        role=UserRole.CLIENT,
        initial_deposit=10000
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def admin_token(admin_user):
    """Get admin authentication token"""
    response = client.post(
        "/auth/login",
        json={"email": "admin@test.com", "password": "password123"}
    )
    return response.json()["access_token"]


@pytest.fixture
def client_token(client_user):
    """Get client authentication token"""
    response = client.post(
        "/auth/login",
        json={"email": "client@test.com", "password": "password123"}
    )
    return response.json()["access_token"]
