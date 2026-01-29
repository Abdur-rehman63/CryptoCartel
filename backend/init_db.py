#!/usr/bin/env python3
"""
Database Initialization Script
Creates tables and initial users for the Crypto Cartel platform
"""

import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.models import User, UserRole
from app.core.security import get_password_hash
import secrets

def init_database():
    """Initialize database with tables and default users"""
    
    print("🚀 Initializing Crypto Cartel Database...")
    print("=" * 50)
    
    try:
        # Create all tables
        print("\n📊 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✓ Tables created successfully")
        
        # Create session
        db = SessionLocal()
        
        try:
            # Create admin user
            print("\n👤 Creating admin user...")
            admin = db.query(User).filter(User.email == "admin@cryptocartel.com").first()
            
            if not admin:
                admin = User(
                    id=secrets.token_urlsafe(16),
                    email="admin@cryptocartel.com",
                    name="Admin User",
                    hashed_password=get_password_hash("admin123"),
                    role=UserRole.ADMIN,
                    initial_deposit=0
                )
                db.add(admin)
                db.commit()
                print("✓ Admin user created")
                print("  📧 Email: admin@cryptocartel.com")
                print("  🔑 Password: admin123")
            else:
                print("✓ Admin user already exists")
            
            # Create test client
            print("\n👤 Creating test client...")
            client = db.query(User).filter(User.email == "client@test.com").first()
            
            if not client:
                client = User(
                    id=secrets.token_urlsafe(16),
                    email="client@test.com",
                    name="Test Client",
                    hashed_password=get_password_hash("client123"),
                    role=UserRole.CLIENT,
                    initial_deposit=10000
                )
                db.add(client)
                db.commit()
                print("✓ Test client created")
                print("  📧 Email: client@test.com")
                print("  🔑 Password: client123")
                print("  💰 Initial Deposit: $10,000")
            else:
                print("✓ Test client already exists")
            
            print("\n" + "=" * 50)
            print("✅ Database initialization complete!")
            print("=" * 50)
            print("\n📝 Default Users:")
            print("  Admin: admin@cryptocartel.com / admin123")
            print("  Client: client@test.com / client123")
            print("\n🚀 You can now start the server:")
            print("  bash start_server.sh")
            print("\n📚 API Documentation:")
            print("  http://localhost:8000/docs")
            print()
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"\n❌ Error initializing database: {e}")
        print("\n💡 Troubleshooting:")
        print("  1. Check if PostgreSQL is running:")
        print("     sudo systemctl status postgresql")
        print("  2. Verify database exists:")
        print("     sudo -u postgres psql -c '\\l'")
        print("  3. Check DATABASE_URL in .env file")
        print("  4. Or use SQLite for testing (update .env):")
        print("     DATABASE_URL=sqlite:///./test.db")
        sys.exit(1)

if __name__ == "__main__":
    init_database()
