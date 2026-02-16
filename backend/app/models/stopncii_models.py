"""
SQLAlchemy Database Models for StopNCII Platform
=================================================

Production-ready models for:
- Media hash storage (PDQ/TMK hashes)
- Analysis jobs tracking
- Content reports and takedown requests
- Hash matching records
- Audit logging
"""

from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, JSON, ForeignKey, Text, Index, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from datetime import datetime, timedelta
import uuid

Base = declarative_base()


class MediaHash(Base):
    """
    Stores perceptual hashes of reported content.
    Only stores hashes - NO original media files.
    """
    __tablename__ = "media_hashes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Hash data
    hash_value = Column(String(256), nullable=False, index=True)  # 256-char hex string for PDQ/TMK
    hash_type = Column(String(20), nullable=False, index=True)  # 'pdq', 'tmk', 'pdq+tmk'
    
    # Media metadata (NO actual media stored)
    media_type = Column(String(20), nullable=False)  # 'image', 'video'
    file_size_bytes = Column(Integer)
    duration_seconds = Column(Float, nullable=True)  # For videos
    resolution = Column(String(20), nullable=True)  # e.g. "1920x1080"
    
    # Analysis results
    is_deepfake = Column(Boolean, default=False, index=True)
    deepfake_confidence = Column(Float)
    deepfake_model_version = Column(String(50))
    
    # Ownership and status
    uploaded_by_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    status = Column(String(20), default='active', index=True)  # 'active', 'removed', 'disputed'
    
    # Matching statistics
    match_count = Column(Integer, default=0)  # Number of times this hash matched new uploads
    report_count = Column(Integer, default=0)  # Number of reports filed
    takedown_count = Column(Integer, default=0)  # Number of successful takedowns
    
    # Privacy flags
    victim_consent_obtained = Column(Boolean, default=False)
    contains_minor = Column(Boolean, default=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)  # Optional expiration for temporary hashes
    
    # Relationships
    analysis_jobs = relationship("AnalysisJob", back_populates="media_hash")
    reports = relationship("ContentReport", back_populates="media_hash")
    matches = relationship("HashMatch", foreign_keys="[HashMatch.matched_hash_id]", back_populates="matched_hash")
    
    __table_args__ = (
        Index('idx_hash_value_type', 'hash_value', 'hash_type'),
        Index('idx_status_deepfake', 'status', 'is_deepfake'),
        Index('idx_created_at_desc', 'created_at', postgresql_ops={'created_at': 'DESC'}),
    )


class AnalysisJob(Base):
    """
    Tracks asynchronous media analysis jobs.
    Files are processed in-memory and deleted immediately after.
    """
    __tablename__ = "analysis_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Job metadata
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    media_hash_id = Column(UUID(as_uuid=True), ForeignKey('media_hashes.id'), nullable=True, index=True)
    
    # Job status
    status = Column(String(20), default='queued', nullable=False, index=True)  # queued, processing, completed, failed
    progress = Column(Integer, default=0)  # 0-100
    current_step = Column(String(100), nullable=True)  # 'hashing', 'detecting', 'matching'
    
    # File metadata (temporary - file deleted after processing)
    original_filename = Column(String(255))
    file_size_bytes = Column(Integer)
    media_type = Column(String(20))  # 'image', 'video'
    temp_file_path = Column(String(500), nullable=True)  # Deleted after processing
    
    # Analysis results
    pdq_hash = Column(String(256), nullable=True)
    tmk_hash = Column(String(256), nullable=True)
    is_deepfake = Column(Boolean, nullable=True)
    deepfake_confidence = Column(Float, nullable=True)
    
    # Matching results
    matches_found = Column(Boolean, default=False)
    match_count = Column(Integer, default=0)
    highest_similarity = Column(Float, nullable=True)  # 0.0 to 1.0
    
    # User-provided metadata
    description = Column(Text, nullable=True)
    context = Column(Text, nullable=True)
    metadata = Column(JSONB, nullable=True)
    
    # Error handling
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    
    # Timing
    estimated_time_seconds = Column(Integer, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(hours=24))
    
    # Relationships
    media_hash = relationship("MediaHash", back_populates="analysis_jobs")
    
    __table_args__ = (
        Index('idx_user_status', 'user_id', 'status'),
        Index('idx_created_at_desc', 'created_at', postgresql_ops={'created_at': 'DESC'}),
    )


class ContentReport(Base):
    """
    Reports of NCII or deepfake content on platforms.
    Used to track takedown requests and enforcement.
    """
    __tablename__ = "content_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Reporter info
    reporter_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    reporter_email_encrypted = Column(String(500), nullable=True)  # Encrypted for privacy
    
    # Content identification
    media_hash_id = Column(UUID(as_uuid=True), ForeignKey('media_hashes.id'), nullable=False, index=True)
    
    # Report details
    report_type = Column(String(50), nullable=False, index=True)  # 'ncii', 'deepfake', 'csam', 'harassment'
    description = Column(Text, nullable=False)
    
    # Evidence
    platform_names = Column(ARRAY(String), nullable=True)  # ['facebook', 'instagram', 'twitter']
    platform_urls = Column(ARRAY(String), nullable=True)  # URLs where content appears
    evidence_urls = Column(ARRAY(String), nullable=True)  # Links to additional evidence
    evidence_data = Column(JSONB, nullable=True)  # Structured evidence
    
    # Victim information
    victim_name_encrypted = Column(String(500), nullable=True)
    victim_email_encrypted = Column(String(500), nullable=True)
    victim_consent_obtained = Column(Boolean, default=False, nullable=False)
    is_victim_minor = Column(Boolean, default=False, index=True)
    
    # Priority and routing
    priority = Column(String(20), default='medium', index=True)  # 'urgent', 'high', 'medium', 'low'
    severity = Column(String(20), nullable=True)  # 'critical', 'high', 'medium', 'low'
    auto_priority_score = Column(Float, nullable=True)  # ML-computed priority score
    
    # Status tracking
    status = Column(String(20), default='pending', nullable=False, index=True)  # pending, reviewing, approved, rejected, resolved
    assigned_to_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True, index=True)
    
    # Review details
    reviewed_at = Column(DateTime, nullable=True)
    review_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Takedown tracking
    takedown_initiated = Column(Boolean, default=False)
    takedown_count = Column(Integer, default=0)  # Number of platforms where takedown was requested
    takedown_success_count = Column(Integer, default=0)
    
    # Legal support
    legal_support_requested = Column(Boolean, default=False)
    legal_case_number = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    estimated_review_time_hours = Column(Integer, nullable=True)
    
    # Relationships
    media_hash = relationship("MediaHash", back_populates="reports")
    takedown_requests = relationship("TakedownRequest", back_populates="report")
    
    __table_args__ = (
        Index('idx_status_priority', 'status', 'priority'),
        Index('idx_reporter_created', 'reporter_user_id', 'created_at'),
        Index('idx_assigned_status', 'assigned_to_user_id', 'status'),
    )


class TakedownRequest(Base):
    """
    Tracks individual takedown requests sent to platforms.
    One report can generate multiple takedown requests.
    """
    __tablename__ = "takedown_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Links
    report_id = Column(UUID(as_uuid=True), ForeignKey('content_reports.id'), nullable=False, index=True)
    media_hash_id = Column(UUID(as_uuid=True), ForeignKey('media_hashes.id'), nullable=False, index=True)
    
    # Platform details
    platform_name = Column(String(100), nullable=False, index=True)  # 'facebook', 'twitter', 'instagram', etc.
    platform_content_id = Column(String(255), nullable=True)  # Platform's internal ID for the content
    platform_content_url = Column(String(1000), nullable=True)
    
    # Request details
    request_type = Column(String(50), nullable=False)  # 'api', 'form', 'email', 'manual'
    request_payload = Column(JSONB, nullable=True)  # What was sent to platform
    
    # Status
    status = Column(String(20), default='pending', nullable=False, index=True)  # pending, sent, acknowledged, removed, rejected, appealed
    
    # Response from platform
    platform_response = Column(JSONB, nullable=True)
    platform_ticket_id = Column(String(255), nullable=True)
    removal_confirmed = Column(Boolean, default=False)
    rejection_reason = Column(Text, nullable=True)
    
    # Timing
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    sent_at = Column(DateTime, nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    # Retry logic
    retry_count = Column(Integer, default=0)
    last_retry_at = Column(DateTime, nullable=True)
    
    # Relationships
    report = relationship("ContentReport", back_populates="takedown_requests")
    
    __table_args__ = (
        Index('idx_platform_status', 'platform_name', 'status'),
        Index('idx_report_created', 'report_id', 'created_at'),
    )


class HashMatch(Base):
    """
    Records when a new upload matches an existing hash.
    Used for analytics and prevention tracking.
    """
    __tablename__ = "hash_matches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Match details
    original_hash_id = Column(UUID(as_uuid=True), ForeignKey('media_hashes.id'), nullable=False, index=True)  # Hash from new upload
    matched_hash_id = Column(UUID(as_uuid=True), ForeignKey('media_hashes.id'), nullable=False, index=True)  # Existing hash in database
    
    # Similarity metrics
    hamming_distance = Column(Integer, nullable=False)  # 0-256 for PDQ
    similarity_score = Column(Float, nullable=False)  # 0.0-1.0
    match_type = Column(String(20), nullable=False)  # 'exact', 'near', 'rotated', 'modified'
    
    # User who triggered the match
    detected_by_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True, index=True)
    
    # Context
    detection_context = Column(String(50), nullable=True)  # 'upload', 'api_check', 'bulk_scan'
    platform_name = Column(String(100), nullable=True)  # If from platform API check
    
    # Action taken
    action_taken = Column(String(50), nullable=True)  # 'blocked', 'flagged', 'allowed_with_warning'
    
    # Metadata
    metadata = Column(JSONB, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    matched_hash = relationship("MediaHash", foreign_keys=[matched_hash_id], back_populates="matches")
    
    __table_args__ = (
        Index('idx_matched_created', 'matched_hash_id', 'created_at'),
        Index('idx_similarity_score', 'similarity_score', postgresql_ops={'similarity_score': 'DESC'}),
    )


class AuditLog(Base):
    """
    Comprehensive audit logging for compliance (GDPR, DMCA, etc.)
    Tracks all actions on sensitive content.
    """
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Action details
    action = Column(String(100), nullable=False, index=True)  # 'upload', 'report_submit', 'hash_match', 'takedown_sent'
    resource_type = Column(String(50), nullable=False)  # 'media_hash', 'report', 'takedown'
    resource_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    
    # Actor
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True, index=True)
    user_email_encrypted = Column(String(500), nullable=True)
    user_role = Column(String(50), nullable=True)
    
    # Request metadata
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
    user_agent = Column(String(500), nullable=True)
    request_id = Column(String(100), nullable=True, index=True)
    
    # Action results
    status = Column(String(20), nullable=False)  # 'success', 'failure', 'partial'
    error_message = Column(Text, nullable=True)
    
    # Additional context
    details = Column(JSONB, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Partitioning hint for large tables
    __table_args__ = (
        Index('idx_action_created', 'action', 'created_at'),
        Index('idx_user_action', 'user_id', 'action'),
        Index('idx_resource', 'resource_type', 'resource_id'),
        # Partition by month for audit logs
        {'postgresql_partition_by': 'RANGE (created_at)'}  # Requires manual partition creation
    )
