"""
Pydantic Request/Response Schemas for StopNCII Platform
========================================================

Production-ready validation models for all API endpoints.
"""

from pydantic import BaseModel, EmailStr, Field, validator, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


# ============================================================================
# Enums
# ============================================================================

class HashType(str, Enum):
    """Supported hash algorithms"""
    PDQ = "pdq"
    TMK = "tmk"
    PDQ_TMK = "pdq+tmk"


class MediaType(str, Enum):
    """Media types"""
    IMAGE = "image"
    VIDEO = "video"


class JobStatus(str, Enum):
    """Analysis job statuses"""
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ReportType(str, Enum):
    """Types of content reports"""
    NCII = "ncii"
    DEEPFAKE = "deepfake"
    CSAM = "csam"
    HARASSMENT = "harassment"
    REVENGE_PORN = "revenge_porn"


class ReportPriority(str, Enum):
    """Report priority levels"""
    URGENT = "urgent"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ReportStatus(str, Enum):
    """Report processing statuses"""
    PENDING = "pending"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    REJECTED = "rejected"
    RESOLVED = "resolved"


class MatchType(str, Enum):
    """Types of hash matches"""
    EXACT = "exact"
    NEAR = "near"
    ROTATED = "rotated"
    MODIFIED = "modified"


# ============================================================================
# Upload & Analysis Request/Response Models
# ============================================================================

class UploadMetadata(BaseModel):
    """Optional metadata for uploads"""
    description: Optional[str] = Field(None, max_length=1000)
    context: Optional[str] = Field(None, max_length=2000)
    victim_name: Optional[str] = Field(None, max_length=200)
    victim_email: Optional[EmailStr] = None
    contains_minor: bool = False
    consent_obtained: bool = False


class AnalysisJobResponse(BaseModel):
    """Response after initiating upload"""
    job_id: UUID
    status: JobStatus
    estimated_time_seconds: int
    websocket_url: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "job_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "queued",
                "estimated_time_seconds": 30,
                "websocket_url": "wss://api.example.com/ws/job/550e8400-e29b-41d4-a716-446655440000"
            }
        }


class HashResult(BaseModel):
    """Hash computation result"""
    hash_type: HashType
    hash_value: str = Field(..., min_length=64, max_length=256)
    computation_time_ms: int


class DeepfakeResult(BaseModel):
    """Deepfake detection result"""
    is_deepfake: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    model_version: str
    explanations: List[str]
    artifacts_detected: List[str]
    processing_time_ms: int


class MatchInfo(BaseModel):
    """Information about a matched hash"""
    matched_hash_id: UUID
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    hamming_distance: int = Field(..., ge=0)
    match_type: MatchType
    created_at: datetime
    report_count: int
    is_blocked: bool = True


class AnalysisStatus(BaseModel):
    """Complete analysis status and results"""
    job_id: UUID
    status: JobStatus
    progress: int = Field(..., ge=0, le=100)
    current_step: Optional[str] = None
    
    # Hash results
    pdq_hash: Optional[str] = None
    tmk_hash: Optional[str] = None
    hash_results: Optional[List[HashResult]] = None
    
    # Deepfake detection
    is_deepfake: Optional[bool] = None
    deepfake_confidence: Optional[float] = None
    deepfake_result: Optional[DeepfakeResult] = None
    
    # Matching results
    matches_found: bool = False
    match_count: int = 0
    matches: Optional[List[MatchInfo]] = None
    highest_similarity: Optional[float] = None
    
    # Timing
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    processing_time_ms: Optional[int] = None
    
    # Error handling
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# Hash Checking Request/Response Models
# ============================================================================

class HashCheckRequest(BaseModel):
    """Request to check if hash exists in database"""
    hash_value: str = Field(..., min_length=64, max_length=256)
    hash_type: HashType
    threshold: int = Field(default=10, ge=0, le=256, description="Maximum Hamming distance for match")
    
    class Config:
        json_schema_extra = {
            "example": {
                "hash_value": "f84c...a3d2",
                "hash_type": "pdq",
                "threshold": 10
            }
        }


class MatchResults(BaseModel):
    """Results from hash matching"""
    matches_found: bool
    match_count: int
    matches: List[MatchInfo]
    query_time_ms: Optional[int] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "matches_found": True,
                "match_count": 2,
                "matches": [
                    {
                        "matched_hash_id": "550e8400-e29b-41d4-a716-446655440000",
                        "similarity_score": 0.95,
                        "hamming_distance": 5,
                        "match_type": "near",
                        "created_at": "2025-12-01T10:30:00Z",
                        "report_count": 3,
                        "is_blocked": True
                    }
                ],
                "query_time_ms": 45
            }
        }


# ============================================================================
# Report Submission Request/Response Models
# ============================================================================

class ReportSubmission(BaseModel):
    """Submit a content report"""
    media_hash_id: UUID
    report_type: ReportType
    description: str = Field(..., min_length=20, max_length=5000)
    
    # Victim information (encrypted server-side)
    victim_name: Optional[str] = Field(None, max_length=200)
    victim_email: Optional[EmailStr] = None
    victim_consent_obtained: bool = Field(default=False)
    is_victim_minor: bool = Field(default=False)
    
    # Evidence
    platform_names: Optional[List[str]] = Field(None, max_items=20)
    platform_urls: Optional[List[HttpUrl]] = Field(None, max_items=50)
    evidence_urls: Optional[List[HttpUrl]] = Field(None, max_items=20)
    
    # Priority
    priority: ReportPriority = ReportPriority.MEDIUM
    
    # Legal support
    legal_support_requested: bool = False
    legal_case_number: Optional[str] = Field(None, max_length=100)
    
    @validator('description')
    def description_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Description cannot be empty')
        return v.strip()
    
    @validator('platform_names')
    def platform_names_not_empty(cls, v):
        if v is not None and len(v) == 0:
            raise ValueError('Platform names list cannot be empty if provided')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "media_hash_id": "550e8400-e29b-41d4-a716-446655440000",
                "report_type": "ncii",
                "description": "This intimate image was shared without my consent on multiple platforms...",
                "victim_consent_obtained": True,
                "platform_names": ["facebook", "instagram"],
                "platform_urls": ["https://facebook.com/example"],
                "priority": "high"
            }
        }


class ReportResponse(BaseModel):
    """Response after report submission"""
    report_id: UUID
    status: ReportStatus
    priority: ReportPriority
    created_at: datetime
    estimated_review_time_hours: int
    ticket_number: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "report_id": "660e8400-e29b-41d4-a716-446655440001",
                "status": "pending",
                "priority": "high",
                "created_at": "2025-12-06T14:30:00Z",
                "estimated_review_time_hours": 24,
                "ticket_number": "RPT-2025-001234"
            }
        }


class ReportDetail(BaseModel):
    """Detailed report information"""
    id: UUID
    report_type: ReportType
    description: str
    status: ReportStatus
    priority: ReportPriority
    
    # Media info
    media_hash_id: UUID
    media_type: MediaType
    is_deepfake: bool
    deepfake_confidence: Optional[float]
    
    # Platform tracking
    platform_names: Optional[List[str]]
    platform_urls: Optional[List[str]]
    
    # Takedown tracking
    takedown_initiated: bool
    takedown_count: int
    takedown_success_count: int
    
    # Status
    assigned_to: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    estimated_review_time_hours: Optional[int] = None
    
    class Config:
        from_attributes = True


class ReportListItem(BaseModel):
    """Condensed report info for list views"""
    id: UUID
    report_type: ReportType
    status: ReportStatus
    priority: ReportPriority
    platform_count: int
    takedown_success_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PaginatedReports(BaseModel):
    """Paginated list of reports"""
    reports: List[ReportListItem]
    total_items: int
    total_pages: int
    current_page: int
    page_size: int


# ============================================================================
# Takedown Request Models
# ============================================================================

class TakedownRequestCreate(BaseModel):
    """Create a takedown request"""
    report_id: UUID
    platform_name: str = Field(..., max_length=100)
    platform_content_url: HttpUrl
    additional_context: Optional[str] = Field(None, max_length=2000)


class TakedownStatus(BaseModel):
    """Takedown request status"""
    id: UUID
    platform_name: str
    status: str
    platform_ticket_id: Optional[str]
    removal_confirmed: bool
    created_at: datetime
    sent_at: Optional[datetime]
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# ============================================================================
# Evidence Generation Models
# ============================================================================

class EvidencePackageRequest(BaseModel):
    """Request evidence package generation"""
    report_id: UUID
    include_timeline: bool = True
    include_platform_responses: bool = True
    include_certificates: bool = True
    password_protect: bool = True


class EvidencePackageResponse(BaseModel):
    """Evidence package generation result"""
    package_id: UUID
    download_url: str
    expires_at: datetime
    file_size_bytes: int
    password_hint: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "package_id": "770e8400-e29b-41d4-a716-446655440002",
                "download_url": "https://s3.amazonaws.com/evidence/pkg.zip?signature=...",
                "expires_at": "2025-12-13T14:30:00Z",
                "file_size_bytes": 2458624,
                "password_hint": "Your report ticket number"
            }
        }


# ============================================================================
# Admin & Statistics Models
# ============================================================================

class PlatformStats(BaseModel):
    """Statistics for a platform"""
    platform_name: str
    total_takedowns: int
    successful_takedowns: int
    pending_takedowns: int
    average_response_time_hours: float
    success_rate: float


class SystemStats(BaseModel):
    """Overall system statistics"""
    total_hashes: int
    total_reports: int
    total_matches_prevented: int
    total_takedowns: int
    active_users: int
    platform_stats: List[PlatformStats]


# ============================================================================
# WebSocket Message Models
# ============================================================================

class WSJobUpdate(BaseModel):
    """WebSocket message for job updates"""
    type: str = "job_update"
    job_id: UUID
    status: JobStatus
    progress: int
    current_step: Optional[str]
    message: Optional[str]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class WSJobComplete(BaseModel):
    """WebSocket message for job completion"""
    type: str = "job_complete"
    job_id: UUID
    status: JobStatus
    result: AnalysisStatus
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class WSError(BaseModel):
    """WebSocket error message"""
    type: str = "error"
    job_id: Optional[UUID]
    error_code: str
    error_message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
