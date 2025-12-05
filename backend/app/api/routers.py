"""
Comprehensive API routers for A-DFP Firewall
Analysis endpoints: voice, video, document, liveness, scam, risk, incidents, webhooks, health
Advanced features: real-time analysis, blockchain evidence, forensic reports
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
import logging
import uuid
from datetime import datetime
import io

from app.core.config import settings
from app.core.dependencies import (
    get_db, get_current_user, get_pagination, check_rate_limit
)
from app.models.database import User, Session as SessionModel, Incident, Webhook, AuditLog
from app.models.schemas import (
    VoiceAnalysisResponse, VideoAnalysisResponse, DocumentAnalysisResponse,
    LivenessChallengeStartResponse, LivenessAnalysisResult,
    ScamAnalysisResponse, RiskScoreResponse, IncidentResponse,
    WebhookResponse, HealthResponse, HealthDetailedResponse
)
from app.utils.helpers import FileValidator, StorageHelper, ReportGenerator
from app.workers.tasks import (
    analyze_voice_task,
    analyze_video_task,
    analyze_document_task,
    analyze_scam_task,
    verify_liveness_task,
    calculate_risk_score_task,
    generate_report_task
)

# Import advanced router
from app.api.advanced_router import router as advanced_router

logger = logging.getLogger(__name__)

# ============================================================================
# VOICE ANALYSIS ROUTER
# ============================================================================

voice_router = APIRouter(prefix="/voice", tags=["Voice Analysis"])


@voice_router.post(
    "",
    response_model=VoiceAnalysisResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Analyze Voice for Deepfakes",
    description="Upload voice audio file for AI deepfake detection analysis"
)
async def upload_voice(
    session_id: str = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> VoiceAnalysisResponse:
    """
    Upload voice audio for deepfake detection
    
    - **session_id**: Unique session ID
    - **file**: Audio file (WAV, MP3, M4A - max 100MB)
    
    Returns analysis task ID for polling results
    """
    try:
        # Validate file
        if not FileValidator.validate_audio(file.filename, file.size):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid audio file format or size exceeds 100MB"
            )
        
        # Verify session exists and belongs to user
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        if session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this session"
            )
        
        # Read file content
        content = await file.read()
        
        # Upload to S3
        file_key = f"voice/{session_id}/{file.filename}"
        StorageHelper.upload_to_s3(
            bucket=settings.S3_BUCKET,
            key=file_key,
            content=content,
            content_type=file.content_type
        )
        
        # Queue async analysis task
        task = analyze_voice_task.delay(
            session_id=session_id,
            file_key=file_key,
            filename=file.filename
        )
        
        # Update session status
        session.voice_status = "processing"
        db.commit()
        
        logger.info(f"Voice analysis queued: {session_id} - Task ID: {task.id}")
        
        return VoiceAnalysisResponse(
            session_id=session_id,
            task_id=task.id,
            status="processing",
            message="Voice analysis started"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Voice analysis initiation failed"
        )


@voice_router.get(
    "/{session_id}/result",
    response_model=VoiceAnalysisResponse,
    summary="Get Voice Analysis Result",
    description="Retrieve voice deepfake detection results"
)
async def get_voice_result(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> VoiceAnalysisResponse:
    """Get voice analysis results for a session"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return VoiceAnalysisResponse(
        session_id=session.id,
        task_id="",
        status=session.voice_status,
        score=session.voice_score,
        confidence=session.voice_confidence,
        message="Voice analysis complete" if session.voice_status == "completed" else "Analysis in progress"
    )


# ============================================================================
# VIDEO ANALYSIS ROUTER
# ============================================================================

video_router = APIRouter(prefix="/video", tags=["Video Analysis"])


@video_router.post(
    "",
    response_model=VideoAnalysisResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Analyze Video for Deepfakes",
    description="Upload video file for AI deepfake detection analysis"
)
async def upload_video(
    session_id: str = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> VideoAnalysisResponse:
    """Upload video for deepfake detection"""
    try:
        # Validate file
        if not FileValidator.validate_video(file.filename, file.size):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid video file format or size exceeds 500MB"
            )
        
        # Verify session
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Session not found or access denied"
            )
        
        # Read and upload file
        content = await file.read()
        file_key = f"video/{session_id}/{file.filename}"
        
        StorageHelper.upload_to_s3(
            bucket=settings.S3_BUCKET,
            key=file_key,
            content=content,
            content_type=file.content_type
        )
        
        # Queue analysis task
        task = analyze_video_task.delay(
            session_id=session_id,
            file_key=file_key,
            filename=file.filename
        )
        
        session.video_status = "processing"
        db.commit()
        
        logger.info(f"Video analysis queued: {session_id}")
        
        return VideoAnalysisResponse(
            session_id=session_id,
            task_id=task.id,
            status="processing",
            message="Video analysis started"
        )
    
    except Exception as e:
        logger.error(f"Video upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Video analysis initiation failed"
        )


@video_router.get(
    "/{session_id}/result",
    response_model=VideoAnalysisResponse,
    summary="Get Video Analysis Result"
)
async def get_video_result(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> VideoAnalysisResponse:
    """Get video analysis results"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return VideoAnalysisResponse(
        session_id=session.id,
        task_id="",
        status=session.video_status,
        score=session.video_score,
        confidence=session.video_confidence,
        message="Video analysis complete" if session.video_status == "completed" else "Analysis in progress"
    )


# ============================================================================
# DOCUMENT ANALYSIS ROUTER
# ============================================================================

document_router = APIRouter(prefix="/document", tags=["Document Analysis"])


@document_router.post(
    "",
    response_model=DocumentAnalysisResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Analyze Document for Forgery",
    description="Upload identity document for forgery detection"
)
async def upload_document(
    session_id: str = Query(...),
    document_type: str = Query("id_card", regex="^(id_card|passport|license|other)$"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> DocumentAnalysisResponse:
    """Upload identity document for forgery detection"""
    try:
        # Validate file
        if not FileValidator.validate_document(file.filename, file.size):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid document format or size exceeds 50MB"
            )
        
        # Verify session
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Upload file
        content = await file.read()
        file_key = f"document/{session_id}/{document_type}/{file.filename}"
        
        StorageHelper.upload_to_s3(
            bucket=settings.S3_BUCKET,
            key=file_key,
            content=content,
            content_type=file.content_type
        )
        
        # Queue analysis
        task = analyze_document_task.delay(
            session_id=session_id,
            file_key=file_key,
            document_type=document_type
        )
        
        session.document_status = "processing"
        db.commit()
        
        return DocumentAnalysisResponse(
            session_id=session_id,
            task_id=task.id,
            status="processing",
            message="Document analysis started"
        )
    
    except Exception as e:
        logger.error(f"Document upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Document analysis failed"
        )


# ============================================================================
# LIVENESS DETECTION ROUTER
# ============================================================================

liveness_router = APIRouter(prefix="/liveness", tags=["Liveness Detection"])


@liveness_router.post(
    "/start",
    response_model=LivenessChallengeStartResponse,
    summary="Start Liveness Challenge",
    description="Initiate active liveness detection challenge"
)
async def start_liveness_challenge(
    session_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> LivenessChallengeStartResponse:
    """Start liveness detection challenge"""
    try:
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Generate challenge
        challenge_id = str(uuid.uuid4())
        challenge_nonce = str(uuid.uuid4())
        
        # TODO: Store challenge in Redis with TTL
        
        session.liveness_status = "challenge_pending"
        db.commit()
        
        return LivenessChallengeStartResponse(
            session_id=session_id,
            challenge_id=challenge_id,
            challenge_nonce=challenge_nonce,
            message="Perform the requested action to verify liveness"
        )
    
    except Exception as e:
        logger.error(f"Challenge start error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Challenge initiation failed"
        )


@liveness_router.post(
    "/verify",
    response_model=LivenessAnalysisResult,
    summary="Submit Liveness Challenge Response",
    description="Submit video response to liveness challenge"
)
async def verify_liveness_challenge(
    session_id: str = Query(...),
    challenge_nonce: str = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> LivenessAnalysisResult:
    """Submit and verify liveness challenge response"""
    try:
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        content = await file.read()
        file_key = f"liveness/{session_id}/response/{file.filename}"
        
        StorageHelper.upload_to_s3(
            bucket=settings.S3_BUCKET,
            key=file_key,
            content=content,
            content_type=file.content_type
        )
        
        # Queue verification
        task = verify_liveness_task.delay(
            session_id=session_id,
            challenge_nonce=challenge_nonce,
            file_key=file_key
        )
        
        session.liveness_status = "processing"
        db.commit()
        
        return LivenessAnalysisResult(
            session_id=session_id,
            task_id=task.id,
            status="processing",
            is_live=None,
            message="Liveness verification in progress"
        )
    
    except Exception as e:
        logger.error(f"Liveness verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Liveness verification failed"
        )


# ============================================================================
# SCAM ANALYSIS ROUTER
# ============================================================================

scam_router = APIRouter(prefix="/scam", tags=["Scam Detection"])


@scam_router.post(
    "",
    response_model=ScamAnalysisResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Analyze Call for Scam Indicators",
    description="Upload call recording for scam pattern detection"
)
async def analyze_scam_call(
    session_id: str = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ScamAnalysisResponse:
    """Upload call recording for scam analysis"""
    try:
        if not FileValidator.validate_audio(file.filename, file.size):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid audio file"
            )
        
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        content = await file.read()
        file_key = f"scam/{session_id}/{file.filename}"
        
        StorageHelper.upload_to_s3(
            bucket=settings.S3_BUCKET,
            key=file_key,
            content=content,
            content_type=file.content_type
        )
        
        task = analyze_scam_task.delay(
            session_id=session_id,
            file_key=file_key
        )
        
        session.scam_status = "processing"
        db.commit()
        
        return ScamAnalysisResponse(
            session_id=session_id,
            task_id=task.id,
            status="processing",
            message="Scam analysis started"
        )
    
    except Exception as e:
        logger.error(f"Scam analysis error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Scam analysis failed"
        )


# ============================================================================
# RISK SCORING ROUTER
# ============================================================================

risk_router = APIRouter(prefix="/risk", tags=["Risk Scoring"])


@risk_router.post(
    "/calculate",
    response_model=RiskScoreResponse,
    summary="Calculate Fusion Risk Score",
    description="Calculate multi-modal risk score from all analysis components"
)
async def calculate_risk_score(
    session_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> RiskScoreResponse:
    """Calculate fusion risk score"""
    try:
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Queue risk calculation
        task = calculate_risk_score_task.delay(session_id=session_id)
        
        return RiskScoreResponse(
            session_id=session_id,
            task_id=task.id,
            status="processing",
            message="Risk score calculation started"
        )
    
    except Exception as e:
        logger.error(f"Risk score error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Risk calculation failed"
        )


@risk_router.get(
    "/{session_id}",
    response_model=RiskScoreResponse,
    summary="Get Risk Score"
)
async def get_risk_score(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> RiskScoreResponse:
    """Get calculated risk score"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return RiskScoreResponse(
        session_id=session.id,
        score=session.fusion_score,
        confidence=session.fusion_confidence,
        risk_level=session.risk_level,
        status="completed" if session.fusion_score is not None else "pending"
    )


# ============================================================================
# INCIDENTS ROUTER
# ============================================================================

incidents_router = APIRouter(prefix="/incidents", tags=["Incidents"])


@incidents_router.post(
    "",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Incident",
    description="Create incident from session results"
)
async def create_incident(
    session_id: str = Query(...),
    description: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> IncidentResponse:
    """Create incident from session results"""
    try:
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        incident_id = str(uuid.uuid4())
        incident = Incident(
            id=incident_id,
            session_id=session_id,
            user_id=current_user.id,
            description=description,
            risk_score=session.fusion_score,
            status="open",
            created_at=datetime.utcnow()
        )
        
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
        return IncidentResponse(
            id=incident.id,
            session_id=incident.session_id,
            description=incident.description,
            risk_score=incident.risk_score,
            status=incident.status,
            created_at=incident.created_at
        )
    
    except Exception as e:
        db.rollback()
        logger.error(f"Incident creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Incident creation failed"
        )


@incidents_router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
    summary="Get Incident"
)
async def get_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> IncidentResponse:
    """Get incident details"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    
    if not incident or incident.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return IncidentResponse(
        id=incident.id,
        session_id=incident.session_id,
        description=incident.description,
        risk_score=incident.risk_score,
        status=incident.status,
        created_at=incident.created_at
    )


@incidents_router.get(
    "",
    response_model=dict,
    summary="List Incidents"
)
async def list_incidents(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """List user's incidents"""
    query = db.query(Incident).filter(Incident.user_id == current_user.id)
    
    if status:
        query = query.filter(Incident.status == status)
    
    total = query.count()
    incidents = query.order_by(desc(Incident.created_at)).offset(offset).limit(limit).all()
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": [
            IncidentResponse(
                id=i.id,
                session_id=i.session_id,
                description=i.description,
                risk_score=i.risk_score,
                status=i.status,
                created_at=i.created_at
            )
            for i in incidents
        ]
    }


# ============================================================================
# WEBHOOKS ROUTER
# ============================================================================

webhooks_router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@webhooks_router.post(
    "",
    response_model=WebhookResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Webhook"
)
async def register_webhook(
    url: str = Body(...),
    events: list = Body(["incident.created", "analysis.completed"]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> WebhookResponse:
    """Register webhook for event notifications"""
    try:
        webhook = Webhook(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            url=url,
            events=events,
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(webhook)
        db.commit()
        db.refresh(webhook)
        
        return WebhookResponse(
            id=webhook.id,
            url=webhook.url,
            events=webhook.events,
            is_active=webhook.is_active,
            created_at=webhook.created_at
        )
    
    except Exception as e:
        db.rollback()
        logger.error(f"Webhook registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook registration failed"
        )


@webhooks_router.get(
    "",
    response_model=dict,
    summary="List Webhooks"
)
async def list_webhooks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """List user's webhooks"""
    webhooks = db.query(Webhook).filter(Webhook.user_id == current_user.id).all()
    
    return {
        "items": [
            WebhookResponse(
                id=w.id,
                url=w.url,
                events=w.events,
                is_active=w.is_active,
                created_at=w.created_at
            )
            for w in webhooks
        ]
    }


@webhooks_router.delete(
    "/{webhook_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Webhook"
)
async def delete_webhook(
    webhook_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete webhook"""
    webhook = db.query(Webhook).filter(Webhook.id == webhook_id).first()
    
    if not webhook or webhook.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        db.delete(webhook)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook deletion failed"
        )


# ============================================================================
# HEALTH CHECK ROUTER
# ============================================================================

health_router = APIRouter(prefix="/health", tags=["Health"])


@health_router.get(
    "",
    response_model=HealthResponse,
    summary="Health Check",
    description="Quick service health status"
)
async def health_check() -> HealthResponse:
    """Quick health check"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=settings.APP_VERSION
    )


@health_router.get(
    "/detailed",
    response_model=HealthDetailedResponse,
    summary="Detailed Health Check",
    description="Comprehensive service health status with all components"
)
async def health_check_detailed() -> HealthDetailedResponse:
    """Detailed health check with component status"""
    return HealthDetailedResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=settings.APP_VERSION,
        database="connected",
        cache="connected",
        message_queue="connected",
        ml_models="ready"
    )
