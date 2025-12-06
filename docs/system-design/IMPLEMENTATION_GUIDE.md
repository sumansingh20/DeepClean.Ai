# Implementation Guide & Deployment

## Quick Start

This guide walks you through deploying a production-ready StopNCII-style platform.

---

## Prerequisites

### Required Software
- **Python 3.10+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL 15+** (database)
- **Redis 7+** (cache & queue)
- **Docker** (optional, for containerization)
- **NVIDIA GPU** (recommended for ML inference)

### Required Accounts
- AWS/GCP account (hosting)
- Domain name
- SSL certificate (Let's Encrypt)
- SendGrid (email)
- Sentry (monitoring)

---

## Step 1: Environment Setup

### 1.1 Clone Repository

```bash
git clone https://github.com/your-org/stopncii-platform.git
cd stopncii-platform
```

### 1.2 Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install additional ML dependencies
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
pip install timm transformers

# Install PDQ hashing (from Meta ThreatExchange)
git clone https://github.com/facebook/ThreatExchange.git
cd ThreatExchange/pdq/python
pip install -e .
cd ../../../
```

**requirements.txt:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy[asyncio]==2.0.23
asyncpg==0.29.0
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
celery==5.3.4
redis==5.0.1
pillow==10.1.0
opencv-python-headless==4.8.1.78
numpy==1.24.3
pandas==2.1.3
requests==2.31.0
aiohttp==3.9.1
python-dotenv==1.0.0
sentry-sdk==1.39.0
```

### 1.3 Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

**package.json dependencies:**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "1.6.2",
    "tailwindcss": "3.3.6",
    "typescript": "5.3.3"
  }
}
```

### 1.4 Database Setup

```bash
# Create PostgreSQL database
createdb stopncii_db

# Install extensions
psql stopncii_db << EOF
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";  -- For pgvector
EOF

# Run migrations
cd backend
alembic upgrade head
```

### 1.5 Redis Setup

```bash
# Start Redis server
redis-server --daemonize yes

# Test connection
redis-cli ping  # Should return: PONG
```

---

## Step 2: Configuration

### 2.1 Backend Environment Variables

Create `backend/.env`:

```bash
# Application
APP_NAME=StopNCII Platform
APP_VERSION=1.0.0
ENVIRONMENT=production
DEBUG=False
API_DOMAIN=api.stopncii-platform.com

# Security
JWT_SECRET_KEY=<generate-with: openssl rand -hex 32>
FIELD_ENCRYPTION_KEY=<generate-with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())">

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/stopncii_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# File Upload
MAX_UPLOAD_SIZE=524288000  # 500MB in bytes
UPLOAD_TMP_DIR=/tmp/secure
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp,bmp
ALLOWED_VIDEO_TYPES=mp4,avi,mov,mkv,webm

# ML Models
ML_MODEL_DIR=./ml_models/checkpoints
ML_DEVICE=cuda  # or cpu
ENABLE_GPU=True

# Email (SendGrid)
SENDGRID_API_KEY=<your-sendgrid-key>
FROM_EMAIL=noreply@stopncii-platform.com

# AWS (for evidence storage)
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_S3_BUCKET=stopncii-evidence-prod
AWS_REGION=us-east-1

# Monitoring
SENTRY_DSN=<your-sentry-dsn>
LOG_LEVEL=INFO

# Rate Limiting
RATE_LIMIT_ENABLED=True
RATE_LIMIT_UPLOAD_PER_HOUR=10
RATE_LIMIT_API_PER_HOUR=1000
```

### 2.2 Frontend Environment Variables

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.stopncii-platform.com/api/v1
NEXT_PUBLIC_WS_URL=wss://api.stopncii-platform.com
NEXT_PUBLIC_APP_NAME=StopNCII Platform
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
```

---

## Step 3: Download ML Models

### 3.1 Download Pre-trained Models

```bash
cd backend/ml_models

# Create checkpoints directory
mkdir -p checkpoints

# Option 1: Use pre-trained models from timm (automatic download)
# Models will be downloaded on first use

# Option 2: Download custom fine-tuned models (if available)
# wget https://your-model-host.com/xception_deepfake.pth -P checkpoints/
# wget https://your-model-host.com/efficientnet_b7_deepfake.pth -P checkpoints/
# wget https://your-model-host.com/vit_base_deepfake.pth -P checkpoints/

# Option 3: Use FaceForensics++ pre-trained models
# https://github.com/ondyari/FaceForensics
```

### 3.2 Model Training (Optional)

If you want to train your own models:

```python
# train_models.py
import torch
import timm
from torch.utils.data import DataLoader
from torchvision import transforms

# Load FaceForensics++ dataset
train_dataset = ...
val_dataset = ...

# Create model
model = timm.create_model('xception', pretrained=True, num_classes=2)

# Fine-tune on deepfake dataset
# ... training code ...

# Save checkpoint
torch.save(model.state_dict(), 'ml_models/checkpoints/xception_deepfake.pth')
```

---

## Step 4: Database Migration

### 4.1 Create Migration

```bash
cd backend

# Generate migration
alembic revision --autogenerate -m "Initial schema"

# Review migration file
# backend/alembic/versions/001_initial_schema.py

# Apply migration
alembic upgrade head
```

### 4.2 Seed Database

```python
# scripts/seed_database.py
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.models.database import User
from app.core.security import hash_password

async def seed_database():
    engine = create_async_engine(DATABASE_URL)
    async with AsyncSession(engine) as session:
        # Create admin user
        admin = User(
            email='admin@stopncii-platform.com',
            password_hash=hash_password('AdminPass123!'),
            full_name='System Administrator',
            role='admin',
            is_active=True,
            is_verified=True
        )
        session.add(admin)
        await session.commit()
        print(f"Admin user created: {admin.email}")

if __name__ == '__main__':
    asyncio.run(seed_database())
```

Run:
```bash
python scripts/seed_database.py
```

---

## Step 5: Start Services

### 5.1 Start Backend API

```bash
cd backend

# Development
uvicorn main_api:app --reload --host 0.0.0.0 --port 8000

# Production
gunicorn main_api:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
```

### 5.2 Start Celery Workers

```bash
# In separate terminal
cd backend

# Start worker
celery -A app.workers.celery_app worker \
    --loglevel=info \
    --concurrency=4 \
    --pool=prefork

# Start beat scheduler (for periodic tasks)
celery -A app.workers.celery_app beat --loglevel=info
```

### 5.3 Start Frontend

```bash
cd frontend

# Development
npm run dev

# Production build
npm run build
npm start

# Or with PM2
pm2 start npm --name "stopncii-frontend" -- start
```

---

## Step 6: NGINX Configuration

### 6.1 Install NGINX

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

### 6.2 Configure NGINX

Create `/etc/nginx/sites-available/stopncii`:

```nginx
# API Backend
upstream backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;  # Add more workers for load balancing
    keepalive 32;
}

# WebSocket Backend
upstream websocket {
    server 127.0.0.1:8000;
    keepalive 32;
}

# Frontend
upstream frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name stopncii-platform.com api.stopncii-platform.com;
    return 301 https://$server_name$request_uri;
}

# API Server
server {
    listen 443 ssl http2;
    server_name api.stopncii-platform.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.stopncii-platform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.stopncii-platform.com/privkey.pem;
    ssl_protocols TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Request size limits
    client_max_body_size 500M;
    
    # API endpoints
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # WebSocket endpoints
    location /ws/ {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
}

# Frontend Server
server {
    listen 443 ssl http2;
    server_name stopncii-platform.com;
    
    ssl_certificate /etc/letsencrypt/live/stopncii-platform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stopncii-platform.com/privkey.pem;
    ssl_protocols TLSv1.3;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/stopncii /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 Get SSL Certificate

```bash
sudo certbot --nginx -d stopncii-platform.com -d api.stopncii-platform.com
```

---

## Step 7: Docker Deployment (Alternative)

### 7.1 Backend Dockerfile

`backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "main_api:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

### 7.2 Docker Compose

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: stopncii_db
      POSTGRES_USER: stopncii
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  backend:
    build: ./backend
    env_file: ./backend/.env
    depends_on:
      - postgres
      - redis
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - /tmp/secure:/tmp/secure
  
  celery_worker:
    build: ./backend
    command: celery -A app.workers.celery_app worker --loglevel=info
    env_file: ./backend/.env
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
  
  frontend:
    build: ./frontend
    env_file: ./frontend/.env.local
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

Run:
```bash
docker-compose up -d
```

---

## Step 8: Monitoring & Logging

### 8.1 Setup Sentry

```python
# backend/main_api.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment=os.getenv('ENVIRONMENT', 'production')
)
```

### 8.2 Setup Prometheus

```python
# backend/main_api.py
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# Add metrics endpoint
Instrumentator().instrument(app).expose(app)
```

### 8.3 Log Configuration

```python
# backend/app/core/logging_config.py
import logging
import sys
from logging.handlers import RotatingFileHandler

def setup_logging():
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(log_format))
    
    # File handler
    file_handler = RotatingFileHandler(
        'logs/app.log',
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(log_format))
    
    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
```

---

## Step 9: Testing

### 9.1 Backend Tests

```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio pytest-cov httpx

# Run tests
pytest tests/ -v --cov=app

# Run specific test
pytest tests/test_hashing.py -v
```

### 9.2 Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### 9.3 Integration Tests

```bash
# Test API endpoints
curl -X POST https://api.stopncii-platform.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}'

# Test file upload
curl -X POST https://api.stopncii-platform.com/api/v1/upload/analyze \
  -H "Authorization: Bearer <token>" \
  -F "file=@test_image.jpg"
```

---

## Step 10: Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations applied
- [ ] ML models downloaded
- [ ] Redis running
- [ ] Celery workers running
- [ ] NGINX configured
- [ ] Firewall rules configured
- [ ] Monitoring setup (Sentry)
- [ ] Backup strategy in place
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CORS configured
- [ ] Log rotation setup
- [ ] Health check endpoints tested
- [ ] Load testing completed
- [ ] Documentation updated

---

## Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
psql $DATABASE_URL
```

### Issue: Redis connection failed
```bash
# Check Redis is running
redis-cli ping

# Check Redis logs
sudo journalctl -u redis
```

### Issue: ML model download fails
```bash
# Manually download models
python -c "import timm; timm.create_model('xception', pretrained=True)"
```

### Issue: High memory usage
```bash
# Monitor memory
htop

# Reduce Celery concurrency
celery -A app.workers.celery_app worker --concurrency=2

# Enable swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Performance Optimization

### Database Indexing
```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_media_hashes_hamming ON media_hashes USING gist(hash_binary);
CREATE INDEX CONCURRENTLY idx_media_hashes_embedding ON media_hashes USING ivfflat(embedding_vector vector_cosine_ops);
```

### Caching Strategy
```python
# Cache frequent hash lookups
@cache(ttl=3600)  # 1 hour
async def get_hash_by_value(hash_value: str):
    ...
```

### Connection Pooling
```python
# Increase pool size for high traffic
engine = create_async_engine(
    DATABASE_URL,
    pool_size=50,
    max_overflow=100
)
```

---

## Support & Resources

- **Documentation**: https://docs.stopncii-platform.com
- **GitHub**: https://github.com/your-org/stopncii-platform
- **Discord**: https://discord.gg/stopncii
- **Email**: support@stopncii-platform.com

---

## License

This project is licensed under the MIT License - see LICENSE file for details.
