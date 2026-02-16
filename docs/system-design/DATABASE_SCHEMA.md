# Database Schema - PostgreSQL 15+

## Overview

This schema supports privacy-preserving hash storage, re-upload detection, and takedown workflows without storing actual media files.

**Key Design Principles:**
- Store only perceptual hashes and metadata
- Support fast similarity searches using indexes
- Audit all operations for compliance
- Enable efficient re-upload detection

---

## Entity Relationship Diagram

```
users (1) ──────< (N) content_reports
  │                       │
  │                       │
  │                       └──< (N) takedown_requests
  │                                    │
  └────< (N) media_hashes (N) ────────┤
                │                      │
                │                      │
                └──< (N) hash_matches  │
                         │             │
                         └─────────────┘

audit_logs ──────────────────────────────── (references all tables)
```

---

## Table Definitions

### 1. users

Stores user accounts with authentication data.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'user',  -- user, moderator, admin
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,  -- flexible storage
    
    CONSTRAINT chk_role CHECK (role IN ('user', 'moderator', 'admin')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

**Example Row:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "victim@example.com",
    "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqNxL6E7Ru",
    "full_name": "Jane Doe",
    "role": "user",
    "is_active": true,
    "is_verified": true,
    "created_at": "2025-01-15T10:30:00Z",
    "metadata": {
        "timezone": "America/New_York",
        "notifications_enabled": true
    }
}
```

---

### 2. media_hashes

Stores perceptual hashes of images/videos without storing actual media.

```sql
CREATE TABLE media_hashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Hash data
    hash_type VARCHAR(20) NOT NULL,  -- pdq, tmk, pdqf
    hash_value VARCHAR(1024) NOT NULL,  -- hex-encoded hash
    hash_binary BIT(256),  -- for Hamming distance queries (PDQ only)
    
    -- Media metadata (NO actual media stored)
    media_type VARCHAR(20) NOT NULL,  -- image, video
    file_extension VARCHAR(10),  -- jpg, mp4, etc
    original_filename VARCHAR(255),  -- sanitized
    file_size_bytes BIGINT,
    duration_seconds FLOAT,  -- for videos
    resolution VARCHAR(20),  -- 1920x1080
    
    -- Detection results
    is_deepfake BOOLEAN DEFAULT FALSE,
    deepfake_confidence FLOAT,  -- 0.0 to 1.0
    detection_model VARCHAR(100),  -- e.g., "XceptionNet-v2"
    
    -- Embedding for semantic similarity
    embedding_vector FLOAT[] DEFAULT NULL,  -- 512-dim CLIP embedding
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',  -- active, reported, removed
    report_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT chk_hash_type CHECK (hash_type IN ('pdq', 'tmk', 'pdqf')),
    CONSTRAINT chk_media_type CHECK (media_type IN ('image', 'video')),
    CONSTRAINT chk_confidence CHECK (deepfake_confidence BETWEEN 0.0 AND 1.0)
);

-- Indexes
CREATE INDEX idx_media_hashes_user ON media_hashes(user_id);
CREATE INDEX idx_media_hashes_hash_value ON media_hashes USING hash(hash_value);
CREATE INDEX idx_media_hashes_status ON media_hashes(status);
CREATE INDEX idx_media_hashes_created ON media_hashes(created_at DESC);
CREATE INDEX idx_media_hashes_deepfake ON media_hashes(is_deepfake) WHERE is_deepfake = TRUE;

-- Specialized index for Hamming distance queries (PostgreSQL bit operations)
CREATE INDEX idx_media_hashes_hamming ON media_hashes USING gist(hash_binary);

-- GiST index for embedding similarity (requires pgvector extension)
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE media_hashes ALTER COLUMN embedding_vector TYPE vector(512);
CREATE INDEX idx_media_hashes_embedding ON media_hashes USING ivfflat(embedding_vector vector_cosine_ops);
```

**Example Row:**
```json
{
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "hash_type": "pdq",
    "hash_value": "f8f8f0cce0f4e84d0e370a22028f33c0fad6f8f8f0cce0f4e84d0e370a22028f",
    "hash_binary": "11111000111110001111000011001100...",
    "media_type": "image",
    "file_extension": "jpg",
    "original_filename": "photo_2025.jpg",
    "file_size_bytes": 2485760,
    "resolution": "1920x1080",
    "is_deepfake": true,
    "deepfake_confidence": 0.94,
    "detection_model": "Ensemble(XceptionNet+EfficientNet-B7+ViT)",
    "embedding_vector": [0.023, -0.145, 0.678, ...],
    "status": "reported",
    "report_count": 3,
    "created_at": "2025-02-10T14:23:11Z",
    "metadata": {
        "upload_ip": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "processing_time_ms": 4523
    }
}
```

---

### 3. hash_matches

Tracks when a new upload matches an existing hash (re-upload detection).

```sql
CREATE TABLE hash_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The new uploaded hash
    new_hash_id UUID REFERENCES media_hashes(id) ON DELETE CASCADE,
    
    -- The existing hash it matched
    matched_hash_id UUID REFERENCES media_hashes(id) ON DELETE CASCADE,
    
    -- Similarity metrics
    match_type VARCHAR(50) NOT NULL,  -- exact, near_match, semantic
    similarity_score FLOAT NOT NULL,  -- 0.0 to 1.0
    hamming_distance INTEGER,  -- for PDQ hashes
    
    -- Action taken
    action_taken VARCHAR(100),  -- flagged, blocked, allowed
    is_false_positive BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT chk_match_type CHECK (match_type IN ('exact', 'near_match', 'semantic')),
    CONSTRAINT chk_similarity CHECK (similarity_score BETWEEN 0.0 AND 1.0),
    CONSTRAINT chk_hamming CHECK (hamming_distance >= 0 AND hamming_distance <= 256)
);

-- Indexes
CREATE INDEX idx_hash_matches_new ON hash_matches(new_hash_id);
CREATE INDEX idx_hash_matches_matched ON hash_matches(matched_hash_id);
CREATE INDEX idx_hash_matches_created ON hash_matches(created_at DESC);
CREATE INDEX idx_hash_matches_type ON hash_matches(match_type);
```

**Example Row:**
```json
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "new_hash_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "matched_hash_id": "8d0f7780-8536-51ef-055c-f18cd2e01bf8",
    "match_type": "near_match",
    "similarity_score": 0.89,
    "hamming_distance": 18,
    "action_taken": "flagged",
    "is_false_positive": false,
    "created_at": "2025-02-10T14:23:15Z",
    "metadata": {
        "detection_method": "pdq_hamming",
        "threshold_used": 31,
        "modifications_detected": ["crop", "jpeg_compression"]
    }
}
```

---

### 4. content_reports

User-submitted reports for NCII/deepfake content.

```sql
CREATE TABLE content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    media_hash_id UUID REFERENCES media_hashes(id) ON DELETE CASCADE,
    
    -- Report details
    report_type VARCHAR(50) NOT NULL,  -- ncii, deepfake, harassment
    description TEXT,
    evidence_urls TEXT[],  -- URLs where content appears
    platform_names VARCHAR(100)[],  -- YouTube, Twitter, etc.
    
    -- Victim information (optional, encrypted)
    victim_name VARCHAR(255),
    victim_consent_obtained BOOLEAN DEFAULT FALSE,
    victim_contact_info TEXT,  -- encrypted
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',  -- pending, under_review, approved, rejected
    priority VARCHAR(20) DEFAULT 'medium',  -- low, medium, high, urgent
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT chk_report_type CHECK (report_type IN ('ncii', 'deepfake', 'harassment', 'other')),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'closed')),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Indexes
CREATE INDEX idx_reports_reporter ON content_reports(reporter_user_id);
CREATE INDEX idx_reports_hash ON content_reports(media_hash_id);
CREATE INDEX idx_reports_status ON content_reports(status);
CREATE INDEX idx_reports_priority ON content_reports(priority);
CREATE INDEX idx_reports_created ON content_reports(created_at DESC);

-- Full-text search index
ALTER TABLE content_reports ADD COLUMN search_vector tsvector;
CREATE INDEX idx_reports_search ON content_reports USING gin(search_vector);

CREATE TRIGGER tsvector_update_reports BEFORE INSERT OR UPDATE
ON content_reports FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', description, review_notes);
```

**Example Row:**
```json
{
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "reporter_user_id": "550e8400-e29b-41d4-a716-446655440000",
    "media_hash_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "report_type": "ncii",
    "description": "Non-consensual intimate images posted without permission",
    "evidence_urls": [
        "https://twitter.com/abuser/status/123456789",
        "https://imgur.com/abc123"
    ],
    "platform_names": ["Twitter", "Imgur"],
    "victim_consent_obtained": true,
    "status": "under_review",
    "priority": "high",
    "created_at": "2025-02-10T15:00:00Z",
    "metadata": {
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "attachments": ["evidence_doc_encrypted.pdf"]
    }
}
```

---

### 5. takedown_requests

Tracks takedown requests sent to platforms.

```sql
CREATE TABLE takedown_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES content_reports(id) ON DELETE CASCADE,
    media_hash_id UUID REFERENCES media_hashes(id) ON DELETE CASCADE,
    
    -- Target platform
    platform_name VARCHAR(100) NOT NULL,  -- YouTube, Twitter, etc.
    platform_url TEXT NOT NULL,
    platform_content_id VARCHAR(255),  -- video ID, tweet ID, etc.
    
    -- Request details
    request_type VARCHAR(50) DEFAULT 'dmca',  -- dmca, ncii, tos_violation
    request_payload JSONB,  -- API request data
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',  -- pending, sent, acknowledged, completed, failed
    sent_at TIMESTAMP,
    acknowledged_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Response from platform
    platform_response JSONB,
    platform_ticket_id VARCHAR(255),
    
    -- Evidence package
    evidence_package_url TEXT,  -- S3 URL (encrypted)
    evidence_generated_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT chk_request_type CHECK (request_type IN ('dmca', 'ncii', 'tos_violation', 'court_order')),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'sent', 'acknowledged', 'completed', 'failed', 'rejected'))
);

-- Indexes
CREATE INDEX idx_takedown_report ON takedown_requests(report_id);
CREATE INDEX idx_takedown_hash ON takedown_requests(media_hash_id);
CREATE INDEX idx_takedown_platform ON takedown_requests(platform_name);
CREATE INDEX idx_takedown_status ON takedown_requests(status);
CREATE INDEX idx_takedown_created ON takedown_requests(created_at DESC);
```

**Example Row:**
```json
{
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "media_hash_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "platform_name": "Twitter",
    "platform_url": "https://twitter.com/abuser/status/123456789",
    "platform_content_id": "123456789",
    "request_type": "ncii",
    "status": "completed",
    "sent_at": "2025-02-11T10:00:00Z",
    "acknowledged_at": "2025-02-11T10:15:00Z",
    "completed_at": "2025-02-11T14:30:00Z",
    "platform_response": {
        "ticket_id": "TWITTER-NCII-789012",
        "action_taken": "content_removed",
        "account_suspended": false
    },
    "evidence_package_url": "s3://evidence-bucket/c3d4e5f6-a7b8-9012.zip",
    "evidence_generated_at": "2025-02-11T09:45:00Z",
    "metadata": {
        "api_version": "v2",
        "retry_count": 0
    }
}
```

---

### 6. audit_logs

Comprehensive audit trail for compliance.

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- Who
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    
    -- What
    action VARCHAR(100) NOT NULL,  -- user_login, hash_generated, report_submitted, etc.
    resource_type VARCHAR(50),  -- user, media_hash, report, takedown
    resource_id UUID,
    
    -- When & Where
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    
    -- Additional context
    request_method VARCHAR(10),  -- GET, POST, etc.
    request_path TEXT,
    response_status INTEGER,
    
    -- Details
    changes JSONB,  -- before/after for updates
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Partitioning key
    created_date DATE DEFAULT CURRENT_DATE
) PARTITION BY RANGE (created_date);

-- Create partitions (automate with pg_partman or cron job)
CREATE TABLE audit_logs_2025_02 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE audit_logs_2025_03 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Indexes (on partitions)
CREATE INDEX idx_audit_user ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action, timestamp DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
```

**Example Row:**
```json
{
    "id": 123456,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_email": "victim@example.com",
    "user_role": "user",
    "action": "report_submitted",
    "resource_type": "content_report",
    "resource_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "timestamp": "2025-02-10T15:00:00Z",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "request_method": "POST",
    "request_path": "/api/v1/reports/submit",
    "response_status": 201,
    "changes": {
        "report_created": {
            "report_type": "ncii",
            "priority": "high"
        }
    }
}
```

---

## Queries for Re-upload Detection

### Find Near-Duplicate Hashes (Hamming Distance)

```sql
-- Find all hashes within Hamming distance of 31 from a given hash
WITH target AS (
    SELECT hash_binary FROM media_hashes WHERE id = :target_hash_id
)
SELECT 
    mh.id,
    mh.hash_value,
    mh.user_id,
    mh.created_at,
    BIT_COUNT(mh.hash_binary # target.hash_binary) as hamming_distance
FROM media_hashes mh, target
WHERE 
    mh.hash_type = 'pdq'
    AND mh.status = 'active'
    AND BIT_COUNT(mh.hash_binary # target.hash_binary) <= 31
    AND mh.id != :target_hash_id
ORDER BY hamming_distance ASC
LIMIT 100;
```

### Find Semantically Similar Content (Embedding Cosine Similarity)

```sql
-- Requires pgvector extension
SELECT 
    id,
    hash_value,
    user_id,
    created_at,
    1 - (embedding_vector <=> :query_embedding::vector) as cosine_similarity
FROM media_hashes
WHERE 
    embedding_vector IS NOT NULL
    AND status = 'active'
    AND 1 - (embedding_vector <=> :query_embedding::vector) >= 0.75
ORDER BY embedding_vector <=> :query_embedding::vector
LIMIT 50;
```

### Check if Hash Exists (Exact Match)

```sql
SELECT 
    id,
    user_id,
    created_at,
    is_deepfake,
    report_count
FROM media_hashes
WHERE 
    hash_value = :hash_value
    AND hash_type = :hash_type
    AND status = 'active'
LIMIT 1;
```

---

## Migrations

### Initial Schema (Alembic)

```python
# alembic/versions/001_initial_schema.py
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Enable extensions
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255)),
        sa.Column('role', sa.String(50), nullable=False, server_default='user'),
        sa.Column('is_active', sa.Boolean, server_default='true'),
        sa.Column('is_verified', sa.Boolean, server_default='false'),
        sa.Column('email_verified_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('last_login_at', sa.DateTime(timezone=True)),
        sa.Column('metadata', postgresql.JSONB, server_default='{}'),
    )
    
    # Add more tables following same pattern...
    # (media_hashes, hash_matches, content_reports, takedown_requests, audit_logs)

def downgrade():
    op.drop_table('audit_logs')
    op.drop_table('takedown_requests')
    op.drop_table('content_reports')
    op.drop_table('hash_matches')
    op.drop_table('media_hashes')
    op.drop_table('users')
```

---

## Performance Optimization

### 1. Partitioning Strategy

- **audit_logs**: Partition by month (range partitioning)
- **media_hashes**: Consider partitioning by created_at for large datasets (>10M rows)

### 2. Indexing Strategy

- **B-tree indexes**: For exact matches and range queries
- **GiST indexes**: For Hamming distance queries on bit strings
- **IVFFlat indexes**: For vector similarity (pgvector)
- **GIN indexes**: For full-text search and JSONB queries

### 3. Caching

- Cache frequent hash lookups in Redis (TTL: 1 hour)
- Cache user sessions in Redis (TTL: 24 hours)
- Materialize views for reporting dashboards

### 4. Connection Pooling

```python
# SQLAlchemy configuration
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
    pool_recycle=3600,
)
```

---

## Backup & Recovery

### Backup Strategy

```bash
# Daily full backup
pg_dump -Fc deepfake_db > backup_$(date +%Y%m%d).dump

# Continuous WAL archiving for point-in-time recovery
archive_mode = on
archive_command = 'aws s3 cp %p s3://backups/wal/%f'

# Retention: 30 days
```

### Recovery

```bash
# Restore from backup
pg_restore -d deepfake_db -v backup_20250210.dump

# Point-in-time recovery
pg_basebackup -D /var/lib/postgresql/data -Ft -z -P
# Then apply WAL files up to desired timestamp
```

---

## Compliance & Data Retention

### GDPR Right to Erasure

```sql
-- Delete all user data (cascades to related records)
DELETE FROM users WHERE id = :user_id;

-- Anonymize instead of delete (for audit trail)
UPDATE users SET
    email = CONCAT('deleted_', id, '@anonymized.local'),
    password_hash = '',
    full_name = 'Deleted User',
    metadata = '{}'::jsonb
WHERE id = :user_id;
```

### Data Retention Policy

- **audit_logs**: 90 days, then archive to S3
- **media_hashes**: Indefinite (unless user requests deletion)
- **content_reports**: 1 year after closure
- **takedown_requests**: 3 years for legal compliance

---

## Security Considerations

### Row-Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE media_hashes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own hashes
CREATE POLICY user_hashes ON media_hashes
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Policy: Admins can see all
CREATE POLICY admin_all ON media_hashes
    FOR ALL
    USING (current_setting('app.current_user_role') = 'admin');
```

### Encryption at Rest

```sql
-- Encrypt sensitive columns using pgcrypto
CREATE EXTENSION pgcrypto;

-- Store encrypted victim contact info
UPDATE content_reports SET
    victim_contact_info = pgp_sym_encrypt(
        'sensitive_data',
        current_setting('app.encryption_key')
    );

-- Decrypt when needed
SELECT pgp_sym_decrypt(
    victim_contact_info::bytea,
    current_setting('app.encryption_key')
) FROM content_reports;
```

---

## Summary

This schema provides:

- **Privacy**: No media storage, only hashes and metadata
- **Performance**: Optimized indexes for fast similarity searches
- **Scalability**: Partitioning and connection pooling
- **Compliance**: Audit logs, RLS, encryption
- **Re-upload Detection**: Hamming distance + vector similarity

Next: Review API specifications and implementation code.
