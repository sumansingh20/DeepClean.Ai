"""
Dependency injection for A-DFP Firewall API
Database sessions, authentication, rate limiting, pagination
"""

from fastapi import Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.database import SessionLocal, User
from app.core.security import JWTManager
from typing import Optional, Tuple
from datetime import datetime
import hashlib
import time


# Initialize JWT manager
jwt_manager = JWTManager(settings.SECRET_KEY, settings.ALGORITHM)


# ============================================================================
# Database Dependency
# ============================================================================

def get_db() -> Session:
    """
    Get database session
    Yields SQLAlchemy session for query execution
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================================
# Authentication Dependencies
# ============================================================================

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    
    Args:
        authorization: Bearer token from Authorization header
        db: Database session
    
    Returns:
        User object if token is valid
        
    Raises:
        HTTPException: 401 if token is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid scheme")
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Verify token and extract claims
    try:
        payload = jwt_manager.verify_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type", "access")
        
        if token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
                headers={"WWW-Authenticate": "Bearer"}
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token validation failed",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    return user


def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if token is provided, otherwise return None
    Useful for endpoints that work with or without authentication
    """
    if not authorization:
        return None
    
    try:
        return get_current_user(authorization, db)
    except HTTPException:
        return None


def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Verify current user is admin
    Raises 403 if user is not admin
    """
    if current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def get_analyst_or_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Verify current user is analyst or admin
    """
    allowed_roles = ["admin", "analyst"]
    if current_user.role.value not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Analyst or admin access required"
        )
    return current_user


# ============================================================================
# API Key Authentication
# ============================================================================

def verify_api_key(
    x_api_key: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Verify API key and return associated user
    
    Args:
        x_api_key: API key from X-API-Key header
        db: Database session
    
    Returns:
        User object associated with API key
        
    Raises:
        HTTPException: 401 if API key is invalid or missing
    """
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key"
        )
    
    # Hash the provided key
    api_key_hash = hashlib.sha256(x_api_key.encode()).hexdigest()
    
    # Find user with matching API key hash
    user = db.query(User).filter(User.api_key_hash == api_key_hash).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    return user


def get_user_with_auth(
    authorization: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get user using either JWT token or API key
    At least one must be provided
    """
    if authorization:
        return get_current_user(authorization, db)
    elif x_api_key:
        return verify_api_key(x_api_key, db)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication (token or API key)"
        )


# ============================================================================
# Pagination
# ============================================================================

class PaginationParams:
    """Pagination parameters"""
    def __init__(
        self,
        limit: int = Query(20, ge=1, le=100),
        offset: int = Query(0, ge=0)
    ):
        self.limit = limit
        self.offset = offset


def get_pagination(params: PaginationParams = Depends()) -> Tuple[int, int]:
    """
    Get pagination limit and offset from query parameters
    
    Args:
        limit: Number of items to return (default 20, max 100)
        offset: Number of items to skip (default 0)
    
    Returns:
        Tuple of (limit, offset)
    """
    return params.limit, params.offset


# ============================================================================
# Rate Limiting
# ============================================================================

class RateLimitStore:
    """Simple in-memory rate limit store"""
    def __init__(self):
        self.requests = {}  # {key: [(timestamp, count)]}
    
    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> bool:
        """
        Check if request is allowed within rate limit
        
        Args:
            key: Identifier (user_id, IP, etc.)
            max_requests: Max requests allowed
            window_seconds: Time window in seconds
        
        Returns:
            True if request is allowed, False if rate limited
        """
        now = time.time()
        
        if key not in self.requests:
            self.requests[key] = []
        
        # Remove old requests outside the window
        self.requests[key] = [
            (ts, cnt) for ts, cnt in self.requests[key]
            if now - ts < window_seconds
        ]
        
        # Count total requests in window
        total_requests = sum(cnt for ts, cnt in self.requests[key])
        
        if total_requests >= max_requests:
            return False
        
        # Add current request
        if self.requests[key]:
            self.requests[key][-1] = (self.requests[key][-1][0], self.requests[key][-1][1] + 1)
        else:
            self.requests[key].append((now, 1))
        
        return True


# Global rate limit store
rate_limit_store = RateLimitStore()


def check_rate_limit(
    current_user: User = Depends(get_current_user),
    max_requests: int = 100,
    window_seconds: int = 60
) -> User:
    """
    Check if user is within rate limits
    
    Args:
        current_user: Authenticated user
        max_requests: Max requests allowed (default 100)
        window_seconds: Time window in seconds (default 60)
    
    Returns:
        User if within limits
        
    Raises:
        HTTPException: 429 if rate limit exceeded
    """
    if not rate_limit_store.is_allowed(current_user.id, max_requests, window_seconds):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
    
    return current_user


# ============================================================================
# Query Helpers
# ============================================================================

def get_session_by_id(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get session by ID and verify user owns it
    """
    from app.models.database import Session
    
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    return session


def get_incident_by_id(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get incident by ID and verify user has access
    """
    from app.models.database import Incident
    
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
    
    # Check access: own incident or analyst/admin
    is_owner = incident.user_id == current_user.id
    is_privileged = current_user.role.value in ["admin", "analyst"]
    
    if not (is_owner or is_privileged):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this incident"
        )
    
    return incident
