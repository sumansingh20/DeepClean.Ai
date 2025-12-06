# REST API Specification

## Base URL
```
Production: https://api.stopncii-platform.com/api/v1
Staging: https://staging-api.stopncii-platform.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication

All API requests (except auth endpoints) require JWT token in header:

```http
Authorization: Bearer <jwt_token>
```

**Token Expiry**: 24 hours  
**Refresh**: Use `/auth/refresh` endpoint before expiry

---

## API Endpoints

### 1. Authentication

#### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "accept_terms": true
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "is_verified": false,
    "created_at": "2025-02-10T10:30:00Z"
  },
  "message": "Registration successful. Please verify your email."
}
```

**Errors:**
- `400`: Invalid email format or weak password
- `409`: Email already registered

---

#### POST /auth/login

Authenticate and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "user",
      "is_verified": true
    }
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `403`: Account suspended

---

#### POST /auth/refresh

Refresh JWT token before expiry.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

---

### 2. Upload & Analysis

#### POST /upload/analyze

Upload media file for deepfake detection and hash generation.

**Request:** `multipart/form-data`
```
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="video.mp4"
Content-Type: video/mp4

<binary data>
------WebKitFormBoundary
Content-Disposition: form-data; name="metadata"

{"description": "Optional metadata", "context": "victim upload"}
------WebKitFormBoundary--
```

**cURL Example:**
```bash
curl -X POST \
  https://api.stopncii-platform.com/api/v1/upload/analyze \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/video.mp4" \
  -F 'metadata={"description": "Test upload"}'
```

**Response:** `202 Accepted`
```json
{
  "status": "success",
  "data": {
    "job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "status": "queued",
    "estimated_time_seconds": 45,
    "websocket_url": "wss://api.stopncii-platform.com/ws/job/7c9e6679-7425-40de-944b-e07fc1f90ae7"
  },
  "message": "File uploaded successfully. Processing started."
}
```

**Errors:**
- `400`: Invalid file type or size exceeded (max 500MB)
- `429`: Rate limit exceeded
- `507`: Insufficient storage

**File Constraints:**
- **Max size**: 500MB
- **Image formats**: JPG, PNG, GIF, WebP, BMP
- **Video formats**: MP4, AVI, MOV, MKV, WebM
- **Rate limit**: 10 uploads/hour per user

---

#### GET /analysis/{job_id}

Get analysis status and results.

**Response (Processing):** `200 OK`
```json
{
  "status": "success",
  "data": {
    "job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "status": "processing",
    "progress": 65,
    "current_step": "Generating perceptual hash",
    "estimated_time_remaining_seconds": 15,
    "started_at": "2025-02-10T14:20:00Z"
  }
}
```

**Response (Completed):** `200 OK`
```json
{
  "status": "success",
  "data": {
    "job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "status": "completed",
    "progress": 100,
    "started_at": "2025-02-10T14:20:00Z",
    "completed_at": "2025-02-10T14:21:30Z",
    "processing_time_seconds": 90,
    
    "detection_result": {
      "is_deepfake": true,
      "confidence": 0.94,
      "model_scores": {
        "xception": 0.96,
        "efficientnet": 0.92,
        "vit": 0.91
      },
      "detection_model": "Ensemble(XceptionNet+EfficientNet-B7+ViT)"
    },
    
    "hash_result": {
      "hash_id": "8d0f7780-8536-51ef-055c-f18cd2e01bf8",
      "hash_value": "f8f8f0cce0f4e84d0e370a22028f33c0fad6f8f8f0cce0f4e84d0e370a22028f",
      "hash_type": "pdq",
      "quality": 87
    },
    
    "match_results": {
      "matches_found": true,
      "match_count": 2,
      "matches": [
        {
          "matched_hash_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "similarity_score": 0.89,
          "hamming_distance": 18,
          "match_type": "near_match",
          "created_at": "2025-01-15T10:00:00Z",
          "report_count": 3
        }
      ]
    },
    
    "media_info": {
      "file_type": "image",
      "file_extension": "jpg",
      "file_size_bytes": 2485760,
      "resolution": "1920x1080"
    }
  }
}
```

**Errors:**
- `404`: Job not found
- `410`: Job expired (results deleted after 24 hours)

---

#### DELETE /analysis/{job_id}

Cancel ongoing analysis or delete results.

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Analysis cancelled and data deleted."
}
```

---

### 3. Reports & Takedowns

#### POST /reports/submit

Submit a report for NCII or deepfake content.

**Request:**
```json
{
  "media_hash_id": "8d0f7780-8536-51ef-055c-f18cd2e01bf8",
  "report_type": "ncii",
  "description": "Non-consensual intimate images posted without permission",
  "evidence_urls": [
    "https://twitter.com/abuser/status/123456789",
    "https://imgur.com/abc123"
  ],
  "platform_names": ["Twitter", "Imgur"],
  "victim_consent_obtained": true,
  "priority": "high",
  "victim_info": {
    "name": "Jane Doe",
    "contact_email": "victim@example.com"
  }
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "status": "pending",
    "priority": "high",
    "created_at": "2025-02-10T15:00:00Z",
    "estimated_review_time_hours": 24
  },
  "message": "Report submitted successfully. You will receive updates via email."
}
```

**Errors:**
- `400`: Missing required fields or invalid hash ID
- `409`: Duplicate report for same content

---

#### GET /reports/{report_id}

Get report status and details.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "status": "under_review",
    "priority": "high",
    "report_type": "ncii",
    "created_at": "2025-02-10T15:00:00Z",
    "updated_at": "2025-02-10T16:30:00Z",
    
    "media_hash_id": "8d0f7780-8536-51ef-055c-f18cd2e01bf8",
    "evidence_urls": [
      "https://twitter.com/abuser/status/123456789"
    ],
    "platform_names": ["Twitter"],
    
    "takedown_requests": [
      {
        "takedown_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "platform_name": "Twitter",
        "status": "sent",
        "sent_at": "2025-02-11T10:00:00Z"
      }
    ],
    
    "timeline": [
      {
        "timestamp": "2025-02-10T15:00:00Z",
        "event": "report_submitted",
        "description": "Report submitted by user"
      },
      {
        "timestamp": "2025-02-10T16:30:00Z",
        "event": "review_started",
        "description": "Report assigned to moderator"
      }
    ]
  }
}
```

---

#### GET /reports

List user's reports with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status (pending, under_review, approved, rejected)
- `priority`: Filter by priority (low, medium, high, urgent)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "reports": [
      {
        "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "status": "under_review",
        "priority": "high",
        "report_type": "ncii",
        "created_at": "2025-02-10T15:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_items": 5,
      "total_pages": 1
    }
  }
}
```

---

#### POST /reports/{report_id}/appeal

Appeal a rejected report.

**Request:**
```json
{
  "appeal_reason": "Additional evidence provided",
  "new_evidence_urls": [
    "https://example.com/additional-proof"
  ]
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "status": "under_review",
    "appeal_submitted_at": "2025-02-15T10:00:00Z"
  },
  "message": "Appeal submitted successfully."
}
```

---

### 4. Match Checking

#### POST /match/check

Check if a hash matches existing content (for platforms integrating the system).

**Request:**
```json
{
  "hash_value": "f8f8f0cce0f4e84d0e370a22028f33c0fad6f8f8f0cce0f4e84d0e370a22028f",
  "hash_type": "pdq",
  "threshold": 31
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "matches_found": true,
    "match_count": 1,
    "matches": [
      {
        "match_type": "near_match",
        "similarity_score": 0.89,
        "hamming_distance": 18,
        "report_count": 3,
        "first_reported_at": "2025-01-15T10:00:00Z",
        "action_recommended": "block"
      }
    ]
  }
}
```

**Response (No matches):**
```json
{
  "status": "success",
  "data": {
    "matches_found": false,
    "match_count": 0
  }
}
```

---

### 5. Evidence Generation

#### GET /evidence/{report_id}

Generate evidence package for legal proceedings.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "evidence_package_id": "e1f2g3h4-i5j6-7890-klmn-opqrstuvwxyz",
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "generated_at": "2025-02-11T14:00:00Z",
    "download_url": "https://evidence-storage.s3.amazonaws.com/packages/e1f2g3h4.zip",
    "download_expires_at": "2025-02-18T14:00:00Z",
    "password": "SecurePass789!",
    
    "contents": {
      "report_summary": "report_b2c3d4e5.pdf",
      "hash_certificate": "hash_certificate.pdf",
      "timeline": "timeline.json",
      "platform_responses": "platform_responses.json",
      "metadata": "metadata.json"
    },
    
    "hash_verification": {
      "hash_value": "f8f8f0cce0f4e84d0e370a22028f33c0fad6f8f8f0cce0f4e84d0e370a22028f",
      "hash_algorithm": "PDQ",
      "generated_at": "2025-02-10T14:21:30Z",
      "chain_of_custody": [
        {
          "timestamp": "2025-02-10T14:21:30Z",
          "action": "hash_generated",
          "actor": "system"
        }
      ]
    }
  },
  "message": "Evidence package ready for download."
}
```

**Notes:**
- Evidence packages are encrypted with password
- Download links expire after 7 days
- Chain of custody maintained for legal validity

---

### 6. Admin Endpoints (Moderators/Admins Only)

#### GET /admin/reports/queue

Get pending reports queue for review.

**Query Parameters:**
- `priority`: Filter by priority
- `limit`: Items per page

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "queue_size": 42,
    "reports": [
      {
        "report_id": "...",
        "priority": "urgent",
        "report_type": "ncii",
        "created_at": "2025-02-10T15:00:00Z",
        "waiting_time_hours": 2
      }
    ]
  }
}
```

---

#### POST /admin/reports/{report_id}/review

Review and approve/reject a report.

**Request:**
```json
{
  "decision": "approved",
  "review_notes": "Valid NCII report. Proceeding with takedown.",
  "create_takedown": true,
  "platforms": ["Twitter", "Imgur"]
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "status": "approved",
    "reviewed_at": "2025-02-11T09:00:00Z",
    "takedown_requests_created": 2
  },
  "message": "Report approved. Takedown requests sent."
}
```

---

#### GET /admin/stats/dashboard

Get platform statistics dashboard.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "period": "last_30_days",
    
    "uploads": {
      "total": 15420,
      "deepfakes_detected": 3214,
      "detection_rate": 20.8
    },
    
    "reports": {
      "total_submitted": 856,
      "pending": 42,
      "under_review": 18,
      "approved": 672,
      "rejected": 124,
      "avg_review_time_hours": 6.5
    },
    
    "takedowns": {
      "total_requested": 892,
      "completed": 745,
      "pending": 89,
      "failed": 58,
      "success_rate": 83.5
    },
    
    "matches": {
      "reuploads_blocked": 1247,
      "unique_hashes": 8931
    },
    
    "users": {
      "total_active": 12480,
      "new_registrations": 342
    }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "request_id": "req_7c9e6679",
  "timestamp": "2025-02-10T14:20:00Z"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)
- `SERVICE_UNAVAILABLE` (503)

---

## Rate Limiting

**Rate Limits:**
- **Authentication**: 5 requests/minute
- **Uploads**: 10 uploads/hour, 100/day per user
- **API calls**: 1000 requests/hour per user
- **Anonymous**: 10 requests/minute per IP

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 856
X-RateLimit-Reset: 1644508800
```

---

## WebSocket API

### Connect to Job Updates

**URL:** `wss://api.stopncii-platform.com/ws/job/{job_id}`

**Authentication:** 
```
?token=<jwt_token>
```

**Example:**
```javascript
const ws = new WebSocket(
  'wss://api.stopncii-platform.com/ws/job/7c9e6679?token=' + token
);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Progress:', data.progress, '%');
  console.log('Step:', data.current_step);
};
```

**Message Format:**
```json
{
  "type": "progress",
  "job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "progress": 75,
  "current_step": "Running deepfake detection",
  "estimated_time_remaining_seconds": 10
}
```

**Completion Message:**
```json
{
  "type": "completed",
  "job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "result": {
    "detection_result": { ... },
    "hash_result": { ... },
    "match_results": { ... }
  }
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (starts at 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 156,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```

---

## Webhooks (Optional)

Platforms can register webhooks to receive real-time notifications.

### POST /webhooks/register

**Request:**
```json
{
  "url": "https://platform.com/ncii-webhook",
  "events": ["report.approved", "takedown.completed"],
  "secret": "webhook_secret_key"
}
```

### Webhook Payload Example

```json
{
  "event": "report.approved",
  "timestamp": "2025-02-11T09:00:00Z",
  "data": {
    "report_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "platform_name": "Twitter",
    "platform_content_id": "123456789",
    "action_required": "remove_content"
  },
  "signature": "sha256=..."
}
```

**Signature Verification:**
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## SDK Examples

### Python SDK

```python
from stopncii_client import StopNCIIClient

client = StopNCIIClient(api_key="your_api_key")

# Upload and analyze
job = client.upload_file("path/to/image.jpg")
print(f"Job ID: {job.id}")

# Wait for completion
result = job.wait_for_completion()

if result.is_deepfake:
    print(f"Deepfake detected! Confidence: {result.confidence}")

# Check for matches
if result.matches_found:
    print(f"Found {len(result.matches)} similar content")
    
# Submit report
report = client.submit_report(
    media_hash_id=result.hash_id,
    report_type="deepfake",
    evidence_urls=["https://example.com/fake-video"]
)

print(f"Report ID: {report.id}")
```

### JavaScript SDK

```javascript
import StopNCIIClient from '@stopncii/client';

const client = new StopNCIIClient({ apiKey: 'your_api_key' });

// Upload and analyze
const job = await client.uploadFile(file);

// Listen for progress
job.on('progress', (data) => {
  console.log(`Progress: ${data.progress}%`);
});

// Wait for completion
const result = await job.waitForCompletion();

if (result.isDeepfake) {
  console.log(`Deepfake detected! Confidence: ${result.confidence}`);
}

// Submit report
const report = await client.submitReport({
  mediaHashId: result.hashId,
  reportType: 'deepfake',
  evidenceUrls: ['https://example.com/fake-video']
});

console.log(`Report ID: ${report.id}`);
```

---

## Testing

### Swagger UI
**URL:** `https://api.stopncii-platform.com/docs`

### ReDoc
**URL:** `https://api.stopncii-platform.com/redoc`

### Postman Collection
Download: `https://api.stopncii-platform.com/postman/collection.json`

---

## Support

**Documentation:** https://docs.stopncii-platform.com  
**API Status:** https://status.stopncii-platform.com  
**Support:** support@stopncii-platform.com  
**GitHub:** https://github.com/stopncii/platform
