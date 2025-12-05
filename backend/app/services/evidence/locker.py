"""
DeepClean AI - Evidence Locker System
Digital evidence management with chain-of-custody tracking
"""

import hashlib
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from enum import Enum
import json
import zipfile
import io
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS
# ============================================================================

class EvidenceType(str, Enum):
    """Types of digital evidence"""
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"
    SCREENSHOT = "screenshot"
    URL_ARCHIVE = "url_archive"
    METADATA = "metadata"
    ANALYSIS_REPORT = "analysis_report"
    TAKEDOWN_NOTICE = "takedown_notice"
    LEGAL_DOCUMENT = "legal_document"


class EvidenceStatus(str, Enum):
    """Evidence lifecycle status"""
    COLLECTED = "collected"
    VERIFIED = "verified"
    SEALED = "sealed"
    IN_CUSTODY = "in_custody"
    TRANSFERRED = "transferred"
    ARCHIVED = "archived"
    DESTROYED = "destroyed"


class AccessLevel(str, Enum):
    """Evidence access levels"""
    PUBLIC = "public"
    RESTRICTED = "restricted"
    CONFIDENTIAL = "confidential"
    TOP_SECRET = "top_secret"


# ============================================================================
# EVIDENCE ITEM
# ============================================================================

class EvidenceItem:
    """Individual piece of digital evidence"""
    
    def __init__(
        self,
        evidence_type: EvidenceType,
        file_data: bytes,
        filename: str,
        description: str,
        collected_by: str,
        case_id: str
    ):
        self.evidence_id = str(uuid.uuid4())
        self.evidence_type = evidence_type
        self.filename = filename
        self.description = description
        self.collected_by = collected_by
        self.case_id = case_id
        self.collected_at = datetime.utcnow()
        self.status = EvidenceStatus.COLLECTED
        self.access_level = AccessLevel.CONFIDENTIAL
        
        # Generate cryptographic hashes
        self.md5_hash = hashlib.md5(file_data).hexdigest()
        self.sha256_hash = hashlib.sha256(file_data).hexdigest()
        self.sha512_hash = hashlib.sha512(file_data).hexdigest()
        
        # File metadata
        self.file_size = len(file_data)
        self.file_data = file_data
        
        # Chain of custody
        self.custody_chain: List[CustodyEvent] = []
        self.access_log: List[AccessEvent] = []
        
        # Verification
        self.verified = False
        self.verified_by: Optional[str] = None
        self.verified_at: Optional[datetime] = None
        
        # Add initial custody event
        self._add_custody_event(
            action="COLLECTED",
            actor=collected_by,
            notes="Evidence collected"
        )
    
    def _add_custody_event(self, action: str, actor: str, notes: str):
        """Add chain-of-custody event"""
        event = CustodyEvent(
            action=action,
            actor=actor,
            timestamp=datetime.utcnow(),
            notes=notes,
            hash_before=self.sha256_hash
        )
        self.custody_chain.append(event)
    
    def verify_integrity(self, current_data: bytes) -> bool:
        """Verify evidence has not been tampered with"""
        current_hash = hashlib.sha256(current_data).hexdigest()
        return current_hash == self.sha256_hash
    
    def verify_evidence(self, verifier: str, notes: str = ""):
        """Mark evidence as verified by officer"""
        self.verified = True
        self.verified_by = verifier
        self.verified_at = datetime.utcnow()
        self.status = EvidenceStatus.VERIFIED
        
        self._add_custody_event(
            action="VERIFIED",
            actor=verifier,
            notes=f"Evidence verified. {notes}"
        )
    
    def seal_evidence(self, sealer: str, notes: str = ""):
        """Seal evidence (no further modifications allowed)"""
        self.status = EvidenceStatus.SEALED
        
        self._add_custody_event(
            action="SEALED",
            actor=sealer,
            notes=f"Evidence sealed. {notes}"
        )
    
    def transfer_custody(self, from_officer: str, to_officer: str, reason: str):
        """Transfer custody to another officer"""
        self._add_custody_event(
            action="TRANSFER",
            actor=from_officer,
            notes=f"Transferred from {from_officer} to {to_officer}. Reason: {reason}"
        )
        
        self._add_custody_event(
            action="RECEIVED",
            actor=to_officer,
            notes=f"Custody received from {from_officer}"
        )
    
    def log_access(self, accessor: str, purpose: str):
        """Log evidence access"""
        access = AccessEvent(
            accessor=accessor,
            timestamp=datetime.utcnow(),
            purpose=purpose,
            hash_verified=self.verify_integrity(self.file_data)
        )
        self.access_log.append(access)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "evidence_id": self.evidence_id,
            "evidence_type": self.evidence_type.value,
            "filename": self.filename,
            "description": self.description,
            "collected_by": self.collected_by,
            "collected_at": self.collected_at.isoformat(),
            "case_id": self.case_id,
            "status": self.status.value,
            "access_level": self.access_level.value,
            "hashes": {
                "md5": self.md5_hash,
                "sha256": self.sha256_hash,
                "sha512": self.sha512_hash
            },
            "file_size": self.file_size,
            "verified": self.verified,
            "verified_by": self.verified_by,
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "custody_chain_length": len(self.custody_chain),
            "access_log_length": len(self.access_log)
        }


# ============================================================================
# CUSTODY & ACCESS EVENTS
# ============================================================================

class CustodyEvent:
    """Chain-of-custody event"""
    
    def __init__(self, action: str, actor: str, timestamp: datetime, notes: str, hash_before: str):
        self.event_id = str(uuid.uuid4())
        self.action = action
        self.actor = actor
        self.timestamp = timestamp
        self.notes = notes
        self.hash_before = hash_before
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "action": self.action,
            "actor": self.actor,
            "timestamp": self.timestamp.isoformat(),
            "notes": self.notes,
            "hash_before": self.hash_before
        }


class AccessEvent:
    """Evidence access event"""
    
    def __init__(self, accessor: str, timestamp: datetime, purpose: str, hash_verified: bool):
        self.access_id = str(uuid.uuid4())
        self.accessor = accessor
        self.timestamp = timestamp
        self.purpose = purpose
        self.hash_verified = hash_verified
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "access_id": self.access_id,
            "accessor": self.accessor,
            "timestamp": self.timestamp.isoformat(),
            "purpose": self.purpose,
            "hash_verified": self.hash_verified
        }


# ============================================================================
# EVIDENCE LOCKER
# ============================================================================

class EvidenceLocker:
    """Main evidence locker system"""
    
    def __init__(self):
        self.evidence_items: Dict[str, EvidenceItem] = {}
        self.cases: Dict[str, EvidenceCase] = {}
    
    def add_evidence(
        self,
        evidence_type: EvidenceType,
        file_data: bytes,
        filename: str,
        description: str,
        collected_by: str,
        case_id: str
    ) -> str:
        """Add evidence to locker"""
        
        # Create case if doesn't exist
        if case_id not in self.cases:
            self.cases[case_id] = EvidenceCase(case_id)
        
        # Create evidence item
        evidence = EvidenceItem(
            evidence_type=evidence_type,
            file_data=file_data,
            filename=filename,
            description=description,
            collected_by=collected_by,
            case_id=case_id
        )
        
        # Store evidence
        self.evidence_items[evidence.evidence_id] = evidence
        self.cases[case_id].add_evidence(evidence.evidence_id)
        
        logger.info(f"Evidence {evidence.evidence_id} added to case {case_id}")
        
        return evidence.evidence_id
    
    def get_evidence(self, evidence_id: str) -> Optional[EvidenceItem]:
        """Retrieve evidence by ID"""
        return self.evidence_items.get(evidence_id)
    
    def verify_evidence(self, evidence_id: str, verifier: str, notes: str = "") -> bool:
        """Verify evidence"""
        evidence = self.get_evidence(evidence_id)
        if evidence:
            evidence.verify_evidence(verifier, notes)
            return True
        return False
    
    def seal_evidence(self, evidence_id: str, sealer: str, notes: str = "") -> bool:
        """Seal evidence"""
        evidence = self.get_evidence(evidence_id)
        if evidence:
            evidence.seal_evidence(sealer, notes)
            return True
        return False
    
    def transfer_custody(
        self,
        evidence_id: str,
        from_officer: str,
        to_officer: str,
        reason: str
    ) -> bool:
        """Transfer evidence custody"""
        evidence = self.get_evidence(evidence_id)
        if evidence:
            evidence.transfer_custody(from_officer, to_officer, reason)
            return True
        return False
    
    def access_evidence(self, evidence_id: str, accessor: str, purpose: str) -> Optional[bytes]:
        """Access evidence file"""
        evidence = self.get_evidence(evidence_id)
        if evidence:
            evidence.log_access(accessor, purpose)
            return evidence.file_data
        return None
    
    def get_case_evidence(self, case_id: str) -> List[EvidenceItem]:
        """Get all evidence for a case"""
        case = self.cases.get(case_id)
        if case:
            return [
                self.evidence_items[eid]
                for eid in case.evidence_ids
                if eid in self.evidence_items
            ]
        return []
    
    def export_evidence_package(
        self,
        case_id: str,
        exported_by: str,
        include_chain_of_custody: bool = True
    ) -> bytes:
        """Export complete evidence package as ZIP"""
        
        # Create in-memory ZIP
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
            
            case_evidence = self.get_case_evidence(case_id)
            
            # Add manifest
            manifest = {
                "case_id": case_id,
                "exported_by": exported_by,
                "exported_at": datetime.utcnow().isoformat(),
                "total_evidence_items": len(case_evidence),
                "evidence_items": []
            }
            
            # Add each evidence file
            for evidence in case_evidence:
                # Add file
                zipf.writestr(
                    f"evidence/{evidence.evidence_id}/{evidence.filename}",
                    evidence.file_data
                )
                
                # Add metadata
                metadata = evidence.to_dict()
                zipf.writestr(
                    f"evidence/{evidence.evidence_id}/metadata.json",
                    json.dumps(metadata, indent=2)
                )
                
                # Add chain of custody
                if include_chain_of_custody:
                    custody_report = {
                        "evidence_id": evidence.evidence_id,
                        "custody_chain": [event.to_dict() for event in evidence.custody_chain],
                        "access_log": [access.to_dict() for access in evidence.access_log]
                    }
                    zipf.writestr(
                        f"evidence/{evidence.evidence_id}/chain_of_custody.json",
                        json.dumps(custody_report, indent=2)
                    )
                
                manifest["evidence_items"].append(metadata)
            
            # Add case manifest
            zipf.writestr("manifest.json", json.dumps(manifest, indent=2))
            
            # Add integrity verification file
            integrity_data = {
                "package_created": datetime.utcnow().isoformat(),
                "evidence_hashes": {
                    e.evidence_id: {
                        "filename": e.filename,
                        "sha256": e.sha256_hash,
                        "md5": e.md5_hash
                    }
                    for e in case_evidence
                }
            }
            zipf.writestr("integrity_verification.json", json.dumps(integrity_data, indent=2))
        
        # Log export
        for evidence in case_evidence:
            evidence.log_access(exported_by, f"Evidence package export for case {case_id}")
        
        zip_buffer.seek(0)
        return zip_buffer.getvalue()
    
    def generate_chain_of_custody_report(self, evidence_id: str) -> str:
        """Generate chain-of-custody report"""
        evidence = self.get_evidence(evidence_id)
        if not evidence:
            return "Evidence not found"
        
        report = f"""
CHAIN OF CUSTODY REPORT
=======================

Evidence ID: {evidence.evidence_id}
Filename: {evidence.filename}
Type: {evidence.evidence_type.value}
Case ID: {evidence.case_id}

File Integrity:
--------------
MD5:    {evidence.md5_hash}
SHA256: {evidence.sha256_hash}
SHA512: {evidence.sha512_hash}

File Size: {evidence.file_size} bytes

Status: {evidence.status.value}
Access Level: {evidence.access_level.value}

Verification Status:
-------------------
Verified: {evidence.verified}
Verified By: {evidence.verified_by or 'Not yet verified'}
Verified At: {evidence.verified_at.isoformat() if evidence.verified_at else 'N/A'}

CUSTODY CHAIN:
==============
"""
        
        for i, event in enumerate(evidence.custody_chain, 1):
            report += f"""
Event #{i}:
  Action: {event.action}
  Actor: {event.actor}
  Timestamp: {event.timestamp.isoformat()}
  Notes: {event.notes}
  Hash Verified: {event.hash_before}
"""
        
        report += f"""

ACCESS LOG:
===========
Total Accesses: {len(evidence.access_log)}
"""
        
        for i, access in enumerate(evidence.access_log, 1):
            report += f"""
Access #{i}:
  Accessor: {access.accessor}
  Timestamp: {access.timestamp.isoformat()}
  Purpose: {access.purpose}
  Hash Verified: {access.hash_verified}
"""
        
        return report


# ============================================================================
# EVIDENCE CASE
# ============================================================================

class EvidenceCase:
    """Container for related evidence items"""
    
    def __init__(self, case_id: str):
        self.case_id = case_id
        self.created_at = datetime.utcnow()
        self.evidence_ids: List[str] = []
        self.case_officers: List[str] = []
        self.status = "active"
    
    def add_evidence(self, evidence_id: str):
        """Add evidence to case"""
        if evidence_id not in self.evidence_ids:
            self.evidence_ids.append(evidence_id)
    
    def add_officer(self, officer: str):
        """Add officer to case"""
        if officer not in self.case_officers:
            self.case_officers.append(officer)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "case_id": self.case_id,
            "created_at": self.created_at.isoformat(),
            "evidence_count": len(self.evidence_ids),
            "officers": self.case_officers,
            "status": self.status
        }


# ============================================================================
# GLOBAL EVIDENCE LOCKER INSTANCE
# ============================================================================

evidence_locker = EvidenceLocker()
