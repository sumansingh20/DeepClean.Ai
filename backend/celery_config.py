"""Celery configuration for A-DFP Firewall"""

from datetime import timedelta
from kombu import Queue, Exchange

# Broker and result backend settings
broker_url = "redis://localhost:6379/1"
result_backend = "redis://localhost:6379/2"

# Task serialization
task_serializer = "json"
accept_content = ["json"]
result_serializer = "json"
timezone = "UTC"
enable_utc = True

# Task configuration
task_track_started = True
task_time_limit = 30 * 60  # 30 minutes hard limit
task_soft_time_limit = 25 * 60  # 25 minutes soft limit
task_acks_late = True  # Acknowledge after task completes

# Retry configuration
task_max_retries = 3
task_default_retry_delay = 60  # 1 minute between retries

# Worker configuration
worker_prefetch_multiplier = 1  # Fetch only 1 task at a time for GPU workers
worker_max_tasks_per_child = 100  # Restart worker after 100 tasks to prevent memory leaks
worker_disable_rate_limits = False

# Result backend options
result_expires = 3600  # Results expire after 1 hour
result_backend_transport_options = {
    "retry_on_timeout": True,
    "max_connections": 10,
}

# Task routing - define task queues
task_queues = (
    # Video deepfake detection - GPU intensive
    Queue(
        'video',
        Exchange('video', type='direct'),
        routing_key='video',
        priority=3,
    ),
    # Voice deepfake detection - CPU intensive but GPU-accelerable
    Queue(
        'voice',
        Exchange('voice', type='direct'),
        routing_key='voice',
        priority=2,
    ),
    # Document analysis - Fast
    Queue(
        'document',
        Exchange('document', type='direct'),
        routing_key='document',
        priority=4,
    ),
    # Scam analysis - Medium
    Queue(
        'scam',
        Exchange('scam', type='direct'),
        routing_key='scam',
        priority=2,
    ),
    # Liveness verification - GPU-assisted
    Queue(
        'liveness',
        Exchange('liveness', type='direct'),
        routing_key='liveness',
        priority=3,
    ),
    # Risk scoring & reports - Fast
    Queue(
        'default',
        Exchange('default', type='direct'),
        routing_key='default',
        priority=5,
    ),
)

# Task routing configuration
task_routes = {
    'app.workers.tasks.analyze_voice_task': {'queue': 'voice', 'routing_key': 'voice'},
    'app.workers.tasks.analyze_video_task': {'queue': 'video', 'routing_key': 'video'},
    'app.workers.tasks.analyze_document_task': {'queue': 'document', 'routing_key': 'document'},
    'app.workers.tasks.analyze_scam_task': {'queue': 'scam', 'routing_key': 'scam'},
    'app.workers.tasks.verify_liveness_task': {'queue': 'liveness', 'routing_key': 'liveness'},
    'app.workers.tasks.calculate_risk_score_task': {'queue': 'default', 'routing_key': 'default'},
    'app.workers.tasks.generate_report_task': {'queue': 'default', 'routing_key': 'default'},
    'app.workers.tasks.escalate_incident_task': {'queue': 'default', 'routing_key': 'default'},
    'app.workers.tasks.cleanup_expired_sessions': {'queue': 'default', 'routing_key': 'default'},
    'app.workers.tasks.cleanup_old_incidents': {'queue': 'default', 'routing_key': 'default'},
}

# Scheduled tasks (Celery Beat)
beat_schedule = {
    # Daily cleanup at 2 AM UTC
    'cleanup-sessions': {
        'task': 'app.workers.tasks.cleanup_expired_sessions',
        'schedule': timedelta(hours=24),
        'options': {'queue': 'default'},
    },
    # Daily incident cleanup at 3 AM UTC
    'cleanup-incidents': {
        'task': 'app.workers.tasks.cleanup_old_incidents',
        'schedule': timedelta(hours=24),
        'options': {'queue': 'default'},
    },
}

# Event settings
worker_send_task_events = True
task_send_sent_event = True

# Import settings from environment
import os
from dotenv import load_dotenv

load_dotenv()

# Override with environment variables if present
if os.getenv('CELERY_BROKER_URL'):
    broker_url = os.getenv('CELERY_BROKER_URL')

if os.getenv('CELERY_RESULT_BACKEND'):
    result_backend = os.getenv('CELERY_RESULT_BACKEND')

if os.getenv('CELERY_WORKER_CONCURRENCY'):
    # Note: This should be set per-worker, not globally
    pass

# Export configuration
__all__ = [
    'broker_url',
    'result_backend',
    'task_serializer',
    'accept_content',
    'result_serializer',
    'timezone',
    'enable_utc',
    'task_track_started',
    'task_time_limit',
    'task_soft_time_limit',
    'task_acks_late',
    'task_max_retries',
    'task_default_retry_delay',
    'worker_prefetch_multiplier',
    'worker_max_tasks_per_child',
    'result_expires',
    'result_backend_transport_options',
    'task_queues',
    'task_routes',
    'beat_schedule',
    'worker_send_task_events',
    'task_send_sent_event',
]
