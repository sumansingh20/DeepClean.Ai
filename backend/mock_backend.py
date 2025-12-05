"""
Working FastAPI backend with mock authentication
This version works reliably. Real database version has bcrypt/import issues.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn

app = FastAPI(title="DeepClean AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@app.get("/")
async def root():
    return {"message": "DeepClean AI API is running", "version": "1.0.0"}

@app.post("/api/v1/auth/register", response_model=TokenResponse)
async def register(request: RegisterRequest):
    return TokenResponse(
        access_token=f"jwt_token_{request.username}_registered",
        user={
            "id": "user_new",
            "username": request.username,
            "email": request.email,
            "full_name": request.full_name or request.username,
            "role": "client"
        }
    )

@app.post("/api/v1/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    if request.email == "admin@deepclean.ai" and request.password == "admin123":
        return TokenResponse(
            access_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbl8xIiwicm9sZSI6ImFkbWluIn0.token",
            user={
                "id": "admin_1",
                "username": "admin",
                "email": request.email,
                "full_name": "Admin User",
                "role": "admin"
            }
        )
    elif request.email == "moderator@deepclean.ai" and request.password == "mod123":
        return TokenResponse(
            access_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2RfMSIsInJvbGUiOiJhbmFseXN0In0.token",
            user={
                "id": "mod_1",
                "username": "moderator",
                "email": request.email,
                "full_name": "Moderator User",
                "role": "analyst"
            }
        )
    else:
        return TokenResponse(
            access_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJjbGllbnQifQ.token",
            user={
                "id": "user_123",
                "username": "user",
                "email": request.email,
                "full_name": "Regular User",
                "role": "client"
            }
        )

@app.get("/api/v1/dashboard/stats")
async def get_stats():
    return {
        "totalAnalyses": 1247,
        "deepfakesDetected": 89,
        "successRate": 94.2,
        "avgProcessingTime": 1.9,
        "recentAnalyses": []
    }

@app.get("/api/v1/incidents")
async def get_incidents():
    return {
        "total": 45,
        "incidents": []
    }

if __name__ == "__main__":
    print("\n" + "="*50)
    print("  DeepClean AI - Mock Authentication Backend")
    print("  (Working version - no database required)")
    print("="*50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8001)
