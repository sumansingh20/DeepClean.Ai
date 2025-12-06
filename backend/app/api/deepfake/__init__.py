"""
Deepfake detection module
Face manipulation, audio deepfakes, document forgery, composite analysis
"""

from .router import router
from .creation_router import router as creation_router

__all__ = ["router", "creation_router"]
