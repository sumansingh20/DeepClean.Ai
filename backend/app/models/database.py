"""
Database models for A-DFP Firewall
SQLAlchemy ORM models for PostgreSQL
"""

from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, JSON, ForeignKey, Enum as SQLEnum, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import enum
import uuid
import os

Base = declarative_base()

# Database engine and session
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://deepfake_user:deepfake_password@localhost:5432/deepfake_db"
)

engine = create_engine(DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class UserRole(str, enum.Enum):
    """User roles for RBAC"""
    ADMIN = "admin"
    ANALYST = "analyst"
    CLIENT = "client"
    VIEWER = "viewer"


class IncidentSeverity(str, enum.Enum):
    """Incident severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ActionType(str, enum.Enum):
    """Actions taken by response engine"""
    ALLOW = "allow"
    CHALLENGE = "challenge"
    ESCALATE = "escalate"
    BLOCK = "block"
    MANUAL_REVIEW = "manual_review"


class ComponentStatus(str, enum.Enum):
    """Status of analysis components"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class User(Base):
    """User account"""
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True)
    username = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    organization = Column(String(255))
    api_key_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    sessions = relationship("Session", back_populates="user")
    incidents = relationship("Incident", back_populates="user")
    webhooks = relationship("Webhook", back_populates="user")


class Session(Base):
    """User session / fraud check request"""
    __tablename__ = "sessions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    session_token = Column(String(255), unique=True, index=True)
    nonce = Column(String(255), unique=True)
    status = Column(String(50), default="pending")  # pending, processing, completed
    
    # Analysis Results
    voice_score = Column(Float, nullable=True)
    voice_confidence = Column(Float, nullable=True)
    voice_status = Column(SQLEnum(ComponentStatus), default=ComponentStatus.PENDING)
    
    video_score = Column(Float, nullable=True)
    video_confidence = Column(Float, nullable=True)
    video_status = Column(SQLEnum(ComponentStatus), default=ComponentStatus.PENDING)
    
    document_score = Column(Float, nullable=True)
    document_confidence = Column(Float, nullable=True)
    document_status = Column(SQLEnum(ComponentStatus), default=ComponentStatus.PENDING)
    
    scam_score = Column(Float, nullable=True)
    scam_confidence = Column(Float, nullable=True)
    scam_status = Column(SQLEnum(ComponentStatus), default=ComponentStatus.PENDING)
    
    liveness_score = Column(Float, nullable=True)
    liveness_confidence = Column(Float, nullable=True)
    liveness_status = Column(SQLEnum(ComponentStatus), default=ComponentStatus.PENDING)
    liveness_challenge = Column(String(100), nullable=True)
    liveness_attempts = Column(Integer, default=0)
    
    # Risk Scoring
    final_risk_score = Column(Float, nullable=True)
    risk_confidence = Column(Float, nullable=True)
    risk_category = Column(String(20))  # low, medium, high
    action_taken = Column(SQLEnum(ActionType), nullable=True)
    
    # Metadata
    user_email_enc = Column(String(255), nullable=True)  # Encrypted
    user_phone_enc = Column(String(255), nullable=True)  # Encrypted
    ip_address = Column(String(45))  # IPv4 or IPv6
    user_agent = Column(String(500))
    device_info = Column(JSON)
    location = Column(JSON)  # Geolocation data
    
    # File references (stored in S3)
    voice_file_url = Column(String(500), nullable=True)
    video_file_url = Column(String(500), nullable=True)
    document_file_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)  # Session expiration
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    incident = relationship("Incident", back_populates="session", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="session")


class Incident(Base):
    """Fraud incident"""
    __tablename__ = "incidents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("sessions.id"), index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    
    # Incident details
    title = Column(String(255))
    description = Column(Text)
    risk_score = Column(Float)
    severity = Column(SQLEnum(IncidentSeverity), default=IncidentSeverity.HIGH)
    component_scores = Column(JSON)  # All component scores
    
    # Actions
    action_taken = Column(SQLEnum(ActionType))
    action_reason = Column(String(500))
    auto_action = Column(Boolean, default=True)  # Whether action was automatic
    
    # Investigation
    is_reviewed = Column(Boolean, default=False)
    reviewed_by = Column(String(36), nullable=True)  # User ID
    review_notes = Column(Text, nullable=True)
    false_positive = Column(Boolean, nullable=True)  # Mark as false positive
    
    # Evidence
    evidence_summary = Column(JSON)
    report_url = Column(String(500), nullable=True)
    forensic_data = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="incidents")
    session = relationship("Session", back_populates="incident")


class Webhook(Base):
    """Webhook configuration for incident notifications"""
    __tablename__ = "webhooks"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    
    url = Column(String(500))
    secret = Column(String(255))  # For HMAC signature
    active = Column(Boolean, default=True)
    
    # Event filtering
    trigger_severities = Column(JSON)  # ["high", "critical"]
    trigger_actions = Column(JSON)  # ["block", "escalate"]
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_triggered = Column(DateTime, nullable=True)
    failure_count = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="webhooks")


class AuditLog(Base):
    """Audit log for compliance and investigations"""
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("sessions.id"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    
    action = Column(String(100))  # "session_created", "voice_analyzed", "incident_escalated", etc.
    resource_type = Column(String(100))  # "session", "incident", "user", etc.
    resource_id = Column(String(100), index=True)
    
    # Details (JSON to avoid schema constraints)
    details = Column(JSON)  # Additional context
    status = Column(String(50))  # "success", "failure"
    error_message = Column(Text, nullable=True)
    
    # User info (encrypted in production)
    actor_email_enc = Column(String(255), nullable=True)
    actor_role = Column(String(50), nullable=True)
    
    # Request info
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    session = relationship("Session", back_populates="audit_logs")


class ComponentAnalysis(Base):
    """Detailed analysis results for each component"""
    __tablename__ = "component_analysis"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("sessions.id"), index=True)
    
    component = Column(String(50))  # "voice", "video", "document", "scam", "liveness"
    score = Column(Float)
    confidence = Column(Float)
    status = Column(SQLEnum(ComponentStatus))
    
    # Analysis details
    analysis_data = Column(JSON)  # Component-specific data
    explanations = Column(JSON)  # Human-readable explanations
    error_message = Column(Text, nullable=True)
    processing_time_ms = Column(Integer)  # Inference time
    
    # Model info
    model_version = Column(String(50))
    model_name = Column(String(100))
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class ModelMetadata(Base):
    """Track ML model versions and performance"""
    __tablename__ = "model_metadata"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    component = Column(String(50), index=True)  # "voice", "video", etc.
    model_name = Column(String(100))
    version = Column(String(50))
    path = Column(String(500))  # S3 or local path
    
    # Performance metrics
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    auc_roc = Column(Float, nullable=True)
    
    # Metadata
    framework = Column(String(50))  # "pytorch", "tensorflow", "onnx"
    input_shape = Column(JSON)
    output_shape = Column(JSON)
    parameters = Column(Integer)  # Number of parameters
    
    # Deployment
    is_active = Column(Boolean, default=True)
    deployed_at = Column(DateTime, default=datetime.utcnow)
    retired_at = Column(DateTime, nullable=True)
    
    # Training info
    training_dataset = Column(String(255))
    training_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class RiskPolicy(Base):
    """Configurable risk policies per client"""
    __tablename__ = "risk_policies"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), index=True)
    
    name = Column(String(100))
    description = Column(Text)
    
    # Score thresholds
    low_threshold = Column(Float)  # < this = low risk
    medium_threshold = Column(Float)  # < this = medium risk
    high_threshold = Column(Float)  # >= this = high risk
    
    # Actions
    action_low = Column(SQLEnum(ActionType))
    action_medium = Column(SQLEnum(ActionType))
    action_high = Column(SQLEnum(ActionType))
    
    # Component weights
    weights = Column(JSON)  # Override default weights
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
