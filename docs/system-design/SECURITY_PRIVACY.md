# Security & Privacy Model

## Overview

This platform prioritizes user privacy and security, following StopNCII's principles of **never storing actual media content** while maintaining effectiveness for deepfake detection and re-upload prevention.

**Core Principles:**
1. **Privacy by Design**: No media storage, only perceptual hashes
2. **Data Minimization**: Collect only what's necessary
3. **Encryption Everywhere**: At rest and in transit
4. **Transparency**: Users know what data we keep
5. **Compliance**: GDPR, CCPA, COPPA compliant

---

## 1. No Media Storage Policy

### What We DO Store:
- ✅ Perceptual hashes (PDQ/TMK) - 256-bit fingerprints
- ✅ Detection metadata (confidence scores, timestamps)
- ✅ User-provided context (descriptions, URLs)
- ✅ Audit logs (actions, not content)

### What We DON'T Store:
- ❌ Original images or videos
- ❌ Thumbnails or previews
- ❌ Cached copies
- ❌ Temporary files (deleted immediately)

### Implementation:

**Ephemeral Processing Pipeline:**
```python
import os
import tempfile
from pathlib import Path

async def process_upload(file: UploadFile):
    # Create temporary file with secure permissions
    with tempfile.NamedTemporaryFile(
        mode='wb',
        delete=False,
        suffix=Path(file.filename).suffix,
        dir='/tmp/secure',  # tmpfs mount (RAM disk)
        prefix='upload_'
    ) as tmp_file:
        # Write uploaded content
        content = await file.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Set restrictive permissions (owner read-only)
        os.chmod(tmp_path, 0o400)
        
        # Process file (hash generation, detection)
        hash_result = await generate_hash(tmp_path)
        detection_result = await detect_deepfake(tmp_path)
        
        # Store only hash and metadata
        await store_hash_record(hash_result, detection_result)
        
    finally:
        # CRITICAL: Secure deletion
        # 1. Overwrite with random data
        with open(tmp_path, 'wb') as f:
            f.write(os.urandom(os.path.getsize(tmp_path)))
        
        # 2. Delete file
        os.unlink(tmp_path)
        
        # 3. Verify deletion
        assert not os.path.exists(tmp_path)
```

**tmpfs Configuration (Linux):**
```bash
# Mount /tmp as tmpfs (RAM disk) for extra security
# Files are never written to disk, lost on reboot
sudo mount -t tmpfs -o size=2G,mode=0700 tmpfs /tmp/secure
```

---

## 2. Authentication & Authorization

### JWT Token Authentication

**Token Structure:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "user",
    "iat": 1644508800,
    "exp": 1644595200
  },
  "signature": "..."
}
```

**Implementation:**
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Configuration
SECRET_KEY = os.getenv('JWT_SECRET_KEY')  # 256-bit random key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme
security = HTTPBearer()

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using bcrypt"""
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """Hash password using bcrypt with 12 rounds"""
    return pwd_context.hash(password)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Extract and validate JWT token"""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    # Fetch user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    return user
```

### Role-Based Access Control (RBAC)

**Roles:**
- `user`: Upload, report, view own data
- `moderator`: Review reports, approve takedowns
- `admin`: Full access, platform management

**Permission Decorator:**
```python
from functools import wraps

def require_role(*allowed_roles: str):
    """Decorator to restrict endpoints by role"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=403,
                    detail=f"Requires role: {', '.join(allowed_roles)}"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@app.get("/admin/reports/queue")
@require_role("moderator", "admin")
async def get_reports_queue(current_user: User = Depends(get_current_user)):
    ...
```

---

## 3. Data Encryption

### At Rest

**Database Encryption:**
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
CREATE TABLE content_reports (
    id UUID PRIMARY KEY,
    victim_contact_info TEXT,  -- Will be encrypted
    ...
);

-- Insert with encryption
INSERT INTO content_reports (victim_contact_info)
VALUES (
    pgp_sym_encrypt(
        'sensitive_data',
        current_setting('app.encryption_key')
    )
);

-- Query with decryption
SELECT 
    pgp_sym_decrypt(victim_contact_info::bytea, current_setting('app.encryption_key'))
FROM content_reports;
```

**Application-Level Encryption:**
```python
from cryptography.fernet import Fernet
import os

# Generate key (store securely in environment)
ENCRYPTION_KEY = os.getenv('FIELD_ENCRYPTION_KEY')
cipher = Fernet(ENCRYPTION_KEY.encode())

def encrypt_field(value: str) -> str:
    """Encrypt sensitive field"""
    return cipher.encrypt(value.encode()).decode()

def decrypt_field(encrypted_value: str) -> str:
    """Decrypt sensitive field"""
    return cipher.decrypt(encrypted_value.encode()).decode()

# Usage
class ContentReport:
    def __init__(self, victim_email: str):
        # Store encrypted
        self.victim_email_encrypted = encrypt_field(victim_email)
    
    def get_victim_email(self) -> str:
        # Decrypt on access
        return decrypt_field(self.victim_email_encrypted)
```

### In Transit

**TLS 1.3 Configuration (NGINX):**
```nginx
server {
    listen 443 ssl http2;
    server_name api.stopncii-platform.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.stopncii-platform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.stopncii-platform.com/privkey.pem;
    
    # TLS 1.3 only
    ssl_protocols TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    ssl_prefer_server_ciphers off;
    
    # HSTS (force HTTPS)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.stopncii-platform.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 4. Rate Limiting & DDoS Protection

### Implementation (Redis + FastAPI):

```python
from fastapi import Request, HTTPException
from redis import Redis
import time

redis_client = Redis(host='localhost', port=6379, db=0)

async def rate_limit_middleware(request: Request, call_next):
    """
    Rate limiting middleware using sliding window algorithm
    """
    # Get user ID or IP address
    user_id = getattr(request.state, 'user_id', None)
    identifier = user_id or request.client.host
    
    # Define limits based on endpoint
    if request.url.path.startswith('/auth'):
        limit = 5  # 5 requests per minute
        window = 60
    elif request.url.path.startswith('/upload'):
        limit = 10  # 10 uploads per hour
        window = 3600
    else:
        limit = 1000  # 1000 requests per hour
        window = 3600
    
    # Check rate limit
    key = f"rate_limit:{identifier}:{request.url.path}"
    current = int(time.time())
    
    # Remove old entries (outside window)
    redis_client.zremrangebyscore(key, 0, current - window)
    
    # Count requests in current window
    request_count = redis_client.zcard(key)
    
    if request_count >= limit:
        raise HTTPException(
            status_code=429,
            detail={
                'error': 'RATE_LIMIT_EXCEEDED',
                'message': f'Too many requests. Limit: {limit} per {window}s',
                'retry_after': window
            },
            headers={'Retry-After': str(window)}
        )
    
    # Add current request
    redis_client.zadd(key, {str(current): current})
    redis_client.expire(key, window)
    
    # Add rate limit headers
    response = await call_next(request)
    response.headers['X-RateLimit-Limit'] = str(limit)
    response.headers['X-RateLimit-Remaining'] = str(limit - request_count - 1)
    response.headers['X-RateLimit-Reset'] = str(current + window)
    
    return response
```

### DDoS Protection (CloudFlare):

```yaml
# CloudFlare Configuration
security_level: high
challenge_ttl: 900  # 15 minutes

# Rate limiting rules
rate_limiting:
  - name: "API Protection"
    threshold: 100
    period: 60
    action: challenge  # or block
    match:
      url: "/api/*"
  
  - name: "Upload Protection"
    threshold: 10
    period: 3600
    action: block
    match:
      url: "/api/v1/upload/*"

# Bot management
bot_management:
  fight_mode: true
  verified_bots: allow
  
# DDoS protection
ddos_protection:
  http_flood: true
  layer_7: true
```

---

## 5. Input Validation & Sanitization

### Request Validation (Pydantic):

```python
from pydantic import BaseModel, validator, EmailStr, constr
from typing import List
import re

class UserRegistration(BaseModel):
    email: EmailStr  # Auto-validates email format
    password: constr(min_length=8, max_length=128)  # Length constraints
    full_name: constr(min_length=1, max_length=255)
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Enforce strong password policy"""
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @validator('full_name')
    def sanitize_name(cls, v):
        """Remove potentially dangerous characters"""
        # Allow only letters, spaces, hyphens, apostrophes
        cleaned = re.sub(r'[^a-zA-Z\s\-\']', '', v)
        return cleaned.strip()

class ReportSubmission(BaseModel):
    description: constr(min_length=10, max_length=5000)
    evidence_urls: List[constr(max_length=2048)]
    
    @validator('evidence_urls')
    def validate_urls(cls, urls):
        """Validate URLs are safe"""
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # IP
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        for url in urls:
            if not url_pattern.match(url):
                raise ValueError(f'Invalid URL: {url}')
        
        return urls
    
    @validator('description')
    def sanitize_description(cls, v):
        """Remove HTML/script tags"""
        # Basic XSS prevention
        v = re.sub(r'<script[^>]*>.*?</script>', '', v, flags=re.DOTALL | re.IGNORECASE)
        v = re.sub(r'<[^>]+>', '', v)  # Remove all HTML tags
        return v.strip()
```

### SQL Injection Prevention:

```python
# ALWAYS use parameterized queries with SQLAlchemy
# ✅ SAFE
result = await db.execute(
    select(User).where(User.email == user_input)  # Automatically parameterized
)

# ❌ NEVER do this (vulnerable to SQL injection)
query = f"SELECT * FROM users WHERE email = '{user_input}'"
result = await db.execute(text(query))
```

---

## 6. Audit Logging

### Comprehensive Logging:

```python
import logging
from datetime import datetime
from typing import Optional
from sqlalchemy import insert

logger = logging.getLogger(__name__)

async def log_action(
    db: AsyncSession,
    user_id: Optional[UUID],
    action: str,
    resource_type: str,
    resource_id: Optional[UUID],
    ip_address: str,
    user_agent: str,
    metadata: dict = None
):
    """
    Log all important actions for audit trail
    """
    audit_entry = {
        'user_id': user_id,
        'action': action,
        'resource_type': resource_type,
        'resource_id': resource_id,
        'ip_address': ip_address,
        'user_agent': user_agent,
        'timestamp': datetime.utcnow(),
        'metadata': metadata or {}
    }
    
    # Insert into audit_logs table
    await db.execute(insert(AuditLog).values(**audit_entry))
    await db.commit()
    
    # Also log to application logs
    logger.info(
        f"AUDIT: {action} by user {user_id} on {resource_type}:{resource_id}",
        extra=audit_entry
    )

# Usage in endpoints
@app.post("/upload/analyze")
async def upload_file(
    file: UploadFile,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Process upload
    job_id = await process_upload(file)
    
    # Log action
    await log_action(
        db=db,
        user_id=current_user.id,
        action='file_uploaded',
        resource_type='analysis_job',
        resource_id=job_id,
        ip_address=request.client.host,
        user_agent=request.headers.get('user-agent'),
        metadata={'file_size': file.size, 'filename': file.filename}
    )
    
    return {'job_id': job_id}
```

---

## 7. Privacy Compliance

### GDPR Right to Erasure:

```python
@app.delete("/users/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete user account and all associated data (GDPR Article 17)
    """
    user_id = current_user.id
    
    # Delete user data (cascades to related records via foreign keys)
    await db.execute(delete(User).where(User.id == user_id))
    
    # Anonymize audit logs (keep for legal compliance)
    await db.execute(
        update(AuditLog)
        .where(AuditLog.user_id == user_id)
        .values(
            user_email='deleted@anonymized.local',
            user_id=None,
            metadata={}
        )
    )
    
    await db.commit()
    
    return {'status': 'success', 'message': 'Account deleted'}
```

### Data Export (GDPR Article 20):

```python
@app.get("/users/me/export")
async def export_user_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Export all user data in machine-readable format
    """
    # Gather all user data
    data = {
        'user_profile': {
            'email': current_user.email,
            'full_name': current_user.full_name,
            'created_at': current_user.created_at.isoformat()
        },
        'media_hashes': [],
        'reports': [],
        'audit_logs': []
    }
    
    # Fetch media hashes
    result = await db.execute(
        select(MediaHash).where(MediaHash.user_id == current_user.id)
    )
    data['media_hashes'] = [hash.to_dict() for hash in result.scalars()]
    
    # Fetch reports
    result = await db.execute(
        select(ContentReport).where(ContentReport.reporter_user_id == current_user.id)
    )
    data['reports'] = [report.to_dict() for report in result.scalars()]
    
    # Return as JSON
    return JSONResponse(content=data)
```

---

## 8. Security Best Practices

### Environment Variables:

```bash
# .env (NEVER commit to git)
JWT_SECRET_KEY=<256-bit-random-key>
FIELD_ENCRYPTION_KEY=<base64-encoded-fernet-key>
DATABASE_URL=postgresql://user:pass@localhost/dbname
REDIS_URL=redis://localhost:6379/0

# AWS credentials for evidence storage
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_S3_BUCKET=stopncii-evidence-production

# API keys for platform integrations
TWITTER_API_KEY=<key>
YOUTUBE_API_KEY=<key>
```

### Secrets Management (Production):

```python
# Use AWS Secrets Manager or HashiCorp Vault
import boto3
from botocore.exceptions import ClientError

def get_secret(secret_name: str) -> dict:
    """Fetch secrets from AWS Secrets Manager"""
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name='us-east-1'
    )
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except ClientError as e:
        logger.error(f"Failed to retrieve secret: {e}")
        raise

# Usage
secrets = get_secret('stopncii/production/api')
JWT_SECRET_KEY = secrets['jwt_secret_key']
```

---

## 9. Incident Response Plan

### Security Incident Workflow:

1. **Detection**: Automated monitoring alerts (Sentry, CloudWatch)
2. **Containment**: Isolate affected systems, revoke tokens
3. **Investigation**: Review audit logs, identify scope
4. **Remediation**: Patch vulnerabilities, restore services
5. **Notification**: Inform affected users (GDPR requirement)
6. **Post-Mortem**: Document lessons learned

### Breach Notification Template:

```python
async def notify_data_breach(
    affected_users: List[User],
    breach_description: str,
    data_affected: List[str],
    remediation_steps: List[str]
):
    """
    Notify users of data breach (GDPR Article 34)
    Must be sent within 72 hours of discovery
    """
    for user in affected_users:
        await send_email(
            to=user.email,
            subject="Important Security Notice",
            body=f"""
            Dear {user.full_name},
            
            We are writing to inform you of a security incident that may have 
            affected your personal information.
            
            What happened:
            {breach_description}
            
            Data potentially affected:
            {', '.join(data_affected)}
            
            What we're doing:
            {', '.join(remediation_steps)}
            
            What you should do:
            - Change your password immediately
            - Enable two-factor authentication
            - Monitor your account for suspicious activity
            
            We sincerely apologize for this incident and are taking steps to 
            prevent future occurrences.
            
            For questions, contact: security@stopncii-platform.com
            """
        )
```

---

## Summary

This security and privacy model ensures:

✅ **No media storage** - Only perceptual hashes retained  
✅ **Strong encryption** - TLS 1.3, pgcrypto, application-level encryption  
✅ **Robust authentication** - JWT tokens, bcrypt, RBAC  
✅ **Comprehensive auditing** - All actions logged  
✅ **Privacy compliance** - GDPR, CCPA, COPPA  
✅ **Rate limiting** - DDoS protection, abuse prevention  
✅ **Input validation** - SQL injection, XSS prevention  
✅ **Incident response** - Breach notification procedures  

The platform prioritizes user privacy while maintaining effectiveness for deepfake detection and NCII prevention.
