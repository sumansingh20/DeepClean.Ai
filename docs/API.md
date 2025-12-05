# A-DFP Firewall API Documentation

**Version:** 1.0.0-beta  
**Base URL:** `http://localhost:8000/api/v1`  
**Authentication:** JWT Bearer Token  
**Response Format:** JSON

---

## Table of Contents

1. [Authentication](#authentication)
2. [Sessions Management](#sessions-management)
3. [Voice Deepfake Detection](#voice-deepfake-detection)
4. [Video Deepfake Detection](#video-deepfake-detection)
5. [Document Forgery Detection](#document-forgery-detection)
6. [Liveness Verification](#liveness-verification)
7. [Scam Call Analysis](#scam-call-analysis)
8. [Risk Scoring](#risk-scoring)
9. [Incidents](#incidents)
10. [Reports](#reports)
11. [Webhooks](#webhooks)
12. [Health](#health)
13. [Error Handling](#error-handling)

---

## Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "organization": "ACME Corp",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2024-01-15T10:30:00Z",
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or user already exists
- `422 Unprocessable Entity` - Validation error

---

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "analyst"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User not found

---

### Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

---

### Logout

**Endpoint:** `POST /auth/logout`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

### Get Current User Profile

**Endpoint:** `GET /auth/profile`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "organization": "ACME Corp",
  "role": "analyst",
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-16T14:22:00Z"
}
```

---

## Sessions Management

### Create Session

**Endpoint:** `POST /sessions`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "analysis_type": "voice",
  "metadata": {
    "source": "phone_call",
    "user_location": {
      "lat": 40.7128,
      "lon": -74.0060
    },
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Response (201 Created):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "analysis_type": "voice",
  "status": "created",
  "created_at": "2024-01-16T10:30:00Z",
  "expires_at": "2024-01-16T12:30:00Z"
}
```

---

### Get Session

**Endpoint:** `GET /sessions/{session_id}`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "analysis_type": "voice",
  "results": {
    "voice": {
      "score": 0.87,
      "confidence": 0.92,
      "is_deepfake": true,
      "processing_time_ms": 2300,
      "artifacts": [
        "mel_spectrogram_artifacts",
        "voice_pattern_inconsistency"
      ]
    }
  },
  "risk_score": {
    "overall_score": 0.85,
    "category": "high",
    "confidence": 0.91,
    "action": "escalate",
    "explanation_user": "We detected unusual patterns in the voice that suggest potential fraud.",
    "explanation_analyst": "High mel-spectrogram anomalies (0.87) combined with voice pattern inconsistencies. User flagged high-risk in previous sessions.",
    "next_steps": [
      "Escalate to fraud team for manual review",
      "Flag account for additional verification"
    ]
  },
  "created_at": "2024-01-16T10:30:00Z",
  "completed_at": "2024-01-16T10:32:30Z"
}
```

---

### List Sessions

**Endpoint:** `GET /sessions`

**Query Parameters:**
```
?status=completed&limit=20&offset=0&sort_by=created_at&order=desc
```

**Response (200 OK):**
```json
{
  "total": 150,
  "limit": 20,
  "offset": 0,
  "sessions": [
    {
      "session_id": "550e8400-e29b-41d4-a716-446655440001",
      "status": "completed",
      "analysis_type": "voice",
      "risk_score": 0.85,
      "created_at": "2024-01-16T10:30:00Z"
    }
  ]
}
```

---

### Delete Session

**Endpoint:** `DELETE /sessions/{session_id}`

**Response (204 No Content)**

---

## Voice Deepfake Detection

### Analyze Voice

**Endpoint:** `POST /voice/analyze`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Parameters:**
- `file` (File) - Audio file (.wav, .mp3, .flac, .m4a, .ogg) - Max 50MB
- `session_id` (String) - Session ID (optional)
- `language` (String) - Language code (e.g., "en") - Default: "en"

**Example cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/voice/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@audio.wav" \
  -F "session_id=$SESSION_ID" \
  -F "language=en"
```

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440002",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "processing",
  "message": "Voice analysis queued for processing",
  "estimated_completion": "2024-01-16T10:32:00Z"
}
```

**Poll Result:**
```bash
curl -X GET "http://localhost:8000/api/v1/voice/result/$JOB_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Video Deepfake Detection

### Analyze Video

**Endpoint:** `POST /video/analyze`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Parameters:**
- `file` (File) - Video file (.mp4, .mov, .avi, .mkv, .webm) - Max 500MB
- `session_id` (String) - Session ID (optional)
- `start_time` (Integer) - Start frame in seconds (optional) - Default: 0
- `duration` (Integer) - Analysis duration in seconds (optional) - Default: entire video

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440003",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "processing",
  "message": "Video analysis queued for processing",
  "estimated_completion": "2024-01-16T10:35:00Z"
}
```

**Polling Result:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440003",
  "status": "completed",
  "result": {
    "overall_score": 0.92,
    "confidence": 0.88,
    "is_deepfake": true,
    "processing_time_ms": 45000,
    "frame_count": 225,
    "artifacts": {
      "eye_movement": "irregular",
      "lip_sync": "desynchronized",
      "skin_texture": "inconsistent",
      "lighting": "unnatural"
    },
    "per_frame_scores": {
      "min": 0.45,
      "max": 0.98,
      "mean": 0.92,
      "std_dev": 0.12
    },
    "temporal_analysis": {
      "consistency_score": 0.91,
      "transition_smoothness": 0.85
    }
  }
}
```

---

## Document Forgery Detection

### Analyze Document

**Endpoint:** `POST /document/analyze`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Parameters:**
- `file` (File) - Document image (.jpg, .png, .pdf, .bmp) - Max 20MB
- `session_id` (String) - Session ID (optional)
- `document_type` (String) - Type of document: "id_card", "passport", "license", "generic"

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440004",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "processing"
}
```

**Result:**
```json
{
  "overall_score": 0.78,
  "confidence": 0.85,
  "is_forged": true,
  "document_type": "id_card",
  "processing_time_ms": 8500,
  "detected_text": {
    "name": "John Doe",
    "date_of_birth": "1990-01-15",
    "id_number": "123456789"
  },
  "forgery_indicators": {
    "edge_anomalies": 0.89,
    "shadow_inconsistencies": 0.76,
    "noise_patterns": 0.72,
    "metadata_issues": 0.65
  },
  "regions": [
    {
      "region": "signature",
      "forgery_score": 0.92,
      "indicators": ["copy_paste_boundary", "pressure_variation"]
    }
  ]
}
```

---

## Liveness Verification

### Verify Liveness (Passive)

**Endpoint:** `POST /liveness/verify-passive`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Parameters:**
- `file` (File) - Video file of face - Max 50MB
- `session_id` (String) - Session ID (optional)

**Response:**
```json
{
  "is_alive": true,
  "liveness_score": 0.94,
  "confidence": 0.91,
  "checks": {
    "blink_detection": {
      "score": 0.98,
      "blinks_detected": 3,
      "blink_frequency": 15
    },
    "mouth_movement": {
      "score": 0.92,
      "detected": true
    },
    "head_pose": {
      "score": 0.88,
      "variations_detected": true
    },
    "anti_replay": {
      "score": 0.95,
      "replay_detected": false
    }
  }
}
```

### Verify Liveness (Active Challenge)

**Endpoint:** `POST /liveness/verify-active`

**Step 1 - Get Challenge:**
```json
POST /liveness/get-challenge
Response:
{
  "challenge_id": "550e8400-e29b-41d4-a716-446655440005",
  "challenge_type": "blink",
  "instructions": "Please blink your eyes",
  "timeout_seconds": 30
}
```

**Step 2 - Submit Response:**
```bash
curl -X POST /liveness/submit-challenge \
  -H "Authorization: Bearer $TOKEN" \
  -F "challenge_id=$CHALLENGE_ID" \
  -F "file=@video.mp4"

Response:
{
  "challenge_id": "550e8400-e29b-41d4-a716-446655440005",
  "success": true,
  "liveness_score": 0.96,
  "confidence": 0.94,
  "message": "Challenge completed successfully"
}
```

---

## Scam Call Analysis

### Analyze Scam Call

**Endpoint:** `POST /scam/analyze`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Parameters:**
- `file` (File) - Audio file of call - Max 50MB
- `session_id` (String) - Session ID (optional)

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440006",
  "status": "processing"
}
```

**Result:**
```json
{
  "is_scam": true,
  "scam_score": 0.83,
  "confidence": 0.87,
  "processing_time_ms": 12000,
  "scam_patterns": {
    "impersonation": 0.91,
    "financial_request": 0.78,
    "romance": 0.12,
    "technical_support": 0.45,
    "social_engineering": 0.88
  },
  "pii_detected": [
    {
      "type": "credit_card",
      "confidence": 0.95,
      "location": "00:45-00:50"
    },
    {
      "type": "ssn",
      "confidence": 0.87,
      "location": "01:15-01:20"
    }
  ],
  "transcript": {
    "text": "Hello, this is calling from your bank...",
    "language": "en",
    "duration_seconds": 180
  },
  "identified_entities": [
    {
      "entity": "Bank of America",
      "type": "organization",
      "impersonation_risk": 0.92
    },
    {
      "entity": "$50,000",
      "type": "monetary_amount",
      "context": "financial_request"
    }
  ]
}
```

---

## Risk Scoring

### Calculate Risk Score

**Endpoint:** `POST /risk/calculate`

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "include_components": ["voice", "video", "document", "liveness", "scam"]
}
```

**Response:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "overall_score": 0.85,
  "category": "high",
  "confidence": 0.91,
  "action": "escalate",
  "component_weights": {
    "voice": 0.20,
    "video": 0.25,
    "document": 0.25,
    "liveness": 0.15,
    "scam": 0.15
  },
  "component_scores": {
    "voice": 0.87,
    "video": 0.92,
    "document": 0.78,
    "liveness": 0.94,
    "scam": 0.83
  },
  "user_history_modifier": 1.1,
  "explanation_user": "Multiple detection systems flagged unusual activity.",
  "explanation_analyst": "Voice score (0.87) combined with video artifacts (0.92) and document inconsistencies (0.78). User has 5 previous high-risk sessions.",
  "next_steps": [
    "Escalate to fraud team",
    "Request additional verification",
    "Monitor account for 7 days"
  ]
}
```

---

## Incidents

### Create Incident

**Endpoint:** `POST /incidents`

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "severity": "high",
  "description": "Potential deepfake in video verification",
  "tags": ["deepfake", "video", "urgent"]
}
```

**Response (201 Created):**
```json
{
  "incident_id": "550e8400-e29b-41d4-a716-446655440007",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "severity": "high",
  "status": "open",
  "created_at": "2024-01-16T10:30:00Z"
}
```

### Get Incident

**Endpoint:** `GET /incidents/{incident_id}`

**Response:**
```json
{
  "incident_id": "550e8400-e29b-41d4-a716-446655440007",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "severity": "high",
  "status": "open",
  "description": "Potential deepfake in video verification",
  "tags": ["deepfake", "video", "urgent"],
  "assigned_to": "analyst@example.com",
  "created_at": "2024-01-16T10:30:00Z",
  "updated_at": "2024-01-16T10:35:00Z",
  "resolution_notes": null
}
```

---

## Reports

### Generate Report

**Endpoint:** `POST /reports/generate`

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "format": "pdf",
  "include_sections": [
    "summary",
    "component_analysis",
    "risk_assessment",
    "recommendations"
  ]
}
```

**Response (202 Accepted):**
```json
{
  "report_id": "550e8400-e29b-41d4-a716-446655440008",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "format": "pdf",
  "status": "generating",
  "download_url": "/reports/download/550e8400-e29b-41d4-a716-446655440008"
}
```

### Download Report

**Endpoint:** `GET /reports/download/{report_id}`

**Response:** Binary file download (PDF/JSON/HTML)

---

## Webhooks

### Register Webhook

**Endpoint:** `POST /webhooks`

**Request Body:**
```json
{
  "url": "https://your-domain.com/fraud-webhook",
  "events": ["analysis_completed", "incident_created", "risk_threshold_exceeded"],
  "secret": "your-webhook-secret"
}
```

**Response (201 Created):**
```json
{
  "webhook_id": "550e8400-e29b-41d4-a716-446655440009",
  "url": "https://your-domain.com/fraud-webhook",
  "events": ["analysis_completed", "incident_created"],
  "active": true,
  "created_at": "2024-01-16T10:30:00Z"
}
```

### Webhook Payload Example

```json
{
  "event_type": "analysis_completed",
  "timestamp": "2024-01-16T10:32:00Z",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "data": {
    "analysis_type": "voice",
    "risk_score": 0.85,
    "category": "high",
    "action": "escalate"
  },
  "signature": "sha256=abc123def456..."
}
```

---

## Health

### System Health

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-16T10:30:00Z",
  "version": "1.0.0-beta"
}
```

### Detailed Health Check

**Endpoint:** `GET /health/full`

**Response:**
```json
{
  "status": "healthy",
  "components": {
    "database": {
      "status": "healthy",
      "latency_ms": 12
    },
    "redis": {
      "status": "healthy",
      "latency_ms": 5
    },
    "ml_models": {
      "status": "ready",
      "models_loaded": 5,
      "gpu_available": true
    },
    "celery": {
      "status": "healthy",
      "workers": 8,
      "queue_depth": 5
    }
  }
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": true,
  "status_code": 400,
  "message": "Invalid input",
  "details": {
    "field": "password",
    "reason": "Must be at least 12 characters"
  },
  "request_id": "req-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-16T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 202 | Accepted | Task queued (async) |
| 204 | No Content | Deletion successful |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Schema validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |
| 503 | Service Unavailable | Service down |

---

## Rate Limiting

**Limits per minute (per API key):**
- `/voice/*` - 10 requests
- `/video/*` - 5 requests
- `/document/*` - 20 requests
- `/liveness/*` - 5 requests
- `/scam/*` - 10 requests
- Other endpoints - 100 requests

**Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1705419600
```

---

## Pagination

All list endpoints support:
```
?limit=20&offset=0&sort_by=created_at&order=desc
```

Response includes:
```json
{
  "total": 150,
  "limit": 20,
  "offset": 0,
  "items": [...]
}
```

---

## Interactive API Documentation

Open your browser to `http://localhost:8000/docs` for the Swagger UI with:
- Full API endpoint documentation
- "Try it out" functionality for live testing
- Request/response examples
- Schema definitions

---

**Last Updated:** 2024  
**Next Updates:** WebSocket support, batch analysis, advanced filtering
