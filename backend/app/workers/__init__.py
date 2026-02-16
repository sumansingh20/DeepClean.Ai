"""Initialize workers module"""
from .tasks import (
    analyze_voice_task,
    analyze_video_task,
    analyze_document_task,
    analyze_scam_task,
    verify_liveness_task,
    calculate_risk_score_task,
    generate_report_task,
    escalate_incident_task,
    cleanup_expired_sessions,
    cleanup_old_incidents,
)

__all__ = [
    'analyze_voice_task',
    'analyze_video_task',
    'analyze_document_task',
    'analyze_scam_task',
    'verify_liveness_task',
    'calculate_risk_score_task',
    'generate_report_task',
    'escalate_incident_task',
    'cleanup_expired_sessions',
    'cleanup_old_incidents',
]
