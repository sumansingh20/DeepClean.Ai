"""
A-DFP Firewall - Autonomous Deepfake & Fraud Prevention System
Environment Configuration Management
"""

from pydantic_settings import BaseSettings
from typing import Optional, List
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Application
    APP_NAME: str = "A-DFP Firewall"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, staging, production
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    API_V2_STR: str = "/api/v2"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://adfp.company.com",
        "https://dashboard.adfp.company.com",
    ]
    
    # Database - PostgreSQL
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "adfp_user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "secure_password")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "adfp_db")
    POSTGRES_URL: Optional[str] = None
    
    @property
    def DATABASE_URL(self) -> str:
        """PostgreSQL connection URL"""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    # Database - MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "adfp_audit")
    
    # Cache - Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD", None)
    
    @property
    def REDIS_URL(self) -> str:
        """Redis connection URL"""
        password = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
        return f"redis://{password}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    # Storage - S3 / MinIO
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "adfp-media")
    S3_ENDPOINT_URL: str = os.getenv("S3_ENDPOINT_URL", "http://localhost:9000")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    S3_REGION: str = os.getenv("S3_REGION", "us-east-1")
    S3_USE_SSL: bool = os.getenv("S3_USE_SSL", "False").lower() == "true"
    
    # File Upload Limits
    MAX_AUDIO_FILE_SIZE: int = 50 * 1024 * 1024  # 50 MB
    MAX_VIDEO_FILE_SIZE: int = 500 * 1024 * 1024  # 500 MB
    MAX_DOCUMENT_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_AUDIO_FORMATS: List[str] = ["mp3", "wav", "m4a", "ogg", "flac"]
    ALLOWED_VIDEO_FORMATS: List[str] = ["mp4", "avi", "mov", "mkv", "webm"]
    ALLOWED_DOCUMENT_FORMATS: List[str] = ["jpg", "jpeg", "png", "pdf", "tif", "tiff"]
    
    # Celery - Task Queue
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_ACCEPT_CONTENT: List[str] = ["json"]
    CELERY_RESULT_SERIALIZER: str = "json"
    CELERY_TIMEZONE: str = "UTC"
    
    # Security - JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Security - Encryption
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "encryption-key-change-in-production")
    
    # Security - API Keys
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "admin-api-key-change")
    
    # ML Model Configuration
    MODELS_DIR: str = os.getenv("MODELS_DIR", "./ml_models")
    
    # Voice Deepfake Detector
    VOICE_MODEL_PATH: str = os.path.join(MODELS_DIR, "voice/deepfake_classifier/model.onnx")
    VOICE_WAV2VEC2_PRETRAINED: str = "facebook/wav2vec2-base"
    VOICE_AUDIO_SAMPLE_RATE: int = 16000
    VOICE_DEEPFAKE_THRESHOLD: float = 0.65
    VOICE_DEEPFAKE_ESCALATE_THRESHOLD: float = 0.85
    
    # Video Deepfake Detector
    VIDEO_MODEL_PATH: str = os.path.join(MODELS_DIR, "video/deepfake_detector/model.onnx")
    VIDEO_RETINAFACE_PATH: str = os.path.join(MODELS_DIR, "video/retinaface/model.onnx")
    VIDEO_FPS: int = 2  # Frames per second to extract
    VIDEO_MAX_FRAMES: int = 100
    VIDEO_DEEPFAKE_THRESHOLD: float = 0.65
    VIDEO_DEEPFAKE_ESCALATE_THRESHOLD: float = 0.85
    
    # Document Forgery Detector
    DOCUMENT_FORGERY_THRESHOLD: float = 0.60
    DOCUMENT_FORGERY_ESCALATE_THRESHOLD: float = 0.80
    USE_TESSERACT: bool = False  # Set to True if Tesseract installed
    TESSERACT_PATH: Optional[str] = None
    
    # Scam Call Analyzer
    SCAM_ASR_MODEL: str = "openai/whisper-base"
    SCAM_NLP_MODEL: str = "distilbert-base-uncased"
    SCAM_ANALYSIS_THRESHOLD: float = 0.60
    
    # Liveness Detector
    LIVENESS_CHALLENGE_TIMEOUT: int = 60  # seconds
    LIVENESS_REQUIRED_BLINKS: int = 2
    LIVENESS_CHALLENGE_TYPES: List[str] = ["blink", "smile", "head_turn", "phrase"]
    
    # Risk Scoring - Fusion Engine
    RISK_SCORE_WEIGHTS: dict = {
        "voice": 0.20,
        "video": 0.25,
        "document": 0.25,
        "scam": 0.15,
        "liveness": 0.15,
    }
    
    RISK_SCORE_THRESHOLDS: dict = {
        "low": 0.30,
        "medium": 0.60,
        "high": 0.85,
    }
    
    RISK_ACTIONS: dict = {
        "low": "allow",
        "medium": "escalate",
        "high": "block",
    }
    
    # Response Engine
    ENABLE_WEBHOOKS: bool = os.getenv("ENABLE_WEBHOOKS", "True").lower() == "true"
    WEBHOOK_TIMEOUT: int = 30  # seconds
    WEBHOOK_RETRY_ATTEMPTS: int = 3
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "json"  # "json" or "text"
    ELASTICSEARCH_HOST: str = os.getenv("ELASTICSEARCH_HOST", "localhost")
    ELASTICSEARCH_PORT: int = int(os.getenv("ELASTICSEARCH_PORT", "9200"))
    ELASTICSEARCH_INDEX: str = "adfp-logs"
    
    # Monitoring - Prometheus
    PROMETHEUS_ENABLED: bool = os.getenv("PROMETHEUS_ENABLED", "True").lower() == "true"
    PROMETHEUS_PORT: int = 9090
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    # CORS
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Session Management
    SESSION_TIMEOUT: int = 3600  # 1 hour in seconds
    SESSION_CLEANUP_INTERVAL: int = 3600  # 1 hour
    
    # Data Retention
    AUDIO_RETENTION_DAYS: int = 30
    VIDEO_RETENTION_DAYS: int = 30
    INCIDENT_RETENTION_DAYS: int = 365
    AUDIT_LOG_RETENTION_DAYS: int = 180
    
    # Compliance
    GDPR_ENABLED: bool = True
    ENABLE_ENCRYPTION_AT_REST: bool = True
    ENABLE_AUDIT_LOGGING: bool = True
    
    # Third-party Integrations
    SLACK_WEBHOOK_URL: Optional[str] = os.getenv("SLACK_WEBHOOK_URL", None)
    SENDGRID_API_KEY: Optional[str] = os.getenv("SENDGRID_API_KEY", None)
    SENDGRID_FROM_EMAIL: str = os.getenv("SENDGRID_FROM_EMAIL", "alerts@adfp.company.com")
    
    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
