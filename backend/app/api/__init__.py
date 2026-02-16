"""Initialize API routers module"""
from fastapi import APIRouter

# Import all routers
from . import (
    auth_router,
    sessions_router,
)

# Import other routers from routers.py
from .routers import (
    voice_router,
    video_router,
    document_router,
    liveness_router,
    scam_router,
    risk_router,
    incidents_router,
    webhooks_router,
    health_router,
)

# Import DeepClean AI routers from organized folders
from .deepfake import router as deepfake_router
from .legal import router as legal_router
from .crawler import router as crawler_router

# Export all routers
__all__ = [
    'auth_router',
    'sessions_router',
    'voice_router',
    'video_router',
    'document_router',
    'liveness_router',
    'scam_router',
    'risk_router',
    'incidents_router',
    'webhooks_router',
    'health_router',
    'deepfake_router',
    'legal_router',
    'crawler_router',
]
