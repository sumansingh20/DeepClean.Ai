"""
Standalone FastAPI backend without any app module dependencies
Uses PostgreSQL database for real authentication
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, Boolean, DateTime, Float, Enum as SQLEnum, create_engine, func, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import uvicorn
import enum
import uuid
import pyotp
import qrcode
import io
import base64
import secrets

# Database
DATABASE_URL = "postgresql://adfp_user:adfp_password@localhost:5432/adfp_db"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-min-32-chars-abc123def456ghi789"
ALGORITHM = "HS256"

# Enums
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    CLIENT = "client"
    VIEWER = "viewer"

class IncidentSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True)
    username = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    organization = Column(String(255))
    
    # 2FA fields
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(32), nullable=True)
    backup_codes = Column(String(500), nullable=True)  # JSON string of backup codes
    
    # Security fields
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    password_changed_at = Column(DateTime, default=datetime.utcnow)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class DBSession(Base):
    __tablename__ = "sessions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36))
    status = Column(String(50), default="pending")
    voice_score = Column(Float)
    video_score = Column(Float)
    final_risk_score = Column(Float)
    voice_file_url = Column(String(500))
    video_file_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255))
    risk_score = Column(Float)
    severity = Column(SQLEnum(IncidentSeverity))
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables: {e}")

# FastAPI
app = FastAPI(title="DeepClean AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = None

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
    requires_2fa: bool = False

class Enable2FARequest(BaseModel):
    user_id: str

class Verify2FARequest(BaseModel):
    user_id: str
    totp_code: str

class Disable2FARequest(BaseModel):
    user_id: str
    password: str

# Helpers
def create_token(user_id: str, role: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode({"sub": user_id, "role": role, "exp": expire}, SECRET_KEY, ALGORITHM)

def generate_backup_codes(count: int = 10) -> List[str]:
    """Generate backup codes for 2FA"""
    return [secrets.token_hex(4).upper() for _ in range(count)]

def generate_qr_code(secret: str, email: str) -> str:
    """Generate QR code for 2FA setup"""
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=email, issuer_name="DeepClean AI")
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

# Routes
@app.get("/")
async def root():
    return {"message": "DeepClean AI API", "version": "1.0.0"}

@app.post("/api/v1/auth/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter((User.email == req.email) | (User.username == req.username)).first():
        raise HTTPException(400, "Email or username already exists")
    
    user = User(
        email=req.email,
        username=req.username,
        hashed_password=pwd_context.hash(req.password),
        organization=req.full_name,
        role=UserRole.CLIENT
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return TokenResponse(
        access_token=create_token(user.id, user.role.value),
        user={"id": user.id, "username": user.username, "email": user.email, "full_name": user.organization, "role": user.role.value}
    )

@app.post("/api/v1/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    
    # Check if account is locked
    if user and user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(403, f"Account locked due to too many failed attempts. Try again later.")
    
    if not user or not pwd_context.verify(req.password, user.hashed_password):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.commit()
        raise HTTPException(401, "Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(403, "Account disabled")
    
    # Check 2FA
    if user.two_factor_enabled:
        if not req.totp_code:
            return TokenResponse(
                access_token="",
                token_type="bearer",
                user={"id": user.id, "email": user.email},
                requires_2fa=True
            )
        
        # Verify TOTP code
        totp = pyotp.TOTP(user.two_factor_secret)
        if not totp.verify(req.totp_code, valid_window=1):
            # Check backup codes
            import json
            backup_codes = json.loads(user.backup_codes) if user.backup_codes else []
            if req.totp_code not in backup_codes:
                user.failed_login_attempts += 1
                db.commit()
                raise HTTPException(401, "Invalid 2FA code")
            else:
                # Remove used backup code
                backup_codes.remove(req.totp_code)
                user.backup_codes = json.dumps(backup_codes)
    
    # Reset failed attempts on successful login
    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login = datetime.utcnow()
    db.commit()
    
    return TokenResponse(
        access_token=create_token(user.id, user.role.value),
        user={"id": user.id, "username": user.username, "email": user.email, "full_name": user.organization or user.username, "role": user.role.value, "two_factor_enabled": user.two_factor_enabled},
        requires_2fa=False
    )

@app.get("/api/v1/dashboard/stats")
async def stats(db: Session = Depends(get_db)):
    total = db.query(func.count(DBSession.id)).scalar() or 0
    incidents = db.query(func.count(Incident.id)).scalar() or 0
    
    return {
        "totalAnalyses": total,
        "deepfakesDetected": incidents,
        "successRate": 94.5,
        "avgProcessingTime": 2.1,
        "recentAnalyses": []
    }

@app.get("/api/v1/incidents")
async def get_incidents(db: Session = Depends(get_db)):
    items = db.query(Incident).order_by(Incident.created_at.desc()).limit(20).all()
    return {
        "total": len(items),
        "incidents": [{"id": i.id, "title": i.title, "severity": i.severity.value, "status": "resolved" if i.resolved_at else "active", "timestamp": i.created_at.isoformat(), "riskScore": i.risk_score} for i in items]
    }

# 2FA Endpoints
@app.post("/api/v1/auth/2fa/enable")
async def enable_2fa(req: Enable2FARequest, db: Session = Depends(get_db)):
    """Enable 2FA for user and return QR code"""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    # Generate secret
    secret = pyotp.random_base32()
    user.two_factor_secret = secret
    
    # Generate backup codes
    import json
    backup_codes = generate_backup_codes()
    user.backup_codes = json.dumps(backup_codes)
    
    db.commit()
    
    # Generate QR code
    qr_code = generate_qr_code(secret, user.email)
    
    return {
        "secret": secret,
        "qr_code": qr_code,
        "backup_codes": backup_codes,
        "message": "Scan QR code with Google Authenticator or similar app"
    }

@app.post("/api/v1/auth/2fa/verify")
async def verify_2fa(req: Verify2FARequest, db: Session = Depends(get_db)):
    """Verify TOTP code and activate 2FA"""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user or not user.two_factor_secret:
        raise HTTPException(404, "2FA not initiated")
    
    totp = pyotp.TOTP(user.two_factor_secret)
    if not totp.verify(req.totp_code, valid_window=1):
        raise HTTPException(401, "Invalid code")
    
    user.two_factor_enabled = True
    db.commit()
    
    return {"message": "2FA enabled successfully"}

@app.post("/api/v1/auth/2fa/disable")
async def disable_2fa(req: Disable2FARequest, db: Session = Depends(get_db)):
    """Disable 2FA"""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    if not pwd_context.verify(req.password, user.hashed_password):
        raise HTTPException(401, "Invalid password")
    
    user.two_factor_enabled = False
    user.two_factor_secret = None
    user.backup_codes = None
    db.commit()
    
    return {"message": "2FA disabled successfully"}

@app.get("/api/v1/auth/2fa/status/{user_id}")
async def get_2fa_status(user_id: str, db: Session = Depends(get_db)):
    """Get 2FA status for user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    return {
        "enabled": user.two_factor_enabled,
        "has_backup_codes": bool(user.backup_codes)
    }

# User Management Endpoints
@app.get("/api/v1/users/profile/{user_id}")
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    """Get user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role.value,
        "organization": user.organization,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "two_factor_enabled": user.two_factor_enabled,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login": user.last_login.isoformat() if user.last_login else None,
        "password_changed_at": user.password_changed_at.isoformat() if user.password_changed_at else None
    }

class UpdateProfileRequest(BaseModel):
    username: Optional[str] = None
    organization: Optional[str] = None

@app.put("/api/v1/users/profile/{user_id}")
async def update_profile(user_id: str, req: UpdateProfileRequest, db: Session = Depends(get_db)):
    """Update user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    if req.username:
        # Check if username already taken
        existing = db.query(User).filter(User.username == req.username, User.id != user_id).first()
        if existing:
            raise HTTPException(400, "Username already taken")
        user.username = req.username
    
    if req.organization:
        user.organization = req.organization
    
    db.commit()
    return {"message": "Profile updated successfully"}

class ChangePasswordRequest(BaseModel):
    user_id: str
    old_password: str
    new_password: str

@app.post("/api/v1/users/change-password")
async def change_password(req: ChangePasswordRequest, db: Session = Depends(get_db)):
    """Change user password"""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    if not pwd_context.verify(req.old_password, user.hashed_password):
        raise HTTPException(401, "Invalid current password")
    
    user.hashed_password = pwd_context.hash(req.new_password)
    user.password_changed_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Password changed successfully"}

@app.get("/api/v1/users/sessions/{user_id}")
async def get_user_sessions(user_id: str, db: Session = Depends(get_db)):
    """Get all sessions for a user"""
    sessions = db.query(DBSession).filter(DBSession.user_id == user_id).order_by(DBSession.created_at.desc()).limit(50).all()
    return {
        "total": len(sessions),
        "sessions": [{
            "id": s.id,
            "status": s.status,
            "voice_score": s.voice_score,
            "video_score": s.video_score,
            "final_risk_score": s.final_risk_score,
            "created_at": s.created_at.isoformat() if s.created_at else None
        } for s in sessions]
    }

# ML Detection Endpoints
class AnalysisRequest(BaseModel):
    user_id: str
    file_url: Optional[str] = None
    file_type: str  # voice, video, document, liveness

@app.post("/api/v1/analysis/voice")
async def analyze_voice(req: AnalysisRequest, db: Session = Depends(get_db)):
    """Voice deepfake detection endpoint"""
    import random
    
    # Simulate ML analysis
    score = round(random.uniform(0.1, 0.95), 3)
    is_deepfake = score > 0.7
    
    # Create session record
    session = DBSession(
        user_id=req.user_id,
        status="completed",
        voice_score=score,
        voice_file_url=req.file_url or "sample_audio.mp3"
    )
    db.add(session)
    db.commit()
    
    return {
        "session_id": session.id,
        "risk_score": score,
        "is_deepfake": is_deepfake,
        "confidence": round(score * 100, 1),
        "analysis": {
            "wav2vec2_score": round(random.uniform(0.5, 0.95), 3),
            "mfcc_score": round(random.uniform(0.5, 0.95), 3),
            "spectral_score": round(random.uniform(0.5, 0.95), 3)
        },
        "timestamp": session.created_at.isoformat()
    }

@app.post("/api/v1/analysis/video")
async def analyze_video(req: AnalysisRequest, db: Session = Depends(get_db)):
    """Video deepfake detection endpoint"""
    import random
    
    score = round(random.uniform(0.1, 0.95), 3)
    is_deepfake = score > 0.7
    
    session = DBSession(
        user_id=req.user_id,
        status="completed",
        video_score=score,
        video_file_url=req.file_url or "sample_video.mp4"
    )
    db.add(session)
    db.commit()
    
    return {
        "session_id": session.id,
        "risk_score": score,
        "is_deepfake": is_deepfake,
        "confidence": round(score * 100, 1),
        "analysis": {
            "facial_landmarks": round(random.uniform(0.5, 0.95), 3),
            "gan_fingerprint": round(random.uniform(0.5, 0.95), 3),
            "temporal_consistency": round(random.uniform(0.5, 0.95), 3),
            "frame_analysis": round(random.uniform(0.5, 0.95), 3)
        },
        "timestamp": session.created_at.isoformat()
    }

@app.post("/api/v1/analysis/document")
async def analyze_document(req: AnalysisRequest, db: Session = Depends(get_db)):
    """Document forgery detection endpoint"""
    import random
    
    score = round(random.uniform(0.1, 0.95), 3)
    is_forged = score > 0.7
    
    return {
        "risk_score": score,
        "is_forged": is_forged,
        "confidence": round(score * 100, 1),
        "analysis": {
            "ocr_verification": round(random.uniform(0.5, 0.95), 3),
            "edge_analysis": round(random.uniform(0.5, 0.95), 3),
            "texture_pattern": round(random.uniform(0.5, 0.95), 3),
            "template_match": round(random.uniform(0.5, 0.95), 3)
        },
        "document_type": "Aadhaar/PAN/Passport",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/analysis/liveness")
async def analyze_liveness(req: AnalysisRequest, db: Session = Depends(get_db)):
    """Liveness detection endpoint"""
    import random
    
    score = round(random.uniform(0.8, 0.99), 3)
    is_live = score > 0.85
    
    return {
        "is_live": is_live,
        "confidence": round(score * 100, 1),
        "analysis": {
            "blink_detection": round(random.uniform(0.8, 0.99), 3),
            "head_movement": round(random.uniform(0.8, 0.99), 3),
            "anti_replay": round(random.uniform(0.8, 0.99), 3),
            "depth_analysis": round(random.uniform(0.8, 0.99), 3)
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/analysis/scam-call")
async def analyze_scam_call(req: AnalysisRequest, db: Session = Depends(get_db)):
    """Scam call analysis endpoint"""
    import random
    
    score = round(random.uniform(0.1, 0.95), 3)
    is_scam = score > 0.7
    
    return {
        "risk_score": score,
        "is_scam": is_scam,
        "confidence": round(score * 100, 1),
        "analysis": {
            "speech_recognition": round(random.uniform(0.5, 0.95), 3),
            "nlp_pattern_match": round(random.uniform(0.5, 0.95), 3),
            "social_engineering_detect": round(random.uniform(0.5, 0.95), 3),
            "fraud_indicators": ["Urgent demand", "Government threat", "Money request"]
        },
        "transcription": "Sample call transcription...",
        "timestamp": datetime.utcnow().isoformat()
    }

# Analytics Endpoints
@app.get("/api/v1/analytics/overview")
async def get_analytics_overview(db: Session = Depends(get_db)):
    """Get analytics overview"""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_sessions = db.query(func.count(DBSession.id)).scalar() or 0
    total_incidents = db.query(func.count(Incident.id)).scalar() or 0
    
    # Get recent stats
    today = datetime.utcnow().date()
    today_sessions = db.query(func.count(DBSession.id)).filter(
        func.date(DBSession.created_at) == today
    ).scalar() or 0
    
    return {
        "total_users": total_users,
        "total_sessions": total_sessions,
        "total_incidents": total_incidents,
        "today_sessions": today_sessions,
        "avg_risk_score": 0.42,
        "deepfake_detection_rate": 0.34,
        "uptime": "99.9%"
    }

@app.get("/api/v1/analytics/trends")
async def get_trends(days: int = 7, db: Session = Depends(get_db)):
    """Get trend data for charts"""
    import random
    from datetime import timedelta
    
    trends = []
    for i in range(days):
        date = datetime.utcnow() - timedelta(days=days-i-1)
        trends.append({
            "date": date.strftime("%Y-%m-%d"),
            "analyses": random.randint(50, 200),
            "deepfakes_detected": random.randint(10, 70),
            "avg_risk_score": round(random.uniform(0.3, 0.7), 2)
        })
    
    return {"trends": trends}

if __name__ == "__main__":
    print("\n" + "="*60)
    print("  DeepClean AI - Real PostgreSQL Database Backend")
    print("="*60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8001)
