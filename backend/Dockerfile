# Backend Dockerfile - Production Grade
FROM python:3.11-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    ffmpeg \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (production)
COPY requirements-prod.txt .
RUN pip install --no-cache-dir -r requirements-prod.txt

# Copy application files
COPY main_api.py .
COPY app ./app

# Create ml_models directory (models will be mounted via volume)
RUN mkdir -p ./ml_models

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD curl -f http://localhost:8000/api/v1/health/status || exit 1

# Run application (use PORT env variable from Render)
CMD uvicorn main_api:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
