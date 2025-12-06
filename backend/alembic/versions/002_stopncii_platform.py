"""
Create StopNCII tables

Revision ID: 002_stopncii_platform
Revises: 001_initial_schema
Create Date: 2025-12-06 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

# revision identifiers
revision = '002_stopncii_platform'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    """
    Create all tables for StopNCII platform:
    - media_hashes: Perceptual hash storage
    - analysis_jobs: Async job tracking
    - content_reports: Report submissions
    - takedown_requests: Platform takedown tracking
    - hash_matches: Match records
    - audit_logs: Compliance logging (partitioned)
    """
    
    # Enable pgcrypto extension for encryption
    op.execute('CREATE EXTENSION IF NOT EXISTS pgcrypto')
    
    # Enable uuid-ossp for UUID generation
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    
    # Create media_hashes table
    op.create_table(
        'media_hashes',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('hash_value', sa.String(256), nullable=False, index=True),
        sa.Column('hash_type', sa.String(20), nullable=False, index=True),
        sa.Column('media_type', sa.String(20), nullable=False),
        sa.Column('file_size_bytes', sa.Integer(), nullable=True),
        sa.Column('duration_seconds', sa.Float(), nullable=True),
        sa.Column('resolution', sa.String(20), nullable=True),
        sa.Column('is_deepfake', sa.Boolean(), default=False, index=True),
        sa.Column('deepfake_confidence', sa.Float(), nullable=True),
        sa.Column('deepfake_model_version', sa.String(50), nullable=True),
        sa.Column('uploaded_by_user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('status', sa.String(20), default='active', nullable=False, index=True),
        sa.Column('match_count', sa.Integer(), default=0, nullable=False),
        sa.Column('report_count', sa.Integer(), default=0, nullable=False),
        sa.Column('takedown_count', sa.Integer(), default=0, nullable=False),
        sa.Column('victim_consent_obtained', sa.Boolean(), default=False, nullable=False),
        sa.Column('contains_minor', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('expires_at', sa.DateTime(), nullable=True)
    )
    
    # Create composite indexes for media_hashes
    op.create_index('idx_hash_value_type', 'media_hashes', ['hash_value', 'hash_type'])
    op.create_index('idx_status_deepfake', 'media_hashes', ['status', 'is_deepfake'])
    op.create_index('idx_created_at_desc', 'media_hashes', [sa.text('created_at DESC')])
    
    # Create analysis_jobs table
    op.create_table(
        'analysis_jobs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('media_hash_id', UUID(as_uuid=True), sa.ForeignKey('media_hashes.id'), nullable=True, index=True),
        sa.Column('status', sa.String(20), default='queued', nullable=False, index=True),
        sa.Column('progress', sa.Integer(), default=0, nullable=False),
        sa.Column('current_step', sa.String(100), nullable=True),
        sa.Column('original_filename', sa.String(255), nullable=True),
        sa.Column('file_size_bytes', sa.Integer(), nullable=True),
        sa.Column('media_type', sa.String(20), nullable=True),
        sa.Column('temp_file_path', sa.String(500), nullable=True),
        sa.Column('pdq_hash', sa.String(256), nullable=True),
        sa.Column('tmk_hash', sa.String(256), nullable=True),
        sa.Column('is_deepfake', sa.Boolean(), nullable=True),
        sa.Column('deepfake_confidence', sa.Float(), nullable=True),
        sa.Column('matches_found', sa.Boolean(), default=False, nullable=False),
        sa.Column('match_count', sa.Integer(), default=0, nullable=False),
        sa.Column('highest_similarity', sa.Float(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('context', sa.Text(), nullable=True),
        sa.Column('metadata', JSONB, nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), default=0, nullable=False),
        sa.Column('estimated_time_seconds', sa.Integer(), nullable=True),
        sa.Column('processing_time_ms', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True)
    )
    
    op.create_index('idx_user_status', 'analysis_jobs', ['user_id', 'status'])
    op.create_index('idx_job_created_at_desc', 'analysis_jobs', [sa.text('created_at DESC')])
    
    # Create content_reports table
    op.create_table(
        'content_reports',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('reporter_user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('reporter_email_encrypted', sa.String(500), nullable=True),
        sa.Column('media_hash_id', UUID(as_uuid=True), sa.ForeignKey('media_hashes.id'), nullable=False, index=True),
        sa.Column('report_type', sa.String(50), nullable=False, index=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('platform_names', ARRAY(sa.String), nullable=True),
        sa.Column('platform_urls', ARRAY(sa.String), nullable=True),
        sa.Column('evidence_urls', ARRAY(sa.String), nullable=True),
        sa.Column('evidence_data', JSONB, nullable=True),
        sa.Column('victim_name_encrypted', sa.String(500), nullable=True),
        sa.Column('victim_email_encrypted', sa.String(500), nullable=True),
        sa.Column('victim_consent_obtained', sa.Boolean(), default=False, nullable=False),
        sa.Column('is_victim_minor', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('priority', sa.String(20), default='medium', nullable=False, index=True),
        sa.Column('severity', sa.String(20), nullable=True),
        sa.Column('auto_priority_score', sa.Float(), nullable=True),
        sa.Column('status', sa.String(20), default='pending', nullable=False, index=True),
        sa.Column('assigned_to_user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True, index=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('review_notes', sa.Text(), nullable=True),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('takedown_initiated', sa.Boolean(), default=False, nullable=False),
        sa.Column('takedown_count', sa.Integer(), default=0, nullable=False),
        sa.Column('takedown_success_count', sa.Integer(), default=0, nullable=False),
        sa.Column('legal_support_requested', sa.Boolean(), default=False, nullable=False),
        sa.Column('legal_case_number', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.Column('estimated_review_time_hours', sa.Integer(), nullable=True)
    )
    
    op.create_index('idx_status_priority', 'content_reports', ['status', 'priority'])
    op.create_index('idx_reporter_created', 'content_reports', ['reporter_user_id', 'created_at'])
    op.create_index('idx_assigned_status', 'content_reports', ['assigned_to_user_id', 'status'])
    
    # Create takedown_requests table
    op.create_table(
        'takedown_requests',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('report_id', UUID(as_uuid=True), sa.ForeignKey('content_reports.id'), nullable=False, index=True),
        sa.Column('media_hash_id', UUID(as_uuid=True), sa.ForeignKey('media_hashes.id'), nullable=False, index=True),
        sa.Column('platform_name', sa.String(100), nullable=False, index=True),
        sa.Column('platform_content_id', sa.String(255), nullable=True),
        sa.Column('platform_content_url', sa.String(1000), nullable=True),
        sa.Column('request_type', sa.String(50), nullable=False),
        sa.Column('request_payload', JSONB, nullable=True),
        sa.Column('status', sa.String(20), default='pending', nullable=False, index=True),
        sa.Column('platform_response', JSONB, nullable=True),
        sa.Column('platform_ticket_id', sa.String(255), nullable=True),
        sa.Column('removal_confirmed', sa.Boolean(), default=False, nullable=False),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('acknowledged_at', sa.DateTime(), nullable=True),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.Column('retry_count', sa.Integer(), default=0, nullable=False),
        sa.Column('last_retry_at', sa.DateTime(), nullable=True)
    )
    
    op.create_index('idx_platform_status', 'takedown_requests', ['platform_name', 'status'])
    op.create_index('idx_report_created', 'takedown_requests', ['report_id', 'created_at'])
    
    # Create hash_matches table
    op.create_table(
        'hash_matches',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('original_hash_id', UUID(as_uuid=True), sa.ForeignKey('media_hashes.id'), nullable=True, index=True),
        sa.Column('matched_hash_id', UUID(as_uuid=True), sa.ForeignKey('media_hashes.id'), nullable=False, index=True),
        sa.Column('hamming_distance', sa.Integer(), nullable=False),
        sa.Column('similarity_score', sa.Float(), nullable=False),
        sa.Column('match_type', sa.String(20), nullable=False),
        sa.Column('detected_by_user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True, index=True),
        sa.Column('detection_context', sa.String(50), nullable=True),
        sa.Column('platform_name', sa.String(100), nullable=True),
        sa.Column('action_taken', sa.String(50), nullable=True),
        sa.Column('metadata', JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True)
    )
    
    op.create_index('idx_matched_created', 'hash_matches', ['matched_hash_id', 'created_at'])
    op.create_index('idx_similarity_score', 'hash_matches', [sa.text('similarity_score DESC')])
    
    # Create audit_logs table (will be manually partitioned by month)
    op.create_table(
        'audit_logs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('action', sa.String(100), nullable=False, index=True),
        sa.Column('resource_type', sa.String(50), nullable=False),
        sa.Column('resource_id', UUID(as_uuid=True), nullable=True, index=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True, index=True),
        sa.Column('user_email_encrypted', sa.String(500), nullable=True),
        sa.Column('user_role', sa.String(50), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('request_id', sa.String(100), nullable=True, index=True),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('details', JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True)
    )
    
    op.create_index('idx_action_created', 'audit_logs', ['action', 'created_at'])
    op.create_index('idx_user_action', 'audit_logs', ['user_id', 'action'])
    op.create_index('idx_resource', 'audit_logs', ['resource_type', 'resource_id'])


def downgrade():
    """Drop all StopNCII tables"""
    op.drop_table('audit_logs')
    op.drop_table('hash_matches')
    op.drop_table('takedown_requests')
    op.drop_table('content_reports')
    op.drop_table('analysis_jobs')
    op.drop_table('media_hashes')
