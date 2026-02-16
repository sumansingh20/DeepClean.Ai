# StopNCII-Style Platform - Complete System Architecture

## Executive Summary

This platform detects deepfakes and non-consensual intimate images (NCII), generates privacy-preserving perceptual hashes, and prevents re-uploads of identical or modified content across platforms—similar to Meta's ThreatExchange and StopNCII.org.

**Core Principles:**
- **No Media Storage**: Only perceptual hashes and metadata are stored
- **Privacy-First**: Content never leaves ephemeral processing pipeline
- **Re-upload Prevention**: Detects modified content (crops, filters, re-encoding)
- **Real-world Tech**: Uses Meta PDQ/TMK, PyTorch, PostgreSQL, Redis

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Web App      │  │ Mobile App   │  │ Platform API │          │
│  │ (Next.js)    │  │ (React Native│  │ Integration  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │ HTTPS/TLS
          ┌──────────────────┴──────────────────┐
          │                                      │
┌─────────▼──────────────────────────────────────▼─────────────────┐
│                    API GATEWAY / LOAD BALANCER                    │
│                   (NGINX + Let's Encrypt)                         │
└─────────┬───────────────────────────────────────┬─────────────────┘
          │                                       │
          │                                       │
┌─────────▼─────────────────┐        ┌───────────▼──────────────────┐
│   BACKEND API LAYER       │        │   WORKER/ASYNC LAYER          │
│   (FastAPI/Uvicorn)       │        │   (Celery + Redis Queue)     │
│                           │        │                               │
│ • Authentication          │◄──────►│ • Deepfake Detection         │
│ • Rate Limiting           │        │ • Hash Generation            │
│ • Upload Management       │        │ • Similarity Matching        │
│ • Report Management       │        │ • Evidence Generation        │
│ • Takedown Workflow       │        │                               │
└─────────┬─────────────────┘        └───────────┬──────────────────┘
          │                                      │
          │          ┌───────────────────────────┼───────────────┐
          │          │                           │               │
┌─────────▼──────────▼─────┐    ┌───────────────▼────┐  ┌───────▼────────┐
│   DATABASE LAYER          │    │  ML SERVICE        │  │  HASH SERVICE  │
│   (PostgreSQL 15+)        │    │  (PyTorch)         │  │  (PDQ/TMK)     │
│                           │    │                    │  │                │
│ • users                   │    │ • XceptionNet      │  │ • PDQ (Image)  │
│ • media_hashes            │    │ • EfficientNet-B7  │  │ • TMK (Video)  │
│ • content_reports         │    │ • ViT-Base         │  │ • PDQF (Video) │
│ • takedown_requests       │    │ • CLIP Embeddings  │  │                │
│ • hash_matches            │    │                    │  │                │
│ • audit_logs              │    └────────────────────┘  └────────────────┘
└───────────────────────────┘
          │
┌─────────▼─────────────────┐    ┌──────────────────────────────────────┐
│   CACHE LAYER             │    │   EXTERNAL SERVICES                  │
│   (Redis)                 │    │                                      │
│                           │    │ • Meta ThreatExchange API            │
│ • Session Store           │    │ • Platform Takedown APIs             │
│ • Rate Limit Counters     │    │   (YouTube, Twitter, Facebook)       │
│ • Hash Lookup Cache       │    │ • Email Service (SendGrid)           │
│ • Job Queue               │    │ • S3 (Evidence Storage - Encrypted)  │
└───────────────────────────┘    └──────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    MONITORING & LOGGING                           │
│  Prometheus + Grafana + ELK Stack + Sentry                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Frontend (Next.js 14+ with TypeScript)
**Technology Stack:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Axios for API calls
- WebSocket for real-time progress

**Key Features:**
- Secure file upload with chunking
- Real-time detection progress
- Report submission and tracking
- Evidence generation and download
- Admin dashboard for takedown management

### 2. Backend API (FastAPI)
**Technology Stack:**
- FastAPI 0.104+
- Pydantic v2 for validation
- SQLAlchemy 2.0 (async)
- Alembic for migrations
- python-jose for JWT
- bcrypt for password hashing

**Key Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/upload/analyze        # Upload and analyze content
GET    /api/v1/analysis/{job_id}     # Get analysis status
POST   /api/v1/reports/submit        # Submit takedown report
GET    /api/v1/reports/{report_id}   # Get report status
POST   /api/v1/match/check           # Check if hash exists
GET    /api/v1/evidence/{report_id}  # Generate evidence package
```

### 3. ML Service (PyTorch)
**Models Used:**
1. **XceptionNet** (primary deepfake detector)
   - Pre-trained on FaceForensics++
   - 299x299 input resolution
   - Binary classification (real/fake)

2. **EfficientNet-B7** (secondary detector)
   - Transfer learning from ImageNet
   - Multi-frame analysis for videos
   - Confidence scoring

3. **Vision Transformer (ViT-Base)** (tertiary detector)
   - Attention-based detection
   - Better at detecting GAN artifacts

4. **CLIP Embeddings** (similarity matching)
   - Generate 512-dim embeddings
   - Used for semantic similarity

**Ensemble Logic:**
- Weighted voting (XceptionNet: 0.5, EfficientNet: 0.3, ViT: 0.2)
- Threshold: 0.65 for deepfake classification

### 4. Hashing Service (PDQ/TMK)
**Technology Stack:**
- `pdqhash` (Meta's PDQ implementation)
- `tmk` (Temporal Multi-frame K-means hashing)
- OpenCV for video processing
- PIL for image processing

**Hash Types:**
1. **PDQ (Image)**: 256-bit perceptual hash
   - Robust to crops, filters, compression
   - Hamming distance for matching
   - Threshold: ≤ 31 bits different = match

2. **TMK + PDQF (Video)**: Multi-frame temporal hash
   - Extract keyframes (1 per second)
   - Generate PDQ for each frame
   - Temporal K-means clustering
   - Threshold: ≥ 0.75 similarity = match

### 5. Database (PostgreSQL 15+)
**Key Features:**
- JSONB for flexible metadata
- Full-text search (tsvector)
- Partitioning for large tables
- Row-level security (RLS)
- pgcrypto for encryption

### 6. Cache & Queue (Redis)
**Uses:**
- Session management (TTL: 24 hours)
- Rate limiting (sliding window)
- Celery task queue
- Hash lookup cache (TTL: 1 hour)

---

## Data Flow

### Upload & Analysis Workflow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /upload/analyze (multipart/form-data)
     │    + media file (video/image)
     │    + metadata (optional)
     ▼
┌────────────────────┐
│  FastAPI Backend   │
│                    │
│ 2. Validate file   │────► Reject if invalid/too large
│    (size, type)    │
│                    │
│ 3. Generate UUID   │
│    Create job      │
│                    │
│ 4. Save to /tmp    │────► Ephemeral storage only
│    (encrypted)     │
│                    │
│ 5. Queue job       │
└────┬───────────────┘
     │
     │ 6. Return job_id
     ▼
┌──────────┐
│  Client  │──┐
└──────────┘  │ 7. Poll /analysis/{job_id}
              │    or WebSocket for updates
              │
     ┌────────┴─────────┐
     │  Celery Worker   │
     │                  │
     │ 8. Fetch job     │
     │                  │
     │ 9. Load media    │
     │    from /tmp     │
     │                  │
     ├──────────────────┤
     │  ML Pipeline     │
     │                  │
     │ 10. Extract      │
     │     frames       │
     │                  │
     │ 11. Preprocess   │
     │     (resize,     │
     │      normalize)  │
     │                  │
     │ 12. Run models   │────► XceptionNet
     │     (ensemble)   │────► EfficientNet
     │                  │────► ViT
     │                  │
     │ 13. Aggregate    │
     │     scores       │
     ├──────────────────┤
     │  Hash Pipeline   │
     │                  │
     │ 14. Generate PDQ │────► Image: 1 hash
     │     or TMK       │────► Video: N hashes
     │                  │
     │ 15. Check for    │
     │     matches      │────► Query DB (Hamming < 31)
     │                  │────► Query embeddings
     │                  │
     │ 16. Store hash   │
     │     + metadata   │
     ├──────────────────┤
     │                  │
     │ 17. Delete /tmp  │────► Secure deletion
     │     file         │
     │                  │
     │ 18. Update job   │
     │     status       │
     └────┬─────────────┘
          │
          │ 19. Client receives result
          ▼
     ┌──────────┐
     │  Client  │
     └──────────┘
```

### Re-upload Detection Workflow

```
New Upload
    │
    ├─► Generate PDQ/TMK hash
    │
    ├─► Query database for similar hashes
    │   │
    │   ├─► Exact match (Hamming = 0)
    │   │   └─► Flag as re-upload (100% confidence)
    │   │
    │   ├─► Near match (Hamming ≤ 31)
    │   │   └─► Calculate similarity score
    │   │       │
    │   │       ├─► Hamming ≤ 15: 95-100% similar
    │   │       ├─► Hamming 16-23: 85-94% similar
    │   │       └─► Hamming 24-31: 75-84% similar
    │   │
    │   └─► No match (Hamming > 31)
    │       └─► Generate CLIP embedding
    │           └─► Cosine similarity with existing embeddings
    │               │
    │               ├─► Similarity ≥ 0.90: Likely modified
    │               ├─► Similarity 0.75-0.89: Possibly modified
    │               └─► Similarity < 0.75: Unique content
    │
    └─► Store new hash + embedding
```

---

## Security & Privacy Model

### 1. No Media Storage
- **Ephemeral Processing**: Files stored in `/tmp` during processing only
- **Immediate Deletion**: Secure deletion after hash generation
- **No Backups**: Media never backed up or archived
- **Evidence Storage**: Only encrypted metadata + hashes (no raw media)

### 2. Authentication & Authorization
- **JWT Tokens**: HS256 signing, 24-hour expiry
- **Bcrypt**: Password hashing with salt rounds = 12
- **Role-Based Access Control (RBAC)**:
  - `user`: Upload and report
  - `moderator`: Review reports
  - `admin`: Platform management

### 3. Data Encryption
- **At Rest**: PostgreSQL pgcrypto for sensitive fields
- **In Transit**: TLS 1.3 only
- **Hash Anonymization**: HMAC-SHA256 before external sharing

### 4. Privacy Compliance
- **GDPR**: Right to deletion, data portability
- **COPPA**: Age verification required
- **California CCPA**: Opt-out mechanisms
- **NCII-Specific**: Victim consent required for takedown requests

### 5. Rate Limiting
- **Per User**: 10 uploads/hour, 100/day
- **Per IP**: 50 requests/minute
- **Global**: Circuit breaker at 10K requests/second

### 6. Audit Logging
- All API calls logged with user ID, IP, timestamp
- Hash generation and match queries logged
- Takedown actions logged with evidence
- 90-day retention, then archived

---

## Deployment Architecture

### Production Setup
```yaml
Infrastructure:
  - Cloud: AWS or GCP
  - Regions: Multi-region (US, EU)
  - CDN: CloudFlare for static assets
  
Containers:
  - Backend: 3+ replicas (auto-scaling)
  - Workers: 5+ replicas (CPU-optimized)
  - ML Service: 2+ replicas (GPU instances: NVIDIA T4)
  
Databases:
  - PostgreSQL: Primary + 2 read replicas
  - Redis: Cluster mode (3 masters, 3 replicas)
  
Storage:
  - Evidence: S3 with encryption at rest
  - Logs: CloudWatch or ELK
  
Monitoring:
  - Uptime: Better Uptime
  - APM: Sentry
  - Metrics: Prometheus + Grafana
  - Logs: ELK Stack
```

### CI/CD Pipeline
```
GitHub → GitHub Actions → Docker Build → ECR → ECS/EKS → Production
         │
         ├─► Run tests (pytest, jest)
         ├─► Security scan (Snyk, Trivy)
         ├─► Build Docker images
         └─► Deploy to staging → Smoke tests → Deploy to prod
```

---

## Limitations & Mitigations

### Limitation 1: Advanced Modifications
**Problem**: Extreme transformations (heavy color grading, aspect ratio changes, AI upscaling) can bypass perceptual hashes.

**Mitigation**:
- Use CLIP embeddings for semantic similarity
- Multi-scale hash generation (PDQ at multiple resolutions)
- Temporal consistency checks for videos
- Human-in-the-loop review for edge cases

### Limitation 2: Scale & Performance
**Problem**: Matching against millions of hashes is computationally expensive.

**Mitigation**:
- Use locality-sensitive hashing (LSH) for approximate nearest neighbor search
- Redis caching for frequent lookups
- Partitioned databases by hash prefix
- Batch processing for non-urgent matches

### Limitation 3: False Positives
**Problem**: Similar but unrelated content may match (e.g., stock photos, memes).

**Mitigation**:
- Require minimum confidence threshold (≥ 0.85)
- Manual review before takedown
- User appeal process
- Whitelist for known false positives

### Limitation 4: Deepfake Evolution
**Problem**: New deepfake techniques (e.g., diffusion models, live deepfakes) bypass current detectors.

**Mitigation**:
- Continuous model retraining with new datasets
- Ensemble of multiple detection methods
- Collaboration with research community
- Regular model updates (monthly)

### Limitation 5: Platform Cooperation
**Problem**: Social media platforms may not honor takedown requests.

**Mitigation**:
- Legal partnerships (DMCA, court orders)
- Direct API integrations where available
- Evidence packages for manual submission
- Public pressure and advocacy

---

## Cost Estimation (Monthly)

**Small Scale (1K users, 10K uploads/month)**
- Compute: $500 (AWS EC2: 3x t3.large + 2x g4dn.xlarge)
- Database: $150 (RDS PostgreSQL db.t3.medium)
- Storage: $50 (S3 + RDS storage)
- CDN/Network: $100
- **Total: ~$800/month**

**Medium Scale (100K users, 1M uploads/month)**
- Compute: $5,000 (Auto-scaling instances)
- Database: $1,500 (RDS Multi-AZ db.r5.2xlarge)
- Storage: $500
- CDN/Network: $2,000
- **Total: ~$9,000/month**

**Large Scale (1M+ users, 10M+ uploads/month)**
- Compute: $50,000+
- Database: $10,000+
- Storage: $5,000+
- CDN/Network: $20,000+
- **Total: ~$85,000+/month**

---

## Next Steps

1. Review complete database schema (`DATABASE_SCHEMA.md`)
2. Examine API specifications (`API_SPEC.md`)
3. Review implementation code (`backend/` and `frontend/`)
4. Set up development environment
5. Deploy to staging
6. Security audit and penetration testing
7. Legal compliance review
8. Production deployment

