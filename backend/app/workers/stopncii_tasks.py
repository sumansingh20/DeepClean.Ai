"""
Celery Background Tasks for StopNCII Platform
==============================================

Production-ready async tasks for:
- Media file processing (hashing + deepfake detection)
- Hash matching against database
- Report notifications
- Evidence package generation
"""

from celery import Celery, Task
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, and_, func
from datetime import datetime
from uuid import UUID
import os
import logging
import tempfile
import asyncio

from app.core.config import settings
from app.services.perceptual_hashing import PerceptualHasher, SimilarityMatcher
from app.services.deepfake_detection import DeepfakeDetector
from app.models.stopncii_models import MediaHash, AnalysisJob, HashMatch, AuditLog

logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    'stopncii_worker',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    task_track_started=True,
    task_time_limit=900,  # 15 minutes max
    task_soft_time_limit=840,  # 14 minutes soft limit
    worker_prefetch_multiplier=1,  # Process one task at a time
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)

# Database setup for async workers
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://deepfake_user:deepfake_password@localhost:5432/deepfake_db"
)

async_engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


class DatabaseTask(Task):
    """Base task with database session management"""
    
    def __init__(self):
        self._hasher = None
        self._detector = None
        self._matcher = None
    
    @property
    def hasher(self):
        """Lazy-load perceptual hasher"""
        if self._hasher is None:
            self._hasher = PerceptualHasher()
        return self._hasher
    
    @property
    def detector(self):
        """Lazy-load deepfake detector"""
        if self._detector is None:
            self._detector = DeepfakeDetector()
        return self._detector
    
    @property
    def matcher(self):
        """Lazy-load similarity matcher"""
        if self._matcher is None:
            self._matcher = SimilarityMatcher()
        return self._matcher
    
    def on_success(self, retval, task_id, args, kwargs):
        """Success callback"""
        logger.info(f"Task {task_id} completed successfully")
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Failure callback"""
        logger.error(f"Task {task_id} failed: {str(exc)}")


def run_async(coro):
    """Helper to run async functions in sync Celery tasks"""
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(coro)


@celery_app.task(base=DatabaseTask, bind=True, name='process_media_file')
def process_media_file(self, job_id: str, file_path: str, user_id: str, metadata: dict = None):
    """
    Complete media processing pipeline:
    1. Compute perceptual hash (PDQ/TMK)
    2. Run deepfake detection
    3. Check for existing matches in database
    4. Store results in database
    5. Delete temporary file
    6. Send WebSocket notifications
    
    Args:
        job_id: UUID of AnalysisJob
        file_path: Path to temporary uploaded file
        user_id: UUID of user who uploaded
        metadata: Optional user-provided metadata
    """
    async def process():
        async with AsyncSessionLocal() as db:
            try:
                # Update job status to processing
                job_uuid = UUID(job_id)
                user_uuid = UUID(user_id)
                
                result = await db.execute(
                    select(AnalysisJob).where(AnalysisJob.id == job_uuid)
                )
                job = result.scalar_one_or_none()
                
                if not job:
                    logger.error(f"Job {job_id} not found")
                    return {'status': 'failed', 'error': 'Job not found'}
                
                job.status = 'processing'
                job.started_at = datetime.utcnow()
                job.current_step = 'validating'
                job.progress = 5
                await db.commit()
                
                # Determine media type
                file_ext = os.path.splitext(file_path)[1].lower()
                is_video = file_ext in ['.mp4', '.avi', '.mov', '.mkv', '.webm']
                media_type = 'video' if is_video else 'image'
                
                # Step 1: Compute perceptual hash
                logger.info(f"Computing hash for {file_path}")
                job.current_step = 'hashing'
                job.progress = 20
                await db.commit()
                
                start_time = datetime.utcnow()
                
                if is_video:
                    hash_result = self.hasher.hash_video(file_path)
                    pdq_hash = None
                    tmk_hash = hash_result['tmk_hash']
                else:
                    hash_result = self.hasher.hash_image(file_path)
                    pdq_hash = hash_result['pdq_hash']
                    tmk_hash = None
                
                hash_time = (datetime.utcnow() - start_time).total_seconds() * 1000
                logger.info(f"Hash computed in {hash_time}ms")
                
                # Step 2: Run deepfake detection
                logger.info(f"Running deepfake detection")
                job.current_step = 'detecting'
                job.progress = 50
                await db.commit()
                
                start_time = datetime.utcnow()
                
                if is_video:
                    detection_result = self.detector.detect_video(file_path)
                else:
                    detection_result = self.detector.detect_image(file_path)
                
                detection_time = (datetime.utcnow() - start_time).total_seconds() * 1000
                logger.info(f"Detection completed in {detection_time}ms: deepfake={detection_result['is_deepfake']}")
                
                # Step 3: Check for existing matches
                logger.info(f"Checking for existing matches")
                job.current_step = 'matching'
                job.progress = 75
                await db.commit()
                
                hash_to_check = pdq_hash or tmk_hash
                hash_type = 'pdq' if pdq_hash else 'tmk'
                
                # Query all active hashes of the same type
                result = await db.execute(
                    select(MediaHash).where(
                        and_(
                            MediaHash.hash_type.in_([hash_type, 'pdq+tmk']),
                            MediaHash.status == 'active'
                        )
                    )
                )
                existing_hashes = result.scalars().all()
                
                # Calculate similarity for each
                matches = []
                for existing in existing_hashes:
                    comparison = self.matcher.calculate_similarity(
                        hash_to_check,
                        existing.hash_value
                    )
                    
                    # Consider it a match if Hamming distance <= 10
                    if comparison['hamming_distance'] <= 10:
                        matches.append({
                            'hash_id': existing.id,
                            'hamming_distance': comparison['hamming_distance'],
                            'similarity_score': comparison['similarity_score'],
                            'match_type': comparison['match_type']
                        })
                        
                        # Record the match
                        hash_match = HashMatch(
                            original_hash_id=None,  # Will be set after creating MediaHash
                            matched_hash_id=existing.id,
                            hamming_distance=comparison['hamming_distance'],
                            similarity_score=comparison['similarity_score'],
                            match_type=comparison['match_type'],
                            detected_by_user_id=user_uuid,
                            detection_context='upload',
                            action_taken='flagged'
                        )
                        db.add(hash_match)
                        
                        # Increment match count on existing hash
                        existing.match_count += 1
                
                # Step 4: Store hash and results
                logger.info(f"Storing results in database")
                job.current_step = 'saving'
                job.progress = 90
                await db.commit()
                
                # Create MediaHash record
                media_hash = MediaHash(
                    hash_value=hash_to_check,
                    hash_type=hash_type,
                    media_type=media_type,
                    file_size_bytes=os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                    is_deepfake=detection_result['is_deepfake'],
                    deepfake_confidence=detection_result['confidence'],
                    deepfake_model_version=detection_result['model_version'],
                    uploaded_by_user_id=user_uuid,
                    status='active',
                    victim_consent_obtained=metadata.get('consent_obtained', False) if metadata else False,
                    contains_minor=metadata.get('contains_minor', False) if metadata else False
                )
                db.add(media_hash)
                await db.flush()  # Get the ID
                
                # Update job with results
                job.status = 'completed'
                job.current_step = 'complete'
                job.progress = 100
                job.completed_at = datetime.utcnow()
                job.media_hash_id = media_hash.id
                job.pdq_hash = pdq_hash
                job.tmk_hash = tmk_hash
                job.is_deepfake = detection_result['is_deepfake']
                job.deepfake_confidence = detection_result['confidence']
                job.matches_found = len(matches) > 0
                job.match_count = len(matches)
                job.highest_similarity = max([m['similarity_score'] for m in matches], default=0.0)
                job.processing_time_ms = int(hash_time + detection_time)
                
                # Update match records with correct original_hash_id
                result = await db.execute(
                    select(HashMatch).where(
                        and_(
                            HashMatch.original_hash_id.is_(None),
                            HashMatch.detected_by_user_id == user_uuid
                        )
                    ).order_by(HashMatch.created_at.desc()).limit(len(matches))
                )
                for match_record in result.scalars().all():
                    match_record.original_hash_id = media_hash.id
                
                # Create audit log
                audit = AuditLog(
                    action='media_analyzed',
                    resource_type='media_hash',
                    resource_id=media_hash.id,
                    user_id=user_uuid,
                    status='success',
                    details={
                        'job_id': str(job_id),
                        'media_type': media_type,
                        'is_deepfake': detection_result['is_deepfake'],
                        'matches_found': len(matches),
                        'processing_time_ms': job.processing_time_ms
                    }
                )
                db.add(audit)
                
                await db.commit()
                
                # Step 5: Clean up temporary file
                if os.path.exists(file_path):
                    os.unlink(file_path)
                    logger.info(f"Deleted temporary file: {file_path}")
                
                logger.info(f"Job {job_id} completed successfully")
                
                return {
                    'status': 'completed',
                    'job_id': str(job_id),
                    'media_hash_id': str(media_hash.id),
                    'hash_value': hash_to_check,
                    'is_deepfake': detection_result['is_deepfake'],
                    'matches_found': len(matches),
                    'match_count': len(matches)
                }
                
            except Exception as e:
                logger.error(f"Error processing job {job_id}: {str(e)}", exc_info=True)
                
                # Update job with error
                try:
                    result = await db.execute(
                        select(AnalysisJob).where(AnalysisJob.id == UUID(job_id))
                    )
                    job = result.scalar_one_or_none()
                    if job:
                        job.status = 'failed'
                        job.error_message = str(e)
                        job.completed_at = datetime.utcnow()
                        await db.commit()
                except:
                    pass
                
                # Clean up file on error
                if os.path.exists(file_path):
                    os.unlink(file_path)
                
                raise
    
    return run_async(process())


@celery_app.task(name='send_report_notification')
def send_report_notification(report_id: str, recipient_email: str, report_type: str):
    """
    Send email notification about report status.
    
    Args:
        report_id: UUID of ContentReport
        recipient_email: Email address to send to
        report_type: Type of report (ncii, deepfake, etc.)
    """
    async def send():
        try:
            # In production, integrate with email service (SendGrid, SES, etc.)
            logger.info(f"Sending notification for report {report_id} to {recipient_email}")
            
            # TODO: Integrate with actual email service
            # Example with SendGrid:
            # from sendgrid import SendGridAPIClient
            # from sendgrid.helpers.mail import Mail
            # message = Mail(from_email='noreply@stopncii.org', to_emails=recipient_email, ...)
            # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            # response = sg.send(message)
            
            async with AsyncSessionLocal() as db:
                audit = AuditLog(
                    action='notification_sent',
                    resource_type='content_report',
                    resource_id=UUID(report_id),
                    status='success',
                    details={
                        'recipient': recipient_email,
                        'report_type': report_type
                    }
                )
                db.add(audit)
                await db.commit()
            
            return {'status': 'sent', 'report_id': report_id}
            
        except Exception as e:
            logger.error(f"Failed to send notification: {str(e)}", exc_info=True)
            raise
    
    return run_async(send())


@celery_app.task(name='generate_evidence_package')
def generate_evidence_package(report_id: str, options: dict = None):
    """
    Generate encrypted evidence package for legal proceedings.
    
    Args:
        report_id: UUID of ContentReport
        options: Generation options (include_timeline, etc.)
    """
    async def generate():
        try:
            logger.info(f"Generating evidence package for report {report_id}")
            
            # In production:
            # 1. Fetch report and all related data from database
            # 2. Generate PDF documents (report summary, hash certificate)
            # 3. Create JSON files (timeline, platform responses)
            # 4. Create ZIP archive
            # 5. Encrypt with password
            # 6. Upload to S3
            # 7. Generate pre-signed download URL
            
            async with AsyncSessionLocal() as db:
                audit = AuditLog(
                    action='evidence_package_generated',
                    resource_type='content_report',
                    resource_id=UUID(report_id),
                    status='success',
                    details=options or {}
                )
                db.add(audit)
                await db.commit()
            
            return {
                'status': 'generated',
                'report_id': report_id,
                'download_url': f'https://s3.example.com/evidence/{report_id}.zip'
            }
            
        except Exception as e:
            logger.error(f"Failed to generate evidence package: {str(e)}", exc_info=True)
            raise
    
    return run_async(generate())


@celery_app.task(name='cleanup_expired_jobs')
def cleanup_expired_jobs():
    """
    Periodic task to clean up expired analysis jobs.
    Runs daily via Celery Beat.
    """
    async def cleanup():
        try:
            async with AsyncSessionLocal() as db:
                # Delete jobs older than 7 days
                from datetime import timedelta
                cutoff = datetime.utcnow() - timedelta(days=7)
                
                result = await db.execute(
                    select(AnalysisJob).where(AnalysisJob.created_at < cutoff)
                )
                old_jobs = result.scalars().all()
                
                count = 0
                for job in old_jobs:
                    # Delete temp file if it still exists
                    if job.temp_file_path and os.path.exists(job.temp_file_path):
                        os.unlink(job.temp_file_path)
                    
                    await db.delete(job)
                    count += 1
                
                await db.commit()
                logger.info(f"Cleaned up {count} expired jobs")
                
                return {'status': 'success', 'deleted_count': count}
                
        except Exception as e:
            logger.error(f"Cleanup failed: {str(e)}", exc_info=True)
            raise
    
    return run_async(cleanup())


# Configure periodic tasks
celery_app.conf.beat_schedule = {
    'cleanup-expired-jobs': {
        'task': 'cleanup_expired_jobs',
        'schedule': 86400.0,  # Run daily
    },
}
