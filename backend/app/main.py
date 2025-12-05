"""
A-DFP Firewall Main FastAPI Application
Production-grade entry point with all middleware, security, and error handling
"""

from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging
import time
import uuid
from datetime import datetime
from typing import Optional
import os

# Import configurations
from app.core.config import settings
from app.core.security import init_security_managers, jwt_manager

# Import routers
from app.api import (
    auth_router,
    sessions_router,
    voice_router,
    video_router,
    document_router,
    liveness_router,
    scam_router,
    risk_router,
    incidents_router,
    webhooks_router,
    health_router,
    deepfake_router,
    legal_router,
    crawler_router,
)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Autonomous Deepfake & Fraud Prevention Firewall - Production Enterprise System",
    version=settings.APP_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
)

# ============================================================================
# MIDDLEWARE CONFIGURATION
# ============================================================================

# 1. Trusted Host Middleware - Prevent host header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["adfp.company.com", "localhost", "127.0.0.1"]
)

# 2. GZIP Compression - Reduce response size
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# 3. CORS Middleware - Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
    max_age=600,  # Cache preflight for 10 minutes
)


# ============================================================================
# CUSTOM MIDDLEWARE
# ============================================================================

class RequestIDMiddleware:
    """Add request ID to all requests for tracking"""
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Add to response headers
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class RequestLoggingMiddleware:
    """Log all HTTP requests"""
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        # Log request
        start_time = time.time()
        
        request_id = getattr(request.state, "request_id", "unknown")
        logger.info(
            f"REQUEST {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "client": request.client.host if request.client else "unknown",
                "user_agent": request.headers.get("user-agent", "unknown"),
            }
        )
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log response
            logger.info(
                f"RESPONSE {response.status_code} - {process_time:.3f}s",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "duration_ms": int(process_time * 1000),
                }
            )
            
            response.headers["X-Process-Time"] = str(process_time)
            return response
        
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"REQUEST FAILED after {process_time:.3f}s: {str(e)}",
                extra={
                    "request_id": request_id,
                    "duration_ms": int(process_time * 1000),
                    "error": str(e),
                }
            )
            raise


# Add custom middleware
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RequestIDMiddleware)


# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

def setup_logging():
    """Configure logging for production"""
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    if settings.LOG_FORMAT == "json":
        from pythonjsonlogger import jsonlogger
        handler = logging.StreamHandler()
        formatter = jsonlogger.JsonFormatter(
            '%(timestamp)s %(level)s %(name)s %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    else:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    
    return logger


logger = setup_logging()


# ============================================================================
# EXCEPTION HANDLERS
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    request_id = getattr(request.state, "request_id", "unknown")
    
    logger.warning(
        f"VALIDATION_ERROR: {request.url.path}",
        extra={
            "request_id": request_id,
            "errors": exc.errors(),
        }
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error_code": "VALIDATION_ERROR",
            "message": "Invalid request parameters",
            "details": exc.errors(),
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    request_id = getattr(request.state, "request_id", "unknown")
    
    logger.warning(
        f"HTTP_EXCEPTION: {exc.status_code} - {exc.detail}",
        extra={
            "request_id": request_id,
            "status_code": exc.status_code,
            "detail": exc.detail,
        }
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": f"HTTP_{exc.status_code}",
            "message": exc.detail,
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    request_id = getattr(request.state, "request_id", "unknown")
    
    logger.error(
        f"UNHANDLED_EXCEPTION: {str(exc)}",
        extra={
            "request_id": request_id,
            "exception_type": type(exc).__name__,
            "error": str(exc),
        },
        exc_info=True
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred. Please try again later.",
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )


# ============================================================================
# STARTUP & SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup"""
    logger.info("Initializing A-DFP Firewall...")
    
    # Initialize security managers
    init_security_managers(settings.SECRET_KEY, settings.ENCRYPTION_KEY)
    logger.info("Security managers initialized")
    
    # Initialize database connections
    logger.info("Connecting to databases...")
    # Database connection logic here
    
    # Load ML models
    logger.info("Loading ML models...")
    # Model loading logic here
    
    # Start background tasks
    logger.info("Starting background tasks...")
    # Celery, cleanup tasks, etc.
    
    logger.info("✓ A-DFP Firewall startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down A-DFP Firewall...")
    
    # Close database connections
    logger.info("Closing database connections...")
    
    # Cancel background tasks
    logger.info("Canceling background tasks...")
    
    logger.info("✓ A-DFP Firewall shutdown complete")


# ============================================================================
# API ROUTES
# ============================================================================

# Root endpoint
@app.get("/", tags=["General"])
async def root():
    """API root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "healthy",
        "docs": "/api/docs",
        "endpoints": {
            "v1": "/api/v1",
            "v2": "/api/v2",
        }
    }


# Include routers with API versioning
app.include_router(
    auth_router.router,
    prefix=settings.API_V1_STR + "/auth",
    tags=["Authentication"]
)

app.include_router(
    sessions_router.router,
    prefix=settings.API_V1_STR + "/sessions",
    tags=["Sessions"]
)

app.include_router(
    voice_router.router,
    prefix=settings.API_V1_STR + "/upload/voice",
    tags=["Voice Analysis"]
)

app.include_router(
    video_router.router,
    prefix=settings.API_V1_STR + "/upload/video",
    tags=["Video Analysis"]
)

app.include_router(
    document_router.router,
    prefix=settings.API_V1_STR + "/upload/document",
    tags=["Document Analysis"]
)

app.include_router(
    liveness_router.router,
    prefix=settings.API_V1_STR + "/liveness",
    tags=["Liveness Detection"]
)

app.include_router(
    scam_router.router,
    prefix=settings.API_V1_STR + "/analyze/scam",
    tags=["Scam Analysis"]
)

app.include_router(
    risk_router.router,
    prefix=settings.API_V1_STR + "/risk",
    tags=["Risk Scoring"]
)

app.include_router(
    incidents_router.router,
    prefix=settings.API_V1_STR + "/incidents",
    tags=["Incident Management"]
)

app.include_router(
    webhooks_router.router,
    prefix=settings.API_V1_STR + "/webhooks",
    tags=["Webhooks"]
)

app.include_router(
    health_router.router,
    prefix=settings.API_V1_STR + "/health",
    tags=["Health & Status"]
)

# DeepClean AI routers
app.include_router(
    deepfake_router,
    prefix=settings.API_V1_STR + "/deepfake",
    tags=["Deepfake Detection"]
)

app.include_router(
    legal_router,
    prefix=settings.API_V1_STR + "/legal",
    tags=["Legal Automation"]
)

app.include_router(
    crawler_router,
    prefix=settings.API_V1_STR + "/crawler",
    tags=["Web Crawler & Reverse Search"]
)


# ============================================================================
# PRODUCTION SETTINGS
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=4 if settings.ENVIRONMENT == "production" else 1,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
        access_log=True,
    )
