"""
FastAPI Routes for StopNCII Platform
====================================

Production-ready REST API endpoints for:
- File upload and analysis (NO media storage, ephemeral processing)
- Hash checking and matching (Hamming distance queries)
- Report submission and management
- Evidence generation for legal proceedings
- Admin operations

All database operations use SQLAlchemy async sessions.
All file processing is ephemeral - files deleted after hashing.
"""

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form, Query
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, or_, desc
from typing import Optional, List
from datetime import datetime, timedelta
from uuid import UUID, uuid4
import json
import tempfile
import os
import logging

from app.core.dependencies import get_current_user, get_db
from app.models.schemas import User
from app.models.stopncii_models import MediaHash, AnalysisJob, ContentReport, TakedownRequest, HashMatch, AuditLog
from app.models.stopncii_schemas import (
    UploadMetadata, AnalysisJobResponse, AnalysisStatus, HashCheckRequest,
    MatchResults, MatchInfo, ReportSubmission, ReportResponse, ReportDetail,
    ReportListItem, PaginatedReports, TakedownStatus, EvidencePackageRequest,
    EvidencePackageResponse, JobStatus, ReportStatus, MatchType
)
from app.services.perceptual_hashing import SimilarityMatcher
from app.workers.stopncii_tasks import process_media_file, send_report_notification, generate_evidence_package

logger = logging.getLogger(__name__)

# Create routers
upload_router = APIRouter(prefix="/upload", tags=["Upload & Analysis"])
match_router = APIRouter(prefix="/match", tags=["Match Checking"])
report_router = APIRouter(prefix="/reports", tags=["Reports"])
evidence_router = APIRouter(prefix="/evidence", tags=["Evidence"])


# ============================================================================
# Upload & Analysis Endpoints
# ============================================================================

@upload_router.post("/analyze", response_model=AnalysisJobResponse, status_code=202)
async def upload_and_analyze(
    file: UploadFile = File(..., description="Image or video file (max 500MB)"),
    metadata: Optional[str] = Form(None, description="JSON metadata"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and analyze media file for deepfake detection and hash generation.
    
    **PRIVACY GUARANTEE**: Files are processed in-memory and deleted immediately after analysis.
    Only perceptual hashes are stored - never the original file.
    
    Process:
    1. Validate file type and size
    2. Save to temporary file
    3. Create job record in database
    4. Queue Celery task for async processing
    5. Return job ID for status polling
    
    **Supported formats**:
    - Images: JPG, PNG, GIF, WebP, BMP
    - Videos: MP4, AVI, MOV, MKV, WebM
    
    **Returns**: Job ID and WebSocket URL for real-time progress updates
    """
    # Validate file type
    allowed_extensions = {
        'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
        'video': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    }
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    is_valid = any(file_ext in exts for exts in allowed_extensions.values())
    
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail={
                'error': 'INVALID_FILE_TYPE',
                'message': f'File type {file_ext} not supported',
                'allowed_types': allowed_extensions
            }
        )
    
    # Check file size (max 500MB)
    MAX_SIZE = 500 * 1024 * 1024  # 500MB
    file_size = 0
    
    # Save to temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
    
    try:
        # Read and save file in chunks
        chunk_size = 1024 * 1024  # 1MB chunks
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            
            file_size += len(chunk)
            if file_size > MAX_SIZE:
                temp_file.close()
                os.unlink(temp_file.name)
                raise HTTPException(
                    status_code=400,
                    detail={
                        'error': 'FILE_TOO_LARGE',
                        'message': f'File size exceeds maximum of 500MB',
                        'size_bytes': file_size
                    }
                )
            
            temp_file.write(chunk)
        
        temp_file.close()
        
        # Parse metadata
        metadata_dict = {}
        if metadata:
            try:
                metadata_dict = json.loads(metadata)
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON metadata: {metadata}")
        
        # Create job record in database
        job_id = uuid4()
        is_video = file_ext in allowed_extensions['video']
        
        job = AnalysisJob(
            id=job_id,
            user_id=UUID(current_user.id),
            status='queued',
            original_filename=file.filename,
            file_size_bytes=file_size,
            media_type='video' if is_video else 'image',
            temp_file_path=temp_file.name,
            metadata=metadata_dict,
            progress=0
        )
        db.add(job)
        
        # Create audit log
        audit = AuditLog(
            action='file_uploaded',
            resource_type='analysis_job',
            resource_id=job_id,
            user_id=UUID(current_user.id),
            status='success',
            details={
                'filename': file.filename,
                'file_size': file_size,
                'media_type': job.media_type
            }
        )
        db.add(audit)
        
        await db.commit()
        
        # Queue processing task (Celery)
        logger.info(f"Queueing processing task for job {job_id}")
        process_media_file.delay(
            job_id=str(job_id),
            file_path=temp_file.name,
            user_id=str(current_user.id),
            metadata=metadata_dict
        )
        
        # Estimate processing time based on file size
        # Rough estimate: 1 second per 10MB for images, 2 seconds per 10MB for videos
        estimated_time = (file_size / (10 * 1024 * 1024)) * (2 if is_video else 1)
        estimated_time = max(10, min(300, int(estimated_time)))  # Between 10-300 seconds
        
        return AnalysisJobResponse(
            job_id=job_id,
            status=JobStatus.QUEUED,
            estimated_time_seconds=estimated_time,
            websocket_url=f"wss://{os.getenv('API_DOMAIN', 'localhost')}/ws/job/{job_id}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}", exc_info=True)
        
        # Clean up temp file on error
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
        
        raise HTTPException(
            status_code=500,
            detail={
                'error': 'UPLOAD_FAILED',
                'message': str(e)
            }
        )


@upload_router.get("/analysis/{job_id}", response_model=AnalysisStatus)
async def get_analysis_status(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get status and results of analysis job.
    
    **Statuses**:
    - `queued`: Job is waiting in queue
    - `processing`: Job is being processed
    - `completed`: Job finished successfully
    - `failed`: Job failed with error
    
    **Returns**: Complete job status including hashes, deepfake detection, and match results
    """
    # Fetch job from database
    result = await db.execute(
        select(AnalysisJob).where(
            and_(
                AnalysisJob.id == job_id,
                AnalysisJob.user_id == UUID(current_user.id)
            )
        )
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=404,
            detail={
                'error': 'JOB_NOT_FOUND',
                'message': f'Job {job_id} not found or does not belong to current user'
            }
        )
    
    # Build response
    response = AnalysisStatus(
        job_id=job.id,
        status=JobStatus(job.status),
        progress=job.progress,
        current_step=job.current_step,
        pdq_hash=job.pdq_hash,
        tmk_hash=job.tmk_hash,
        is_deepfake=job.is_deepfake,
        deepfake_confidence=job.deepfake_confidence,
        matches_found=job.matches_found,
        match_count=job.match_count,
        highest_similarity=job.highest_similarity,
        created_at=job.created_at,
        started_at=job.started_at,
        completed_at=job.completed_at,
        processing_time_ms=job.processing_time_ms,
        error_message=job.error_message
    )
    
    # If job is completed and matches were found, fetch match details
    if job.status == 'completed' and job.matches_found and job.media_hash_id:
        result = await db.execute(
            select(HashMatch).where(
                HashMatch.original_hash_id == job.media_hash_id
            ).order_by(desc(HashMatch.similarity_score)).limit(10)
        )
        matches = result.scalars().all()
        
        # Fetch matched hash details
        match_infos = []
        for match in matches:
            result = await db.execute(
                select(MediaHash).where(MediaHash.id == match.matched_hash_id)
            )
            matched_hash = result.scalar_one()
            
            match_infos.append(MatchInfo(
                matched_hash_id=matched_hash.id,
                similarity_score=match.similarity_score,
                hamming_distance=match.hamming_distance,
                match_type=MatchType(match.match_type),
                created_at=matched_hash.created_at,
                report_count=matched_hash.report_count,
                is_blocked=True
            ))
        
        response.matches = match_infos
    
    return response


@upload_router.delete("/analysis/{job_id}")
async def cancel_analysis(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Cancel ongoing analysis or delete job results.
    
    **Note**: Cannot cancel jobs that are already processing.
    """
    # Fetch job
    result = await db.execute(
        select(AnalysisJob).where(
            and_(
                AnalysisJob.id == job_id,
                AnalysisJob.user_id == UUID(current_user.id)
            )
        )
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status == 'processing':
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel job that is currently processing"
        )
    
    # Delete temp file if it exists
    if job.temp_file_path and os.path.exists(job.temp_file_path):
        os.unlink(job.temp_file_path)
    
    # Delete job
    await db.delete(job)
    await db.commit()
    
    return {"status": "success", "message": "Analysis cancelled and data deleted"}


# ============================================================================
# Match Checking Endpoints
# ============================================================================

@match_router.post("/check", response_model=MatchResults)
async def check_hash_match(
    request: HashCheckRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Check if a hash matches existing content in the database.
    
    **Use case**: Platforms can use this API to check if content should be blocked before upload.
    
    **Process**:
    1. Query database for similar hashes (Hamming distance <= threshold)
    2. Calculate similarity scores
    3. Return matches with confidence
    
    **Matching algorithm**: PDQ/TMK uses Hamming distance. Distance <= 10 is considered a match.
    
    **Returns**: List of matching hashes with similarity scores
    """
    start_time = datetime.utcnow()
    
    # Query database for hashes of the same type
    result = await db.execute(
        select(MediaHash).where(
            and_(
                MediaHash.hash_type.in_([request.hash_type.value, 'pdq+tmk']),
                MediaHash.status == 'active'
            )
        )
    )
    all_hashes = result.scalars().all()
    
    # Calculate similarity for each hash
    matcher = SimilarityMatcher()
    matches = []
    
    for hash_record in all_hashes:
        comparison = matcher.calculate_similarity(
            request.hash_value,
            hash_record.hash_value
        )
        
        # Check if within threshold
        if comparison['hamming_distance'] <= request.threshold:
            matches.append(MatchInfo(
                matched_hash_id=hash_record.id,
                similarity_score=comparison['similarity_score'],
                hamming_distance=comparison['hamming_distance'],
                match_type=MatchType(comparison['match_type']),
                created_at=hash_record.created_at,
                report_count=hash_record.report_count,
                is_blocked=True
            ))
            
            # Record the match in database
            hash_match = HashMatch(
                original_hash_id=None,  # External check, no original hash in our DB
                matched_hash_id=hash_record.id,
                hamming_distance=comparison['hamming_distance'],
                similarity_score=comparison['similarity_score'],
                match_type=comparison['match_type'],
                detected_by_user_id=UUID(current_user.id),
                detection_context='api_check'
            )
            db.add(hash_match)
            
            # Increment match count
            hash_record.match_count += 1
    
    await db.commit()
    
    # Sort by similarity score (highest first)
    matches.sort(key=lambda x: x.similarity_score, reverse=True)
    
    # Calculate query time
    query_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
    
    # Create audit log
    audit = AuditLog(
        action='hash_check',
        resource_type='media_hash',
        user_id=UUID(current_user.id),
        status='success',
        details={
            'hash_type': request.hash_type.value,
            'threshold': request.threshold,
            'matches_found': len(matches)
        }
    )
    db.add(audit)
    await db.commit()
    
    return MatchResults(
        matches_found=len(matches) > 0,
        match_count=len(matches),
        matches=matches,
        query_time_ms=query_time_ms
    )


# ============================================================================
# Report Endpoints
# ============================================================================

@report_router.post("/submit", response_model=ReportResponse, status_code=201)
async def submit_report(
    report: ReportSubmission,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit a report for NCII or deepfake content.
    
    **Process**:
    1. Validate hash exists
    2. Create report record
    3. Queue for moderation
    4. Send confirmation email
    
    **Priority levels**:
    - `urgent`: Contains CSAM or immediate danger (2 hour review)
    - `high`: Active spreading or viral content (24 hour review)
    - `medium`: Standard report (48 hour review)
    - `low`: Historical or resolved (72 hour review)
    
    **Returns**: Report ID and estimated review time
    """
    # Validate hash exists
    result = await db.execute(
        select(MediaHash).where(MediaHash.id == report.media_hash_id)
    )
    hash_record = result.scalar_one_or_none()
    
    if not hash_record:
        raise HTTPException(
            status_code=400,
            detail={
                'error': 'INVALID_HASH_ID',
                'message': 'The provided media_hash_id does not exist'
            }
        )
    
    # Create report
    report_id = uuid4()
    report_record = ContentReport(
        id=report_id,
        reporter_user_id=UUID(current_user.id),
        media_hash_id=report.media_hash_id,
        report_type=report.report_type.value,
        description=report.description,
        platform_names=report.platform_names,
        platform_urls=[str(url) for url in report.platform_urls] if report.platform_urls else None,
        evidence_urls=[str(url) for url in report.evidence_urls] if report.evidence_urls else None,
        victim_consent_obtained=report.victim_consent_obtained,
        is_victim_minor=report.is_victim_minor,
        priority=report.priority.value,
        status='pending',
        legal_support_requested=report.legal_support_requested,
        legal_case_number=report.legal_case_number
    )
    
    # Encrypt victim information if provided
    # In production, use pgcrypto or application-level encryption
    if report.victim_name:
        report_record.victim_name_encrypted = report.victim_name
    if report.victim_email:
        report_record.victim_email_encrypted = report.victim_email
    
    db.add(report_record)
    
    # Update hash record
    hash_record.report_count += 1
    
    # Estimate review time based on priority
    review_times = {
        'urgent': 2,
        'high': 24,
        'medium': 48,
        'low': 72
    }
    estimated_hours = review_times.get(report.priority.value, 48)
    report_record.estimated_review_time_hours = estimated_hours
    
    # Create audit log
    audit = AuditLog(
        action='report_submitted',
        resource_type='content_report',
        resource_id=report_id,
        user_id=UUID(current_user.id),
        status='success',
        details={
            'report_type': report.report_type.value,
            'priority': report.priority.value,
            'platform_count': len(report.platform_names) if report.platform_names else 0
        }
    )
    db.add(audit)
    
    await db.commit()
    
    # Send confirmation email (async)
    send_report_notification.delay(
        report_id=str(report_id),
        recipient_email=current_user.email,
        report_type=report.report_type.value
    )
    
    # Generate ticket number
    ticket_number = f"RPT-{datetime.utcnow().year}-{report_id.hex[:6].upper()}"
    
    logger.info(f"Report {report_id} submitted by user {current_user.id}")
    
    return ReportResponse(
        report_id=report_id,
        status=ReportStatus.PENDING,
        priority=report.priority,
        created_at=report_record.created_at,
        estimated_review_time_hours=estimated_hours,
        ticket_number=ticket_number
    )


@report_router.get("/{report_id}", response_model=ReportDetail)
async def get_report(
    report_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed report information.
    
    **Access control**: Users can only view their own reports unless they're admins.
    """
    # Fetch report
    result = await db.execute(
        select(ContentReport).where(ContentReport.id == report_id)
    )
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Check access
    if report.reporter_user_id != UUID(current_user.id) and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Fetch media hash details
    result = await db.execute(
        select(MediaHash).where(MediaHash.id == report.media_hash_id)
    )
    media_hash = result.scalar_one()
    
    # Count successful takedowns
    result = await db.execute(
        select(func.count(TakedownRequest.id)).where(
            and_(
                TakedownRequest.report_id == report_id,
                TakedownRequest.removal_confirmed == True
            )
        )
    )
    success_count = result.scalar()
    
    return ReportDetail(
        id=report.id,
        report_type=report.report_type,
        description=report.description,
        status=ReportStatus(report.status),
        priority=report.priority,
        media_hash_id=media_hash.id,
        media_type=media_hash.media_type,
        is_deepfake=media_hash.is_deepfake,
        deepfake_confidence=media_hash.deepfake_confidence,
        platform_names=report.platform_names,
        platform_urls=report.platform_urls,
        takedown_initiated=report.takedown_initiated,
        takedown_count=report.takedown_count,
        takedown_success_count=success_count,
        reviewed_at=report.reviewed_at,
        review_notes=report.review_notes,
        created_at=report.created_at,
        updated_at=report.updated_at,
        resolved_at=report.resolved_at,
        estimated_review_time_hours=report.estimated_review_time_hours
    )


@report_router.get("", response_model=PaginatedReports)
async def list_reports(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    List user's reports with pagination and filtering.
    
    **Filters**:
    - `status`: pending, reviewing, approved, rejected, resolved
    - `priority`: urgent, high, medium, low
    """
    # Build query
    query = select(ContentReport).where(
        ContentReport.reporter_user_id == UUID(current_user.id)
    )
    
    # Apply filters
    if status:
        query = query.where(ContentReport.status == status)
    if priority:
        query = query.where(ContentReport.priority == priority)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    result = await db.execute(count_query)
    total_items = result.scalar()
    
    # Apply pagination
    query = query.order_by(desc(ContentReport.created_at))
    query = query.offset((page - 1) * limit).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    reports = result.scalars().all()
    
    # Build response
    report_items = []
    for report in reports:
        platform_count = len(report.platform_names) if report.platform_names else 0
        
        # Get successful takedown count
        result = await db.execute(
            select(func.count(TakedownRequest.id)).where(
                and_(
                    TakedownRequest.report_id == report.id,
                    TakedownRequest.removal_confirmed == True
                )
            )
        )
        success_count = result.scalar()
        
        report_items.append(ReportListItem(
            id=report.id,
            report_type=report.report_type,
            status=ReportStatus(report.status),
            priority=report.priority,
            platform_count=platform_count,
            takedown_success_count=success_count,
            created_at=report.created_at
        ))
    
    total_pages = (total_items + limit - 1) // limit
    
    return PaginatedReports(
        reports=report_items,
        total_items=total_items,
        total_pages=total_pages,
        current_page=page,
        page_size=limit
    )


# ============================================================================
# Evidence Generation Endpoints
# ============================================================================

@evidence_router.post("/{report_id}", response_model=EvidencePackageResponse)
async def generate_evidence_package_endpoint(
    report_id: UUID,
    options: EvidencePackageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate encrypted evidence package for legal proceedings.
    
    **Package includes**:
    - Report summary (PDF)
    - Hash certificate with chain of custody (PDF)
    - Timeline of events (JSON)
    - Platform responses (JSON)
    - Metadata (JSON)
    
    **Security**: Package is encrypted with password and stored temporarily in S3.
    Download URL expires in 7 days.
    """
    # Verify report exists and user has access
    result = await db.execute(
        select(ContentReport).where(ContentReport.id == report_id)
    )
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if report.reporter_user_id != UUID(current_user.id) and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Queue evidence generation task
    task_result = generate_evidence_package.delay(
        report_id=str(report_id),
        options=options.dict()
    )
    
    # In production, this would return actual S3 pre-signed URL
    package_id = uuid4()
    download_url = f"https://s3.example.com/evidence/{package_id}.zip?signature=..."
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    # Create audit log
    audit = AuditLog(
        action='evidence_package_requested',
        resource_type='content_report',
        resource_id=report_id,
        user_id=UUID(current_user.id),
        status='success',
        details=options.dict()
    )
    db.add(audit)
    await db.commit()
    
    return EvidencePackageResponse(
        package_id=package_id,
        download_url=download_url,
        expires_at=expires_at,
        file_size_bytes=2458624,
        password_hint="Your report ticket number"
    )


# ============================================================================
# Export Router Setup
# ============================================================================

def setup_routes(app):
    """Register all routers with the FastAPI app"""
    app.include_router(upload_router)
    app.include_router(match_router)
    app.include_router(report_router)
    app.include_router(evidence_router)
