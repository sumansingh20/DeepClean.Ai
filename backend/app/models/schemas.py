"""
Pydantic request/response schemas for A-DFP Firewall API
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# ============================================================================
# User & Auth Schemas
# ============================================================================

class UserRole(str, Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    CLIENT = "client"
    VIEWER = "viewer"


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8)
    organization: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    organization: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    role: str
    organization: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ============================================================================
# Session Schemas
# ============================================================================

class SessionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"


class ComponentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class SessionCreate(BaseModel):
    """Create new session"""
    pass


class SessionResponse(BaseModel):
    """Session response with all analysis results"""
    id: str
    session_token: str
    status: str
    
    # Component scores
    voice_score: Optional[float]
    voice_confidence: Optional[float]
    voice_status: str
    
    video_score: Optional[float]
    video_confidence: Optional[float]
    video_status: str
    
    document_score: Optional[float]
    document_confidence: Optional[float]
    document_status: str
    
    scam_score: Optional[float]
    scam_confidence: Optional[float]
    scam_status: str
    
    liveness_score: Optional[float]
    liveness_confidence: Optional[float]
    liveness_status: str
    
    # Final risk
    final_risk_score: Optional[float]
    risk_confidence: Optional[float]
    risk_category: Optional[str]
    action_taken: Optional[str]
    
    created_at: datetime
    expires_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Voice Analysis Schemas
# ============================================================================

class VoiceAnalysisRequest(BaseModel):
    session_id: str
    # File uploaded via multipart/form-data


class VoiceAnalysisResponse(BaseModel):
    session_id: str
    job_id: str
    status: str = "queued"
    message: str


class VoiceAnalysisResult(BaseModel):
    """Voice deepfake analysis result"""
    session_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    is_deepfake: bool
    explanations: List[str]
    
    # Detailed analysis
    speaker_embedding: Optional[List[float]]
    spectral_anomalies: List[str]
    artifacts_found: List[str]
    
    processing_time_ms: int
    model_version: str
    
    class Config:
        from_attributes = True


# ============================================================================
# Video Analysis Schemas
# ============================================================================

class VideoAnalysisRequest(BaseModel):
    session_id: str
    # File uploaded via multipart/form-data


class VideoAnalysisResponse(BaseModel):
    session_id: str
    job_id: str
    status: str = "queued"
    message: str


class FrameAnalysis(BaseModel):
    """Individual frame analysis"""
    frame_number: int
    timestamp_sec: float
    deepfake_score: float
    face_detected: bool
    face_confidence: float
    artifacts: List[str]


class VideoAnalysisResult(BaseModel):
    """Video deepfake analysis result"""
    session_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    is_deepfake: bool
    explanations: List[str]
    
    # Frame-level details
    total_frames_analyzed: int
    suspicious_frames: int
    frame_details: Optional[List[FrameAnalysis]]
    
    # Artifact detection
    artifacts_found: List[str]
    affected_timestamps: List[float]
    
    # Temporal analysis
    temporal_consistency_score: float
    motion_artifacts: List[str]
    
    processing_time_ms: int
    model_version: str
    
    class Config:
        from_attributes = True


# ============================================================================
# Document Analysis Schemas
# ============================================================================

class DocumentAnalysisRequest(BaseModel):
    session_id: str
    document_type: str = "id_card"  # "passport", "id_card", "license", "other"
    # File uploaded via multipart/form-data


class DocumentAnalysisResponse(BaseModel):
    session_id: str
    job_id: str
    status: str = "queued"
    message: str


class OCRResult(BaseModel):
    """OCR extracted text"""
    field_name: str
    extracted_text: str
    confidence: float


class DocumentAnalysisResult(BaseModel):
    """Document forgery analysis result"""
    session_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    is_forged: bool
    explanations: List[str]
    
    # OCR results
    ocr_results: List[OCRResult]
    document_type_detected: str
    
    # Forgery indicators
    forgery_clues: List[str]
    edge_anomalies: List[str]
    texture_anomalies: List[str]
    shadow_anomalies: List[str]
    
    # Quality metrics
    image_quality: float
    blur_detected: bool
    compression_level: int
    
    # Security features
    hologram_detected: Optional[bool]
    microprint_detected: Optional[bool]
    
    processing_time_ms: int
    model_version: str
    
    class Config:
        from_attributes = True


# ============================================================================
# Liveness Detection Schemas
# ============================================================================

class LivenessChallenge(str, Enum):
    BLINK = "blink_twice"
    HEAD_TURN_LEFT = "turn_head_left"
    HEAD_TURN_RIGHT = "turn_head_right"
    SMILE = "smile"
    OPEN_MOUTH = "open_mouth"
    SAY_PHRASE = "say_adfp_firewall"


class LivenessChallengeStart(BaseModel):
    """Request to start liveness challenge"""
    session_id: str


class LivenessChallengeStartResponse(BaseModel):
    """Liveness challenge initiated"""
    session_id: str
    challenge_type: str
    challenge_text: str
    timeout_seconds: int
    nonce: str


class LivenessChallengeVerify(BaseModel):
    """Submit liveness challenge response"""
    session_id: str
    challenge_nonce: str
    # Video file uploaded via multipart/form-data


class LivenessAnalysisResult(BaseModel):
    """Liveness detection result"""
    session_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    is_live: bool
    explanations: List[str]
    
    # Passive checks
    blink_detected: bool
    blink_count: int
    mouth_movement_detected: bool
    head_movement_detected: bool
    
    # Active checks
    challenge_completed: bool
    challenge_accuracy: float
    
    # Anti-spoofing
    replay_detected: bool
    video_artifacts: List[str]
    
    processing_time_ms: int
    model_version: str
    
    class Config:
        from_attributes = True


# ============================================================================
# Scam Call Analysis Schemas
# ============================================================================

class ScamAnalysisRequest(BaseModel):
    session_id: str
    # Audio file uploaded via multipart/form-data


class ScamAnalysisResponse(BaseModel):
    session_id: str
    job_id: str
    status: str = "queued"
    message: str


class ScamAnalysisResult(BaseModel):
    """Scam call pattern analysis"""
    session_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    is_scam: bool
    explanations: List[str]
    
    # Transcription
    transcript: str
    transcript_confidence: float
    
    # Pattern detection
    scam_patterns_detected: List[str]
    pattern_confidence: Dict[str, float]
    
    # Extracted info
    mentioned_entities: List[str]  # Names, amounts, etc.
    urgency_detected: bool
    authority_claim_detected: bool
    
    # Classification
    scam_category: Optional[str]  # "impersonation", "financial", "romance", etc.
    risk_factors: List[str]
    
    processing_time_ms: int
    model_version: str
    
    class Config:
        from_attributes = True


# ============================================================================
# Risk Scoring & Fusion Schemas
# ============================================================================

class ComponentScores(BaseModel):
    """Component-level scores"""
    voice: Optional[float]
    video: Optional[float]
    document: Optional[float]
    scam: Optional[float]
    liveness: Optional[float]
    
    class Config:
        from_attributes = True


class RiskScoreRequest(BaseModel):
    session_id: str


class RiskScoreResponse(BaseModel):
    """Final risk score and decision"""
    session_id: str
    final_risk_score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    
    # Component breakdown
    component_scores: ComponentScores
    
    # Risk category
    risk_category: str  # "low", "medium", "high"
    risk_level: int  # 1-10 scale
    
    # Decision
    action: str  # "allow", "challenge", "escalate", "block"
    action_reason: str
    
    # Explainability
    risk_factors: List[str]
    mitigating_factors: List[str]
    recommendations: List[str]
    
    # Timestamps
    calculated_at: datetime
    session_created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Incident Schemas
# ============================================================================

class ActionType(str, Enum):
    ALLOW = "allow"
    CHALLENGE = "challenge"
    ESCALATE = "escalate"
    BLOCK = "block"
    MANUAL_REVIEW = "manual_review"


class IncidentSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentCreate(BaseModel):
    session_id: str
    title: str
    description: str
    severity: IncidentSeverity
    action_taken: ActionType


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    review_notes: Optional[str] = None
    false_positive: Optional[bool] = None


class IncidentResponse(BaseModel):
    """Incident details"""
    id: str
    session_id: str
    user_id: str
    
    title: str
    description: str
    risk_score: float
    severity: str
    
    action_taken: str
    action_reason: str
    
    is_reviewed: bool
    reviewed_by: Optional[str]
    review_notes: Optional[str]
    false_positive: Optional[bool]
    
    component_scores: Dict[str, float]
    evidence_summary: Dict[str, Any]
    report_url: Optional[str]
    
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class IncidentListResponse(BaseModel):
    """List of incidents with pagination"""
    incidents: List[IncidentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ============================================================================
# Report Schemas
# ============================================================================

class ForensicReport(BaseModel):
    """Complete forensic incident report"""
    session_id: str
    incident_id: str
    
    # Executive summary
    title: str
    summary: str
    risk_score: float
    severity: str
    
    # Timeline
    session_created_at: datetime
    analysis_completed_at: datetime
    incident_created_at: datetime
    report_generated_at: datetime
    
    # Evidence
    component_results: Dict[str, Dict[str, Any]]
    artifacts_found: List[str]
    supporting_evidence: Dict[str, Any]
    
    # Recommendations
    recommendations: List[str]
    next_steps: List[str]
    
    # Metadata
    analyzed_by_model_versions: Dict[str, str]
    report_version: str
    compliance_notes: str


class ReportGenerateRequest(BaseModel):
    session_id: str
    format: str = "pdf"  # "pdf", "json", "html"
    include_raw_data: bool = False


class ReportGenerateResponse(BaseModel):
    session_id: str
    report_url: str
    format: str
    generated_at: datetime
    expires_at: datetime


# ============================================================================
# Webhook Schemas
# ============================================================================

class WebhookCreate(BaseModel):
    url: str = Field(..., pattern=r"^https?://")
    trigger_severities: List[IncidentSeverity]
    trigger_actions: List[ActionType]


class WebhookUpdate(BaseModel):
    url: Optional[str] = None
    active: Optional[bool] = None
    trigger_severities: Optional[List[IncidentSeverity]] = None
    trigger_actions: Optional[List[ActionType]] = None


class WebhookResponse(BaseModel):
    id: str
    url: str
    active: bool
    trigger_severities: List[str]
    trigger_actions: List[str]
    created_at: datetime
    last_triggered: Optional[datetime]
    failure_count: int
    
    class Config:
        from_attributes = True


class WebhookEventPayload(BaseModel):
    """Webhook event payload sent to client"""
    event_type: str  # "incident.created", "incident.resolved"
    incident_id: str
    session_id: str
    timestamp: datetime
    data: Dict[str, Any]
    signature: str  # HMAC signature


# ============================================================================
# Health & Status Schemas
# ============================================================================

class HealthCheckResponse(BaseModel):
    status: str  # "healthy", "degraded", "unhealthy"
    timestamp: datetime
    version: str
    
    # Component health
    database_healthy: bool
    redis_healthy: bool
    s3_healthy: bool
    ml_models_loaded: bool
    
    # Metrics
    sessions_processed_24h: int
    incidents_created_24h: int
    avg_response_time_ms: float
    error_rate: float


class SystemMetrics(BaseModel):
    """System performance metrics"""
    timestamp: datetime
    
    # Throughput
    requests_per_second: float
    sessions_per_minute: int
    
    # Latency
    avg_session_duration_seconds: float
    p95_latency_ms: float
    p99_latency_ms: float
    
    # Resource usage
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    
    # Queue status
    voice_queue_depth: int
    video_queue_depth: int
    document_queue_depth: int


# ============================================================================
# Error Response Schema
# ============================================================================

class ErrorResponse(BaseModel):
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime
    request_id: str


# ============================================================================
# Health Check Schemas
# ============================================================================

class HealthResponse(BaseModel):
    """Quick health check response"""
    status: str
    timestamp: datetime
    version: str


class HealthDetailedResponse(BaseModel):
    """Detailed health check response"""
    status: str
    timestamp: datetime
    version: str
    database: str
    cache: str
    message_queue: str
    ml_models: str
