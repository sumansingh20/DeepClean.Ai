"""
Authentication router for A-DFP Firewall
User registration, login, token refresh, password reset
"""

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

from app.core.security import JWTManager, PasswordManager
from app.core.config import settings
from app.core.dependencies import get_db, get_current_user, jwt_manager
from app.models.database import User
from app.models.schemas import (
    UserCreate, LoginRequest, TokenResponse, RefreshTokenRequest, UserResponse
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="User Registration",
    description="Register a new user account with email and password"
)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
) -> UserResponse:
    """
    Register new user account
    
    - **email**: Email address (must be unique)
    - **username**: Username (3-100 chars, must be unique)
    - **password**: Password (min 8 chars)
    - **organization**: Optional organization name
    
    Returns:
        User object with created account details
    
    Raises:
        400: Email or username already exists
    """
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        logger.warning(f"Registration attempt with existing email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        logger.warning(f"Registration attempt with existing username: {user_data.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Hash password
    hashed_password = PasswordManager.hash_password(user_data.password)
    
    # Create new user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        organization=user_data.organization
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"User registered: {new_user.email}")
        
        return UserResponse(
            id=new_user.id,
            email=new_user.email,
            username=new_user.username,
            role=new_user.role.value,
            organization=new_user.organization,
            is_active=new_user.is_active,
            is_verified=new_user.is_verified,
            created_at=new_user.created_at,
            last_login=new_user.last_login
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User Login",
    description="Login with email and password to get JWT tokens"
)
async def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    User login with email and password
    
    Returns:
    - access_token: JWT token for API requests (24 hours)
    - refresh_token: Token to get new access token (30 days)
    - token_type: Always "bearer"
    - expires_in: Seconds until access token expires
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        logger.warning(f"Login attempt with non-existent email: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not PasswordManager.verify_password(credentials.password, user.hashed_password):
        logger.warning(f"Failed login attempt for: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Generate tokens
    access_token = jwt_manager.create_access_token(
        user_id=user.id,
        role=user.role.value,
        expires_delta=timedelta(hours=24)
    )
    
    refresh_token = jwt_manager.create_refresh_token(
        user_id=user.id,
        expires_delta=timedelta(days=30)
    )
    
    # Update last_login
    user.last_login = user.created_at.__class__.utcnow() if hasattr(user.created_at.__class__, 'utcnow') else None
    db.commit()
    
    logger.info(f"User logged in: {user.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=86400  # 24 hours in seconds
    )




@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh Access Token",
    description="Get a new access token using a refresh token"
)
async def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Get new access token using refresh token
    
    - **refresh_token**: Valid refresh token from login/previous refresh
    
    Returns new access and refresh tokens
    """
    try:
        # Verify refresh token
        payload = jwt_manager.verify_token(request.refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Generate new tokens
        access_token = jwt_manager.create_access_token(
            user_id=user.id,
            role=user.role.value,
            expires_delta=timedelta(hours=24)
        )
        
        refresh_token_new = jwt_manager.create_refresh_token(
            user_id=user.id,
            expires_delta=timedelta(days=30)
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_new,
            token_type="bearer",
            expires_in=86400
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="User Logout",
    description="Logout the current user (sign out)"
)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout user (invalidate tokens on client side)
    
    Note: JWTs are stateless, so token blacklisting can be added via Redis
    Client should discard access_token and refresh_token
    """
    logger.info(f"User logged out: {current_user.email}")
    # In production, add token to Redis blacklist
    return None


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User",
    description="Get the current authenticated user's profile"
)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Get current user profile"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        role=current_user.role.value,
        organization=current_user.organization,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        last_login=current_user.last_login
    )


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update User Profile",
    description="Update the current user's profile information"
)
async def update_me(
    update_data,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """Update current user profile"""
    try:
        # Update allowed fields
        if hasattr(update_data, 'username') and update_data.username:
            # Check if new username is unique
            existing = db.query(User).filter(
                User.username == update_data.username,
                User.id != current_user.id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
            current_user.username = update_data.username
        
        if hasattr(update_data, 'organization') and update_data.organization:
            current_user.organization = update_data.organization
        
        db.commit()
        db.refresh(current_user)
        logger.info(f"User profile updated: {current_user.email}")
        
        return UserResponse(
            id=current_user.id,
            email=current_user.email,
            username=current_user.username,
            role=current_user.role.value,
            organization=current_user.organization,
            is_active=current_user.is_active,
            is_verified=current_user.is_verified,
            created_at=current_user.created_at,
            last_login=current_user.last_login
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Profile update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed"
        )


@router.post(
    "/password-reset-request",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Request Password Reset",
    description="Request a password reset email"
)
async def request_password_reset(
    email: str = Body(...),
    db: Session = Depends(get_db)
):
    """
    Request password reset - sends email with reset link
    
    - **email**: User email address
    """
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Don't reveal if email exists (security best practice)
        logger.warning(f"Password reset requested for non-existent email: {email}")
        return {"message": "If email exists, reset link has been sent"}
    
    # TODO: Generate reset token and send email
    # For now, just acknowledge the request
    logger.info(f"Password reset requested for: {email}")
    return {"message": "If email exists, reset link has been sent"}


@router.post(
    "/password-reset",
    summary="Reset Password",
    description="Reset password using a reset token"
)
async def reset_password(
    token: str = Body(...),
    new_password: str = Body(..., min_length=8),
    db: Session = Depends(get_db)
):
    """
    Reset password with token from email
    
    - **token**: Reset token from email link
    - **new_password**: New password (min 8 chars)
    """
    try:
        # TODO: Verify reset token
        # For now, just accept the request
        logger.warning(f"Password reset attempted with token: {token[:20]}...")
        
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Password reset not yet implemented"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password reset error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset failed"
        )


@router.post(
    "/verify-email",
    status_code=status.HTTP_200_OK,
    summary="Verify Email",
    description="Verify email address with verification token"
)
async def verify_email(
    token: str = Body(...),
    db: Session = Depends(get_db)
):
    """Verify email with token from verification email"""
    # TODO: Implement email verification
    logger.warning(f"Email verification attempted with token: {token[:20]}...")
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Email verification not yet implemented"
    )


@router.post(
    "/resend-verification",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Resend Verification Email",
    description="Resend verification email to current user"
)
async def resend_verification_email(
    current_user: User = Depends(get_current_user)
):
    """Resend verification email to current user"""
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # TODO: Send verification email
    logger.info(f"Verification email resent to: {current_user.email}")
    return {"message": "Verification email sent"}
