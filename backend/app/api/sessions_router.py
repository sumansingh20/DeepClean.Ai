"""
Session management router for A-DFP Firewall
Create, retrieve, list, and manage fraud analysis sessions
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from sqlalchemy import desc
import uuid
import logging

from app.core.config import settings
from app.core.dependencies import get_db, get_current_user, get_session_by_id, get_pagination
from app.models.database import User, Session as SessionModel
from app.models.schemas import SessionCreate, SessionResponse
from app.core.security import PasswordManager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post(
    "",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Analysis Session",
    description="Create a new fraud analysis session"
)
async def create_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> SessionResponse:
    """
    Create new fraud analysis session
    
    Returns session with unique ID, token, and nonce for subsequent analysis requests
    """
    try:
        # Generate secure identifiers
        session_id = str(uuid.uuid4())
        session_token = str(uuid.uuid4())
        nonce = str(uuid.uuid4())
        
        # Create session
        new_session = SessionModel(
            id=session_id,
            user_id=current_user.id,
            session_token=session_token,
            nonce=nonce,
            status="pending",
            voice_score=None,
            voice_confidence=None,
            voice_status="pending",
            video_score=None,
            video_confidence=None,
            video_status="pending",
            document_score=None,
            document_confidence=None,
            document_status="pending",
            scam_score=None,
            scam_confidence=None,
            scam_status="pending",
            liveness_score=None,
            liveness_confidence=None,
            liveness_status="pending",
            fusion_score=None,
            fusion_confidence=None,
            risk_level="low",
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        logger.info(f"Session created: {session_id} for user {current_user.email}")
        
        return SessionResponse(
            id=new_session.id,
            session_token=new_session.session_token,
            status=new_session.status,
            voice_score=new_session.voice_score,
            voice_confidence=new_session.voice_confidence,
            voice_status=new_session.voice_status,
            video_score=new_session.video_score,
            video_confidence=new_session.video_confidence,
            video_status=new_session.video_status,
            document_score=new_session.document_score,
            document_confidence=new_session.document_confidence,
            document_status=new_session.document_status,
            scam_score=new_session.scam_score,
            scam_confidence=new_session.scam_confidence,
            scam_status=new_session.scam_status,
            liveness_score=new_session.liveness_score,
            liveness_confidence=new_session.liveness_confidence,
            liveness_status=new_session.liveness_status,
            fusion_score=new_session.fusion_score,
            fusion_confidence=new_session.fusion_confidence,
            risk_level=new_session.risk_level,
            created_at=new_session.created_at
        )
    
    except Exception as e:
        db.rollback()
        logger.error(f"Session creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session creation failed"
        )


@router.get(
    "/{session_id}",
    response_model=SessionResponse,
    summary="Get Session Details",
    description="Retrieve session details and current analysis status"
)
async def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> SessionResponse:
    """Get session details and current analysis status"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Verify ownership or admin access
    if session.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    return SessionResponse(
        id=session.id,
        session_token=session.session_token,
        status=session.status,
        voice_score=session.voice_score,
        voice_confidence=session.voice_confidence,
        voice_status=session.voice_status,
        video_score=session.video_score,
        video_confidence=session.video_confidence,
        video_status=session.video_status,
        document_score=session.document_score,
        document_confidence=session.document_confidence,
        document_status=session.document_status,
        scam_score=session.scam_score,
        scam_confidence=session.scam_confidence,
        scam_status=session.scam_status,
        liveness_score=session.liveness_score,
        liveness_confidence=session.liveness_confidence,
        liveness_status=session.liveness_status,
        fusion_score=session.fusion_score,
        fusion_confidence=session.fusion_confidence,
        risk_level=session.risk_level,
        created_at=session.created_at
    )


@router.get(
    "",
    response_model=dict,
    summary="List User Sessions",
    description="List user's sessions with pagination and optional filtering"
)
async def list_sessions(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """List user sessions with pagination"""
    try:
        # Build query
        query = db.query(SessionModel).filter(SessionModel.user_id == current_user.id)
        
        # Apply status filter if provided
        if status:
            query = query.filter(SessionModel.status == status)
        
        # Count total
        total = query.count()
        
        # Get paginated results, ordered by creation time descending
        sessions = query.order_by(desc(SessionModel.created_at)).offset(offset).limit(limit).all()
        
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "items": [
                SessionResponse(
                    id=s.id,
                    session_token=s.session_token,
                    status=s.status,
                    voice_score=s.voice_score,
                    voice_confidence=s.voice_confidence,
                    voice_status=s.voice_status,
                    video_score=s.video_score,
                    video_confidence=s.video_confidence,
                    video_status=s.video_status,
                    document_score=s.document_score,
                    document_confidence=s.document_confidence,
                    document_status=s.document_status,
                    scam_score=s.scam_score,
                    scam_confidence=s.scam_confidence,
                    scam_status=s.scam_status,
                    liveness_score=s.liveness_score,
                    liveness_confidence=s.liveness_confidence,
                    liveness_status=s.liveness_status,
                    fusion_score=s.fusion_score,
                    fusion_confidence=s.fusion_confidence,
                    risk_level=s.risk_level,
                    created_at=s.created_at
                )
                for s in sessions
            ]
        }
    
    except Exception as e:
        logger.error(f"List sessions error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sessions"
        )


@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Session",
    description="Delete a session and associated data"
)
async def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete session and associated data"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Verify ownership or admin access
    if session.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    try:
        db.delete(session)
        db.commit()
        logger.info(f"Session deleted: {session_id}")
        return None
    
    except Exception as e:
        db.rollback()
        logger.error(f"Session deletion error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session deletion failed"
        )


@router.post(
    "/{session_id}/cancel",
    response_model={"message": str},
    summary="Cancel Session",
    description="Cancel ongoing session analysis"
)
async def cancel_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Cancel ongoing session analysis"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Verify ownership or admin access
    if session.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    # Check if session can be cancelled
    if session.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a completed session"
        )
    
    try:
        session.status = "cancelled"
        db.commit()
        logger.info(f"Session cancelled: {session_id}")
        return {"message": "Session cancelled successfully"}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Session cancellation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session cancellation failed"
        )
