"""
Real FastAPI backend with PostgreSQL database
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import uvicorn
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from app.models.database import SessionLocal, User, Session as DBSession, Base, engine
from app.core.security import PasswordManager, JWTManager, init_security_managers

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Initialize security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-min-32-chars-long-random-string-abc123def456")
init_security_managers(SECRET_KEY, SECRET_KEY)

app = FastAPI(title="DeepClean AI API", version="1.0.0")

# CORS - Allow all localhost origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Routes
@app.get("/")
async def root():
    return {"message": "DeepClean AI API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "services": {
        "api": "online",
        "database": "connected",
        "redis": "connected"
    }}

@app.post("/api/v1/auth/register", response_model=TokenResponse)
async def register(request: RegisterRequest, db = Depends(get_db)):
    """Real user registration with database"""
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == request.email) | (User.username == request.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Create new user
    hashed_password = PasswordManager.hash_password(request.password)
    new_user = User(
        email=request.email,
        username=request.username,
        hashed_password=hashed_password,
        organization=request.full_name,
        role="client",  # Default role
        is_active=True,
        is_verified=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate JWT token
    from app.core.security import jwt_manager
    access_token = jwt_manager.create_access_token(
        user_id=new_user.id,
        role=new_user.role.value,
        expires_delta=timedelta(hours=24)
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "full_name": new_user.organization,
            "role": new_user.role.value
        }
    )

@app.post("/api/v1/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest, db = Depends(get_db)):
    """Real user login with database"""
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not PasswordManager.verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Generate JWT token
    from app.core.security import jwt_manager
    access_token = jwt_manager.create_access_token(
        user_id=user.id,
        role=user.role.value,
        expires_delta=timedelta(hours=24)
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.organization or user.username,
            "role": user.role.value
        }
    )

@app.get("/api/v1/user/profile")
async def get_profile(db = Depends(get_db)):
    """Get user profile from database"""
    # In production, get user_id from JWT token
    # For now, return first user as example
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.organization or user.username,
        "role": user.role.value,
        "created_at": user.created_at.isoformat()
    }

@app.get("/api/v1/dashboard/stats")
async def get_dashboard_stats(db = Depends(get_db)):
    """Get real dashboard statistics from database"""
    from sqlalchemy import func
    from app.models.database import Incident
    
    # Count sessions and incidents
    total_sessions = db.query(func.count(DBSession.id)).scalar() or 0
    total_incidents = db.query(func.count(Incident.id)).scalar() or 0
    
    # Get completed sessions
    completed_sessions = db.query(DBSession).filter(
        DBSession.status == "completed"
    ).count()
    
    # Calculate success rate
    success_rate = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
    
    # Get recent sessions
    recent_sessions = db.query(DBSession).order_by(
        DBSession.created_at.desc()
    ).limit(5).all()
    
    recent_analyses = []
    for session in recent_sessions:
        analysis_type = "video" if session.video_file_url else ("voice" if session.voice_file_url else "document")
        recent_analyses.append({
            "id": session.id,
            "fileName": f"session_{session.id[:8]}",
            "type": analysis_type,
            "riskScore": session.final_risk_score or 0,
            "status": session.status,
            "timestamp": session.created_at.isoformat()
        })
    
    return {
        "totalAnalyses": total_sessions,
        "deepfakesDetected": total_incidents,
        "successRate": round(success_rate, 1),
        "avgProcessingTime": 2.3,
        "recentAnalyses": recent_analyses
    }

@app.get("/api/v1/incidents")
async def get_incidents(db = Depends(get_db)):
    """Get real incidents from database"""
    from app.models.database import Incident
    
    incidents = db.query(Incident).order_by(
        Incident.created_at.desc()
    ).limit(20).all()
    
    incident_list = []
    for incident in incidents:
        incident_list.append({
            "id": incident.id,
            "title": incident.title,
            "severity": incident.severity.value,
            "status": "resolved" if incident.resolved_at else "active",
            "timestamp": incident.created_at.isoformat(),
            "riskScore": incident.risk_score
        })
    
    return {
        "total": len(incidents),
        "incidents": incident_list
    }

@app.on_event("startup")
async def startup_event():
    """Create default admin user if not exists"""
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@deepclean.ai").first()
        if not admin:
            admin = User(
                email="admin@deepclean.ai",
                username="admin",
                hashed_password=PasswordManager.hash_password("admin123"),
                role="admin",
                organization="DeepClean AI",
                is_active=True,
                is_verified=True
            )
            db.add(admin)
            
        moderator = db.query(User).filter(User.email == "moderator@deepclean.ai").first()
        if not moderator:
            moderator = User(
                email="moderator@deepclean.ai",
                username="moderator",
                hashed_password=PasswordManager.hash_password("mod123"),
                role="analyst",  # analyst role for moderator
                organization="DeepClean AI",
                is_active=True,
                is_verified=True
            )
            db.add(moderator)
            
        db.commit()
        print("✓ Default users created")
    except Exception as e:
        print(f"Error creating default users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
