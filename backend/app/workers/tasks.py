"""
Celery task workers for background processing
Handles voice, video, document analysis and report generation
"""

from celery import Celery, Task
from app.core.config import settings
from app.services.ml_models import model_manager
from app.services.fusion_engine import FusionEngine, ResponseEngine, ExplainabilityGenerator
import logging
import time

logger = logging.getLogger(__name__)

# Initialize Celery
app = Celery(
    'adfp_firewall',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Configure Celery
app.conf.update(
    task_serializer=settings.CELERY_TASK_SERIALIZER,
    accept_content=settings.CELERY_ACCEPT_CONTENT,
    result_serializer=settings.CELERY_RESULT_SERIALIZER,
    timezone=settings.CELERY_TIMEZONE,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
)


class CallbackTask(Task):
    """Base task with callbacks"""
    
    def on_success(self, retval, task_id, args, kwargs):
        """On task success"""
        logger.info(f"Task {task_id} completed successfully")
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """On task failure"""
        logger.error(f"Task {task_id} failed: {str(exc)}")


# ============================================================================
# VOICE ANALYSIS TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='analyze_voice')
def analyze_voice_task(self, session_id: str, audio_path: str):
    """
    Analyze voice audio for deepfake detection
    
    Task parameters:
    - session_id: Session identifier
    - audio_path: S3 path to audio file
    """
    try:
        logger.info(f"Starting voice analysis for session {session_id}")
        
        # Get voice detector
        detector = model_manager.get_voice_detector()
        
        # Analyze
        result = detector.classify(audio_path)
        
        # Store result in database
        from app.models.database import SessionLocal, Session as SessionModel
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.voice_score = result.score
                session.voice_confidence = result.confidence
                session.voice_status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Voice analysis complete for session {session_id}: score={result.score:.2%}")
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.document_score = result.score
                session.document_confidence = result.confidence
                session.document_status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Document analysis complete for session {session_id}: score={result.score:.2%}")
        
        return {
            'session_id': session_id,
            'score': result.score,
            'confidence': result.confidence,
            'is_deepfake': result.is_fraudulent,
            'explanations': result.explanations,
            'processing_time_ms': result.processing_time_ms,
        }
    
    except Exception as e:
        logger.error(f"Voice analysis failed for {session_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# VIDEO ANALYSIS TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='analyze_video')
def analyze_video_task(self, session_id: str, video_path: str):
    """
    Analyze video for deepfake detection
    
    Task parameters:
    - session_id: Session identifier
    - video_path: S3 path to video file
    """
    try:
        logger.info(f"Starting video analysis for session {session_id}")
        
        # Get video detector
        detector = model_manager.get_video_detector()
        
        # Analyze (longer operation)
        result = detector.classify(video_path)
        
        # Store result in database
        from app.models.database import SessionLocal, Session as SessionModel
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.video_score = result.score
                session.video_confidence = result.confidence
                session.video_status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Video analysis complete for session {session_id}: score={result.score:.2%}")
        
        return {
            'session_id': session_id,
            'score': result.score,
            'confidence': result.confidence,
            'is_deepfake': result.is_fraudulent,
            'explanations': result.explanations,
            'processing_time_ms': result.processing_time_ms,
        }
    
    except Exception as e:
        logger.error(f"Video analysis failed for {session_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# DOCUMENT ANALYSIS TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='analyze_document')
def analyze_document_task(self, session_id: str, image_path: str, doc_type: str = 'id_card'):
    """
    Analyze document for forgery detection
    
    Task parameters:
    - session_id: Session identifier
    - image_path: S3 path to document image
    - doc_type: Document type (id_card, passport, license, etc.)
    """
    try:
        logger.info(f"Starting document analysis for session {session_id}")
        
        # Get document detector
        detector = model_manager.get_document_detector()
        
        # Analyze
        result = detector.analyze_document(image_path)
        
        # Store result in database
        from app.models.database import SessionLocal, Session as SessionModel
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.document_score = result.score
                session.document_confidence = result.confidence
                session.document_status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Document analysis complete for session {session_id}: score={result.score:.2%}")
        
        return {
            'session_id': session_id,
            'score': result.score,
            'confidence': result.confidence,
            'is_forged': result.is_fraudulent,
            'explanations': result.explanations,
            'processing_time_ms': result.processing_time_ms,
        }
    
    except Exception as e:
        logger.error(f"Document analysis failed for {session_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# SCAM ANALYSIS TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='analyze_scam')
def analyze_scam_task(self, session_id: str, audio_path: str):
    """
    Analyze call recording for scam patterns
    
    Task parameters:
    - session_id: Session identifier
    - audio_path: S3 path to call recording
    """
    try:
        logger.info(f"Starting scam analysis for session {session_id}")
        
        # Get scam analyzer
        analyzer = model_manager.get_scam_analyzer()
        
        # Analyze
        result = analyzer.analyze(audio_path)
        
        # Store result in database
        from app.models.database import SessionLocal, Session as SessionModel
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.scam_score = result.score
                session.scam_confidence = result.confidence
                session.scam_status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Scam analysis complete for session {session_id}: score={result.score:.2%}")
        
        return {
            'session_id': session_id,
            'score': result.score,
            'confidence': result.confidence,
            'is_scam': result.is_fraudulent,
            'explanations': result.explanations,
            'processing_time_ms': result.processing_time_ms,
        }
    
    except Exception as e:
        logger.error(f"Scam analysis failed for {session_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# LIVENESS TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='verify_liveness')
def verify_liveness_task(self, session_id: str, video_path: str, challenge_type: str):
    """
    Verify liveness from challenge response video
    
    Task parameters:
    - session_id: Session identifier
    - video_path: S3 path to challenge response video
    - challenge_type: Type of challenge (blink, smile, etc.)
    """
    try:
        logger.info(f"Starting liveness verification for session {session_id}")
        
        # Get liveness detector
        detector = model_manager.get_liveness_detector()
        
        # Verify
        result = detector.detect_liveness(video_path, challenge_type)
        
        # Store result in database
        from app.models.database import SessionLocal, Session as SessionModel
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.liveness_score = result.score
                session.liveness_confidence = result.confidence
                session.liveness_status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Liveness verification complete for session {session_id}: score={result.score:.2%}")
        
        return {
            'session_id': session_id,
            'score': result.score,
            'confidence': result.confidence,
            'is_live': not result.is_fraudulent,
            'explanations': result.explanations,
            'processing_time_ms': result.processing_time_ms,
        }
    
    except Exception as e:
        logger.error(f"Liveness verification failed for {session_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# FUSION & RISK SCORING TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='calculate_risk_score')
def calculate_risk_score_task(self, session_id: str, component_results: dict):
    """
    Calculate final risk score from all component results
    
    Task parameters:
    - session_id: Session identifier
    - component_results: Dictionary of all component analysis results
    """
    try:
        logger.info(f"Calculating risk score for session {session_id}")
        
        # Initialize engines
        fusion_engine = FusionEngine()
        response_engine = ResponseEngine()
        explainability = ExplainabilityGenerator()
        
        # Calculate risk score
        risk_breakdown = fusion_engine.calculate_risk_score(
            voice_result=component_results.get('voice'),
            video_result=component_results.get('video'),
            document_result=component_results.get('document'),
            scam_result=component_results.get('scam'),
            liveness_result=component_results.get('liveness'),
        )
        
        # Determine action
        action_result = response_engine.determine_action(
            risk_score=risk_breakdown.final_score,
            risk_category=risk_breakdown.risk_category,
            confidence=risk_breakdown.confidence,
        )
        
        # Generate explanations
        explanations = explainability.generate_explanation(risk_breakdown)
        
        # Store results in database
        from app.models.database import SessionLocal, Session as SessionModel
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if session:
                session.final_risk_score = risk_breakdown.final_score
                session.risk_confidence = risk_breakdown.confidence
                session.risk_category = risk_breakdown.risk_category
                session.action_taken = action_result['action']
                session.status = 'completed'
                db.commit()
        finally:
            db.close()
        
        logger.info(f"Risk score calculated for session {session_id}: {risk_breakdown.final_score:.2%}")
        
        return {
            'session_id': session_id,
            'final_score': risk_breakdown.final_score,
            'confidence': risk_breakdown.confidence,
            'risk_category': risk_breakdown.risk_category,
            'action': action_result['action'],
            'action_reason': action_result['reason'],
            'next_steps': action_result['next_steps'],
            'explanations': explanations,
            'component_breakdown': {
                'voice': risk_breakdown.voice_score,
                'video': risk_breakdown.video_score,
                'document': risk_breakdown.document_score,
                'scam': risk_breakdown.scam_score,
                'liveness': risk_breakdown.liveness_score,
            }
        }
    
    except Exception as e:
        logger.error(f"Risk score calculation failed for {session_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# REPORT GENERATION TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='generate_report')
def generate_report_task(self, incident_id: str, session_id: str, format: str = 'pdf'):
    """
    Generate forensic incident report
    
    Task parameters:
    - incident_id: Incident identifier
    - session_id: Related session identifier
    - format: Report format (pdf, json, html)
    """
    try:
        logger.info(f"Generating {format.upper()} report for incident {incident_id}")
        
        # Compile all evidence from database
        from app.models.database import SessionLocal, Session as SessionModel, Incident
        import json
        from datetime import datetime
        
        db = SessionLocal()
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            incident = db.query(Incident).filter(Incident.id == incident_id).first()
            
            if not session or not incident:
                raise ValueError(f"Session {session_id} or Incident {incident_id} not found")
            
            # Generate evidence package
            evidence = {
                'incident_id': incident_id,
                'session_id': session_id,
                'generated_at': datetime.utcnow().isoformat(),
                'format': format,
                'risk_score': session.final_risk_score,
                'risk_category': session.risk_category,
                'action_taken': session.action_taken,
                'incident': {
                    'title': incident.title,
                    'description': incident.description,
                    'severity': incident.severity,
                    'status': incident.status
                },
                'components': {
                    'voice': {'score': session.voice_score, 'confidence': session.voice_confidence},
                    'video': {'score': session.video_score, 'confidence': session.video_confidence},
                    'document': {'score': session.document_score, 'confidence': session.document_confidence},
                    'scam': {'score': session.scam_score, 'confidence': session.scam_confidence},
                    'liveness': {'score': session.liveness_score, 'confidence': session.liveness_confidence}
                },
                'metadata': {
                    'ip_address': session.ip_address,
                    'user_agent': session.user_agent,
                    'created_at': session.created_at.isoformat()
                }
            }
            
            # Generate report content based on format
            report_data = json.dumps(evidence, indent=2)
            logger.info(f"Report compiled: {len(report_data)} bytes in {format} format")
            
            # In production: upload to S3
            # s3_path = f"reports/{incident_id}/{format}/{datetime.utcnow().isoformat()}.{format}"
            # s3_client.put_object(Bucket=bucket, Key=s3_path, Body=report_data)
            
        finally:
            db.close()
        
        logger.info(f"Report generation complete for incident {incident_id}")
        
        return {
            'incident_id': incident_id,
            'report_format': format,
            'report_url': f"s3://adfp-reports/{incident_id}.{format}",
            'generated_at': time.time(),
        }
    
    except Exception as e:
        logger.error(f"Report generation failed for {incident_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# ESCALATION TASKS
# ============================================================================

@app.task(base=CallbackTask, bind=True, name='escalate_incident')
def escalate_incident_task(self, incident_id: str, severity: str):
    """
    Escalate incident to fraud team
    
    Task parameters:
    - incident_id: Incident identifier
    - severity: Incident severity (high, critical)
    """
    try:
        logger.info(f"Escalating incident {incident_id} (severity: {severity})")
        
        # Send alerts via multiple channels
        from app.models.database import SessionLocal, Incident
        db = SessionLocal()
        try:
            incident = db.query(Incident).filter(Incident.id == incident_id).first()
            if incident:
                alert_channels = []
                
                # Log alert (production would integrate with Slack/email/webhooks)
                logger.warning(
                    f"INCIDENT ALERT: {incident.title} | "
                    f"Severity: {incident.severity} | "
                    f"Risk Score: {incident.risk_score:.2%} | "
                    f"Action: {incident.action_taken}"
                )
                alert_channels.append('logging')
                
                # In production: integrate with actual services
                # slack_client.send_message(...)
                # email_service.send_alert(...)
                # webhook_manager.trigger(...)
                # jira_client.create_ticket(...)
                
                logger.info(f"Alerts sent via channels: {', '.join(alert_channels)}")
        finally:
            db.close()
        
        logger.info(f"Incident {incident_id} escalated successfully")
        
        return {
            'incident_id': incident_id,
            'escalated': True,
            'timestamp': time.time(),
        }
    
    except Exception as e:
        logger.error(f"Incident escalation failed for {incident_id}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# CLEANUP TASKS
# ============================================================================

@app.task(bind=True, name='cleanup_expired_sessions')
def cleanup_expired_sessions(self):
    """Periodic task: Delete expired sessions and files"""
    try:
        logger.info("Running session cleanup task")
        
        # Query and delete expired sessions
        from app.models.database import SessionLocal, Session as SessionModel
        from datetime import datetime, timedelta
        
        db = SessionLocal()
        try:
            # Find sessions older than 7 days
            cutoff_date = datetime.utcnow() - timedelta(days=7)
            expired_sessions = db.query(SessionModel).filter(
                SessionModel.expires_at < cutoff_date
            ).all()
            
            deleted_count = 0
            for session in expired_sessions:
                # In production: delete S3 files if any
                # s3_client.delete_object(Bucket=bucket, Key=session.voice_file_url)
                
                db.delete(session)
                deleted_count += 1
            
            db.commit()
            logger.info(f"Deleted {deleted_count} expired sessions")
        finally:
            db.close()
        
        logger.info("Session cleanup complete")
        
    except Exception as e:
        logger.error(f"Session cleanup failed: {str(e)}", exc_info=True)


@app.task(bind=True, name='cleanup_old_incidents')
def cleanup_old_incidents(self):
    """Periodic task: Archive/delete old incidents per retention policy"""
    try:
        logger.info("Starting incident cleanup")
        
        # Query and archive old incidents
        from app.models.database import SessionLocal, Incident
        from datetime import datetime, timedelta
        import json
        
        db = SessionLocal()
        try:
            # Find incidents older than 90 days
            cutoff_date = datetime.utcnow() - timedelta(days=90)
            old_incidents = db.query(Incident).filter(
                Incident.created_at < cutoff_date,
                Incident.is_reviewed == True
            ).all()
            
            archived_count = 0
            for incident in old_incidents:
                # Archive to long-term storage
                archive_data = {
                    'id': str(incident.id),
                    'title': incident.title,
                    'risk_score': incident.risk_score,
                    'severity': incident.severity,
                    'created_at': incident.created_at.isoformat(),
                    'resolved_at': incident.resolved_at.isoformat() if incident.resolved_at else None
                }
                
                # In production: save to S3 archive bucket
                # s3_client.put_object(Bucket=archive_bucket, Key=f'incidents/{incident.id}.json', Body=json.dumps(archive_data))
                
                logger.debug(f"Archived incident {incident.id}")
                archived_count += 1
            
            logger.info(f"Archived {archived_count} old incidents")
        finally:
            db.close()
        
        logger.info("Incident cleanup completed")
        
    except Exception as e:
        logger.error(f"Incident cleanup failed: {str(e)}", exc_info=True)


# ============================================================================
# PERIODIC TASKS (BEAT SCHEDULE)
# ============================================================================

from celery.schedules import crontab

app.conf.beat_schedule = {
    'cleanup-sessions-daily': {
        'task': 'cleanup_expired_sessions',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2 AM
    },
    'cleanup-incidents-daily': {
        'task': 'cleanup_old_incidents',
        'schedule': crontab(hour=3, minute=0),  # Daily at 3 AM
    },
}
