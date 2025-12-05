"""Utility functions for the A-DFP Firewall system"""

import hashlib
import hmac
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Tuple
from uuid import uuid4

import aiofiles
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class FileValidator:
    """Validate uploaded files"""

    ALLOWED_AUDIO = {'.wav', '.mp3', '.flac', '.m4a', '.ogg'}
    ALLOWED_VIDEO = {'.mp4', '.mov', '.avi', '.mkv', '.webm'}
    ALLOWED_DOCUMENT = {'.jpg', '.jpeg', '.png', '.pdf', '.bmp'}
    
    MAX_AUDIO_SIZE = 50 * 1024 * 1024  # 50MB
    MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB
    MAX_DOCUMENT_SIZE = 20 * 1024 * 1024  # 20MB

    @staticmethod
    def validate_audio(filename: str, file_size: int) -> Tuple[bool, str]:
        """Validate audio file"""
        if file_size > FileValidator.MAX_AUDIO_SIZE:
            return False, f"Audio file exceeds {FileValidator.MAX_AUDIO_SIZE / 1024 / 1024}MB limit"
        
        ext = os.path.splitext(filename)[1].lower()
        if ext not in FileValidator.ALLOWED_AUDIO:
            return False, f"Audio format {ext} not supported. Allowed: {FileValidator.ALLOWED_AUDIO}"
        
        return True, "Valid"

    @staticmethod
    def validate_video(filename: str, file_size: int) -> Tuple[bool, str]:
        """Validate video file"""
        if file_size > FileValidator.MAX_VIDEO_SIZE:
            return False, f"Video file exceeds {FileValidator.MAX_VIDEO_SIZE / 1024 / 1024}MB limit"
        
        ext = os.path.splitext(filename)[1].lower()
        if ext not in FileValidator.ALLOWED_VIDEO:
            return False, f"Video format {ext} not supported. Allowed: {FileValidator.ALLOWED_VIDEO}"
        
        return True, "Valid"

    @staticmethod
    def validate_document(filename: str, file_size: int) -> Tuple[bool, str]:
        """Validate document file"""
        if file_size > FileValidator.MAX_DOCUMENT_SIZE:
            return False, f"Document file exceeds {FileValidator.MAX_DOCUMENT_SIZE / 1024 / 1024}MB limit"
        
        ext = os.path.splitext(filename)[1].lower()
        if ext not in FileValidator.ALLOWED_DOCUMENT:
            return False, f"Document format {ext} not supported. Allowed: {FileValidator.ALLOWED_DOCUMENT}"
        
        return True, "Valid"


class StorageHelper:
    """Handle file storage operations"""

    @staticmethod
    def generate_storage_path(category: str, session_id: str, filename: str) -> str:
        """Generate standardized storage path"""
        # Format: deepfake/<category>/<session_id>/<timestamp>_<filename>
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_filename = hashlib.sha256(filename.encode()).hexdigest()[:16]
        return f"deepfake/{category}/{session_id}/{timestamp}_{safe_filename}"

    @staticmethod
    async def save_upload(
        file_content: bytes,
        filename: str,
        session_id: str,
        category: str,
        storage_path: str = "/tmp/deepfake_uploads"
    ) -> str:
        """Save uploaded file to local/cloud storage"""
        os.makedirs(storage_path, exist_ok=True)
        
        file_path = os.path.join(storage_path, filename)
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        logger.info(f"File saved: {file_path}")
        return file_path

    @staticmethod
    async def cleanup_file(file_path: str) -> bool:
        """Delete uploaded file after processing"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"File cleaned up: {file_path}")
                return True
        except Exception as e:
            logger.error(f"Error cleaning up file {file_path}: {e}")
        return False


class GeoHelper:
    """Geographic and velocity calculations"""

    # Approximate latitude/longitude to km conversion
    KM_PER_DEGREE = 111.32

    @staticmethod
    def calculate_distance(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> float:
        """Calculate distance between two coordinates (km) using simplified formula"""
        lat_diff = abs(lat2 - lat1)
        lon_diff = abs(lon2 - lon1)
        
        # Convert to km
        lat_km = lat_diff * GeoHelper.KM_PER_DEGREE
        lon_km = lon_diff * GeoHelper.KM_PER_DEGREE * ((lat1 + lat2) / 2)
        
        # Euclidean distance
        distance = (lat_km**2 + lon_km**2) ** 0.5
        return distance

    @staticmethod
    def is_impossible_travel(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
        time_diff_minutes: int,
        max_speed_kmh: float = 900  # Speed of commercial aircraft
    ) -> bool:
        """Check if travel between two points is physically possible"""
        distance = GeoHelper.calculate_distance(lat1, lon1, lat2, lon2)
        time_hours = time_diff_minutes / 60
        
        if time_hours <= 0:
            return False
        
        required_speed = distance / time_hours
        return required_speed > max_speed_kmh


class HashHelper:
    """Cryptographic hashing utilities"""

    @staticmethod
    def compute_file_hash(file_content: bytes, algorithm: str = 'sha256') -> str:
        """Compute file hash"""
        hasher = hashlib.new(algorithm)
        hasher.update(file_content)
        return hasher.hexdigest()

    @staticmethod
    def verify_hmac(
        message: str,
        signature: str,
        secret: str,
        algorithm: str = 'sha256'
    ) -> bool:
        """Verify HMAC signature"""
        expected_signature = hmac.new(
            secret.encode(),
            message.encode(),
            hashlib.new(algorithm)
        ).hexdigest()
        return hmac.compare_digest(signature, expected_signature)


class MetricsHelper:
    """Calculate fraud detection metrics"""

    @staticmethod
    def calculate_metrics(
        true_positives: int,
        false_positives: int,
        true_negatives: int,
        false_negatives: int
    ) -> Dict[str, float]:
        """Calculate precision, recall, F1-score, accuracy"""
        total = true_positives + false_positives + true_negatives + false_negatives
        
        if total == 0:
            return {"accuracy": 0, "precision": 0, "recall": 0, "f1_score": 0}
        
        accuracy = (true_positives + true_negatives) / total
        
        if (true_positives + false_positives) == 0:
            precision = 0
        else:
            precision = true_positives / (true_positives + false_positives)
        
        if (true_positives + false_negatives) == 0:
            recall = 0
        else:
            recall = true_positives / (true_positives + false_negatives)
        
        if precision + recall == 0:
            f1_score = 0
        else:
            f1_score = 2 * (precision * recall) / (precision + recall)
        
        return {
            "accuracy": round(accuracy, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1_score, 4),
        }


class ReportGenerator:
    """Generate fraud detection reports"""

    @staticmethod
    def generate_json_report(
        session_id: str,
        user_id: str,
        risk_score: Dict[str, Any],
        analyses: Dict[str, Any],
        action: str,
        timestamp: Optional[datetime] = None
    ) -> str:
        """Generate JSON report"""
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        report = {
            "report_id": str(uuid4()),
            "session_id": session_id,
            "user_id": user_id,
            "timestamp": timestamp.isoformat(),
            "overall_risk_score": risk_score.get("overall_score", 0),
            "risk_category": risk_score.get("category", "unknown"),
            "recommended_action": action,
            "component_scores": {
                "voice": analyses.get("voice", {}).get("score", 0),
                "video": analyses.get("video", {}).get("score", 0),
                "document": analyses.get("document", {}).get("score", 0),
                "liveness": analyses.get("liveness", {}).get("score", 0),
                "scam": analyses.get("scam", {}).get("score", 0),
            },
            "explanations": {
                "user_friendly": risk_score.get("explanation_user", ""),
                "analyst_detailed": risk_score.get("explanation_analyst", ""),
            },
            "next_steps": risk_score.get("next_steps", []),
        }
        
        return json.dumps(report, indent=2)

    @staticmethod
    def generate_html_report(
        session_id: str,
        user_id: str,
        risk_score: Dict[str, Any],
        analyses: Dict[str, Any],
        action: str,
        timestamp: Optional[datetime] = None
    ) -> str:
        """Generate HTML report"""
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        overall_score = risk_score.get("overall_score", 0)
        category = risk_score.get("category", "unknown")
        
        # Determine color based on risk
        if category == "critical":
            color = "#dc2626"  # Red
        elif category == "high":
            color = "#ea580c"  # Orange
        elif category == "medium":
            color = "#eab308"  # Yellow
        else:
            color = "#16a34a"  # Green
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>A-DFP Fraud Detection Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
                .container {{ background: white; padding: 30px; border-radius: 8px; }}
                .header {{ color: #1e40af; margin-bottom: 30px; }}
                .risk-score {{ font-size: 48px; color: {color}; font-weight: bold; }}
                .category {{ font-size: 24px; color: {color}; }}
                .section {{ margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid {color}; }}
                .metric {{ margin: 10px 0; }}
                .label {{ font-weight: bold; color: #333; }}
                .value {{ color: #666; margin-left: 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>A-DFP Fraud Detection Report</h1>
                    <p>Session ID: {session_id}</p>
                    <p>Generated: {timestamp.strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                </div>
                
                <div class="section">
                    <h2>Overall Risk Assessment</h2>
                    <div class="risk-score">{overall_score:.1%}</div>
                    <div class="category">{category.upper()}</div>
                    <div class="metric">
                        <span class="label">Recommended Action:</span>
                        <span class="value">{action}</span>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Component Analysis Scores</h2>
                    <div class="metric">
                        <span class="label">Voice Deepfake:</span>
                        <span class="value">{analyses.get('voice', {}).get('score', 0):.1%}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Video Deepfake:</span>
                        <span class="value">{analyses.get('video', {}).get('score', 0):.1%}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Document Forgery:</span>
                        <span class="value">{analyses.get('document', {}).get('score', 0):.1%}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Liveness:</span>
                        <span class="value">{analyses.get('liveness', {}).get('score', 0):.1%}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Scam Detection:</span>
                        <span class="value">{analyses.get('scam', {}).get('score', 0):.1%}</span>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Explanation</h2>
                    <p><strong>User-Friendly Summary:</strong></p>
                    <p>{risk_score.get('explanation_user', 'N/A')}</p>
                    <p><strong>Detailed Analysis:</strong></p>
                    <p>{risk_score.get('explanation_analyst', 'N/A')}</p>
                </div>
                
                <div class="section">
                    <h2>Next Steps</h2>
                    <ul>
        """
        
        for step in risk_score.get("next_steps", []):
            html += f"            <li>{step}</li>\n"
        
        html += """
                    </ul>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html


class CacheHelper:
    """Cache management utilities"""

    @staticmethod
    def generate_cache_key(prefix: str, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        parts = [prefix]
        parts.extend(str(arg) for arg in args)
        parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
        key = ":".join(parts)
        return hashlib.md5(key.encode()).hexdigest()

    @staticmethod
    def get_cache_ttl(risk_category: str) -> int:
        """Get TTL for cached results based on risk category"""
        ttl_map = {
            "critical": 300,  # 5 minutes
            "high": 600,  # 10 minutes
            "medium": 1800,  # 30 minutes
            "low": 3600,  # 1 hour
        }
        return ttl_map.get(risk_category, 1800)


class LoggingHelper:
    """Structured logging utilities"""

    @staticmethod
    def log_analysis_event(
        logger_instance: logging.Logger,
        event_type: str,
        session_id: str,
        analysis_type: str,
        result: Dict[str, Any],
        duration_seconds: float
    ) -> None:
        """Log analysis event with structured data"""
        log_data = {
            "event": event_type,
            "session_id": session_id,
            "analysis_type": analysis_type,
            "score": result.get("score", 0),
            "confidence": result.get("confidence", 0),
            "duration_ms": int(duration_seconds * 1000),
            "status": "success" if result.get("status") == "success" else "failed",
        }
        
        logger_instance.info(f"Analysis completed: {json.dumps(log_data)}")

    @staticmethod
    def log_fraud_alert(
        logger_instance: logging.Logger,
        session_id: str,
        user_id: str,
        risk_score: float,
        category: str,
        action: str
    ) -> None:
        """Log fraud alert with high visibility"""
        alert_data = {
            "alert": "FRAUD_DETECTED",
            "session_id": session_id,
            "user_id": user_id,
            "risk_score": risk_score,
            "category": category,
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        logger_instance.warning(f"FRAUD ALERT: {json.dumps(alert_data)}")
