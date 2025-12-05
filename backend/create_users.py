"""
Create default users in database
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import sys

# Setup
DATABASE_URL = "postgresql://adfp_user:adfp_password@localhost:5432/adfp_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = SessionLocal()

# Create admin
from real_main import User, UserRole
import uuid

try:
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@deepclean.ai").first()
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@deepclean.ai",
            username="admin",
            hashed_password=pwd_context.hash("admin123"),
            role=UserRole.ADMIN,
            organization="DeepClean AI",
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        print("✓ Created admin user")
    else:
        # Update password if exists
        admin.hashed_password = pwd_context.hash("admin123")
        print("✓ Updated admin password")
    
    # Check if moderator exists
    moderator = db.query(User).filter(User.email == "moderator@deepclean.ai").first()
    if not moderator:
        moderator = User(
            id=str(uuid.uuid4()),
            email="moderator@deepclean.ai",
            username="moderator",
            hashed_password=pwd_context.hash("mod123"),
            role=UserRole.ANALYST,
            organization="DeepClean AI",
            is_active=True,
            is_verified=True
        )
        db.add(moderator)
        print("✓ Created moderator user")
    else:
        # Update password if exists
        moderator.hashed_password = pwd_context.hash("mod123")
        print("✓ Updated moderator password")
    
    db.commit()
    print("\n✓✓✓ All default users created successfully! ✓✓✓\n")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()
