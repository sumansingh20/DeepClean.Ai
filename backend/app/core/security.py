"""
Security utilities for A-DFP Firewall
JWT, encryption, hashing, and authentication
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import secrets
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class JWTManager:
    """Manage JWT token creation and verification"""
    
    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def create_access_token(
        self,
        user_id: str,
        role: str,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=24)
        
        to_encode = {
            "sub": user_id,
            "role": role,
            "exp": expire,
            "iat": datetime.utcnow(),
            "iss": "adfp-firewall",
            "aud": "adfp-api",
            "type": "access"
        }
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(
        self,
        user_id: str,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT refresh token"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=30)
        
        to_encode = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh"
        }
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode JWT"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"}
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"}
            )


class EncryptionManager:
    """Manage data encryption/decryption"""
    
    def __init__(self, master_key: str):
        # Derive encryption key from master key
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'adfp_firewall_salt_2024',  # In production, use random salt per instance
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(master_key.encode()))
        self.cipher = Fernet(key)
    
    def encrypt(self, data: str) -> str:
        """Encrypt string data"""
        try:
            encrypted = self.cipher.encrypt(data.encode())
            return encrypted.decode()
        except Exception as e:
            raise RuntimeError(f"Encryption failed: {str(e)}")
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt string data"""
        try:
            decrypted = self.cipher.decrypt(encrypted_data.encode())
            return decrypted.decode()
        except Exception as e:
            raise RuntimeError(f"Decryption failed: {str(e)}")
    
    def encrypt_pii(self, pii_data: str) -> str:
        """Encrypt personally identifiable information"""
        return self.encrypt(pii_data)
    
    def decrypt_pii(self, encrypted_pii: str) -> str:
        """Decrypt PII"""
        return self.decrypt(encrypted_pii)


class PasswordManager:
    """Manage password hashing and verification"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(plain_password, hashed_password)


class APIKeyManager:
    """Generate and validate API keys"""
    
    @staticmethod
    def generate_api_key(prefix: str = "adfp") -> str:
        """Generate secure API key"""
        return f"{prefix}_{secrets.token_urlsafe(32)}"
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash API key for storage"""
        return PasswordManager.hash_password(api_key)
    
    @staticmethod
    def verify_api_key(plain_key: str, hashed_key: str) -> bool:
        """Verify API key"""
        return PasswordManager.verify_password(plain_key, hashed_key)


class WebhookSignature:
    """Generate and verify webhook signatures"""
    
    @staticmethod
    def generate_signature(payload: bytes, secret: str) -> str:
        """Generate HMAC-SHA256 signature for webhook payload"""
        import hmac
        import hashlib
        return hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    
    @staticmethod
    def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
        """Verify webhook signature"""
        expected_signature = WebhookSignature.generate_signature(payload, secret)
        return secrets.compare_digest(signature, expected_signature)


class SessionToken:
    """Generate and manage session tokens"""
    
    @staticmethod
    def generate_session_token(length: int = 32) -> str:
        """Generate random session token"""
        return secrets.token_urlsafe(length)
    
    @staticmethod
    def generate_nonce() -> str:
        """Generate nonce for CSRF/anti-replay protection"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_challenge() -> str:
        """Generate random challenge for liveness test"""
        import random
        challenges = [
            "blink_twice",
            "turn_head_left",
            "turn_head_right",
            "say_adfp_firewall",
            "smile",
            "open_mouth"
        ]
        return random.choice(challenges)


# Global instances (create during app startup)
jwt_manager: Optional[JWTManager] = None
encryption_manager: Optional[EncryptionManager] = None


def init_security_managers(secret_key: str, encryption_key: str):
    """Initialize security managers during app startup"""
    global jwt_manager, encryption_manager
    jwt_manager = JWTManager(secret_key)
    encryption_manager = EncryptionManager(encryption_key)
