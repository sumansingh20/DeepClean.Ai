"""Initial schema creation for A-DFP Firewall

This migration creates the initial database schema with all tables needed for:
- User authentication and management
- Session tracking and analysis
- ML model metadata
- Incident tracking
- Webhook management
- Audit logging
- Risk policies

Revision ID: 001_initial_schema
Revises: 
Create Date: 2024-01-16 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial schema"""
    
    # Create ENUM types
    op.execute("CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'client', 'viewer')")
    op.execute("CREATE TYPE session_status AS ENUM ('created', 'processing', 'completed', 'failed', 'cancelled')")
    op.execute("CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical')")
    op.execute("CREATE TYPE incident_status AS ENUM ('open', 'assigned', 'investigating', 'resolved', 'closed')")
    op.execute("CREATE TYPE risk_category AS ENUM ('low', 'medium', 'high', 'critical')")
    
    # Create user table
    op.create_table(
        'user',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('organization', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('role', postgresql.ENUM('admin', 'analyst', 'client', 'viewer', name='user_role'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('email_verified', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_user_email', 'user', ['email'])
    op.create_index('ix_user_organization', 'user', ['organization'])
    
    # Create session table
    op.create_table(
        'session',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('analysis_type', sa.String(50), nullable=False),
        sa.Column('status', postgresql.ENUM('created', 'processing', 'completed', 'failed', 'cancelled', name='session_status'), nullable=False),
        sa.Column('metadata', postgresql.JSON(), nullable=True),
        sa.Column('results', postgresql.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_session_user_id', 'session', ['user_id'])
    op.create_index('ix_session_created_at', 'session', ['created_at'])
    op.create_index('ix_session_status', 'session', ['status'])
    
    # Create component_analysis table
    op.create_table(
        'component_analysis',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('component_type', sa.String(50), nullable=False),
        sa.Column('score', sa.Float(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('result', postgresql.JSON(), nullable=False),
        sa.Column('processing_time_ms', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['session_id'], ['session.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_component_analysis_session_id', 'component_analysis', ['session_id'])
    op.create_index('ix_component_analysis_component_type', 'component_analysis', ['component_type'])
    
    # Create incident table
    op.create_table(
        'incident',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('severity', postgresql.ENUM('low', 'medium', 'high', 'critical', name='incident_severity'), nullable=False),
        sa.Column('status', postgresql.ENUM('open', 'assigned', 'investigating', 'resolved', 'closed', name='incident_status'), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('tags', postgresql.JSON(), nullable=True),
        sa.Column('assigned_to', sa.String(255), nullable=True),
        sa.Column('resolution_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['session_id'], ['session.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_incident_user_id', 'incident', ['user_id'])
    op.create_index('ix_incident_severity', 'incident', ['severity'])
    op.create_index('ix_incident_status', 'incident', ['status'])
    
    # Create webhook table
    op.create_table(
        'webhook',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('url', sa.String(500), nullable=False),
        sa.Column('events', postgresql.JSON(), nullable=False),
        sa.Column('secret', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('retry_count', sa.Integer(), nullable=False, default=3),
        sa.Column('timeout_seconds', sa.Integer(), nullable=False, default=30),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('last_triggered', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_webhook_user_id', 'webhook', ['user_id'])
    
    # Create audit_log table
    op.create_table(
        'audit_log',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(100), nullable=False),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('details', postgresql.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_audit_log_user_id', 'audit_log', ['user_id'])
    op.create_index('ix_audit_log_action', 'audit_log', ['action'])
    op.create_index('ix_audit_log_created_at', 'audit_log', ['created_at'])
    
    # Create model_metadata table
    op.create_table(
        'model_metadata',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('model_type', sa.String(50), nullable=False),
        sa.Column('version', sa.String(20), nullable=False),
        sa.Column('accuracy', sa.Float(), nullable=True),
        sa.Column('precision', sa.Float(), nullable=True),
        sa.Column('recall', sa.Float(), nullable=True),
        sa.Column('f1_score', sa.Float(), nullable=True),
        sa.Column('inference_time_ms', sa.Float(), nullable=True),
        sa.Column('metadata', postgresql.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_model_metadata_name', 'model_metadata', ['name'])
    
    # Create risk_policy table
    op.create_table(
        'risk_policy',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('voice_threshold', sa.Float(), nullable=False, default=0.65),
        sa.Column('video_threshold', sa.Float(), nullable=False, default=0.60),
        sa.Column('document_threshold', sa.Float(), nullable=False, default=0.70),
        sa.Column('scam_threshold', sa.Float(), nullable=False, default=0.55),
        sa.Column('liveness_threshold', sa.Float(), nullable=False, default=0.80),
        sa.Column('escalation_threshold', sa.Float(), nullable=False, default=0.80),
        sa.Column('block_threshold', sa.Float(), nullable=False, default=0.90),
        sa.Column('is_default', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_risk_policy_user_id', 'risk_policy', ['user_id'])


def downgrade() -> None:
    """Drop initial schema"""
    
    # Drop tables in reverse order
    op.drop_table('risk_policy')
    op.drop_table('model_metadata')
    op.drop_table('audit_log')
    op.drop_table('webhook')
    op.drop_table('incident')
    op.drop_table('component_analysis')
    op.drop_table('session')
    op.drop_table('user')
    
    # Drop ENUM types
    op.execute("DROP TYPE risk_category")
    op.execute("DROP TYPE incident_status")
    op.execute("DROP TYPE incident_severity")
    op.execute("DROP TYPE session_status")
    op.execute("DROP TYPE user_role")
