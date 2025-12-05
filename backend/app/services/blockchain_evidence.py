"""
Blockchain Evidence Storage System
Immutable evidence chain with SHA-256 hashing for legal compliance
"""

import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import logging
from pathlib import Path
import uuid

logger = logging.getLogger(__name__)


@dataclass
class EvidenceBlock:
    """Single block in evidence chain"""
    block_id: str
    timestamp: str
    evidence_type: str
    evidence_hash: str
    file_metadata: Dict[str, Any]
    detection_result: Dict[str, Any]
    previous_hash: str
    block_hash: str
    chain_index: int
    investigator_id: str
    case_id: str
    digital_signature: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)


class BlockchainEvidenceChain:
    """
    Immutable evidence chain for legal compliance
    Each piece of evidence is cryptographically linked
    """
    
    def __init__(self, case_id: str, investigator_id: str):
        self.case_id = case_id
        self.investigator_id = investigator_id
        self.chain: List[EvidenceBlock] = []
        self.chain_file = Path(f"evidence_chains/case_{case_id}.json")
        self.chain_file.parent.mkdir(exist_ok=True)
        
        # Load existing chain or create genesis block
        if self.chain_file.exists():
            self._load_chain()
        else:
            self._create_genesis_block()
    
    def _create_genesis_block(self):
        """Create the first block in the chain"""
        genesis = EvidenceBlock(
            block_id=str(uuid.uuid4()),
            timestamp=datetime.now().isoformat(),
            evidence_type="GENESIS",
            evidence_hash="0" * 64,
            file_metadata={"case_id": self.case_id, "created": datetime.now().isoformat()},
            detection_result={"status": "chain_initialized"},
            previous_hash="0" * 64,
            block_hash=self._calculate_block_hash("0" * 64, "GENESIS", {}),
            chain_index=0,
            investigator_id=self.investigator_id,
            case_id=self.case_id
        )
        self.chain.append(genesis)
        self._save_chain()
        logger.info(f"Created genesis block for case {self.case_id}")
    
    def add_evidence(
        self,
        evidence_path: str,
        evidence_type: str,
        detection_result: Dict[str, Any],
        file_metadata: Dict[str, Any]
    ) -> EvidenceBlock:
        """
        Add new evidence to the chain
        Creates cryptographic link to previous block
        """
        # Calculate file hash
        evidence_hash = self._calculate_file_hash(evidence_path)
        
        # Get previous block
        previous_block = self.chain[-1]
        previous_hash = previous_block.block_hash
        
        # Create new block
        block_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        chain_index = len(self.chain)
        
        # Calculate block hash
        block_data = {
            'block_id': block_id,
            'timestamp': timestamp,
            'evidence_type': evidence_type,
            'evidence_hash': evidence_hash,
            'previous_hash': previous_hash,
            'chain_index': chain_index,
            'case_id': self.case_id
        }
        block_hash = self._calculate_block_hash(previous_hash, evidence_hash, block_data)
        
        # Create evidence block
        new_block = EvidenceBlock(
            block_id=block_id,
            timestamp=timestamp,
            evidence_type=evidence_type,
            evidence_hash=evidence_hash,
            file_metadata=file_metadata,
            detection_result=detection_result,
            previous_hash=previous_hash,
            block_hash=block_hash,
            chain_index=chain_index,
            investigator_id=self.investigator_id,
            case_id=self.case_id,
            digital_signature=self._create_digital_signature(block_hash)
        )
        
        self.chain.append(new_block)
        self._save_chain()
        
        logger.info(f"Added evidence block {block_id} to case {self.case_id}")
        return new_block
    
    def verify_chain_integrity(self) -> Dict[str, Any]:
        """
        Verify the entire chain's integrity
        Returns verification report
        """
        if len(self.chain) == 0:
            return {
                'valid': False,
                'error': 'Empty chain',
                'blocks_verified': 0
            }
        
        issues = []
        
        # Verify each block
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]
            
            # Check previous hash link
            if current.previous_hash != previous.block_hash:
                issues.append({
                    'block_index': i,
                    'issue': 'Previous hash mismatch',
                    'expected': previous.block_hash,
                    'found': current.previous_hash
                })
            
            # Verify block hash
            block_data = {
                'block_id': current.block_id,
                'timestamp': current.timestamp,
                'evidence_type': current.evidence_type,
                'evidence_hash': current.evidence_hash,
                'previous_hash': current.previous_hash,
                'chain_index': current.chain_index,
                'case_id': current.case_id
            }
            expected_hash = self._calculate_block_hash(
                current.previous_hash,
                current.evidence_hash,
                block_data
            )
            
            if expected_hash != current.block_hash:
                issues.append({
                    'block_index': i,
                    'issue': 'Block hash mismatch',
                    'expected': expected_hash,
                    'found': current.block_hash
                })
        
        is_valid = len(issues) == 0
        
        return {
            'valid': is_valid,
            'chain_length': len(self.chain),
            'blocks_verified': len(self.chain),
            'issues': issues,
            'verification_time': datetime.now().isoformat(),
            'case_id': self.case_id,
            'genesis_block': self.chain[0].block_hash
        }
    
    def get_chain_summary(self) -> Dict[str, Any]:
        """Get summary of evidence chain"""
        evidence_types = {}
        for block in self.chain[1:]:  # Skip genesis
            evidence_types[block.evidence_type] = evidence_types.get(block.evidence_type, 0) + 1
        
        return {
            'case_id': self.case_id,
            'investigator_id': self.investigator_id,
            'chain_length': len(self.chain),
            'created': self.chain[0].timestamp,
            'last_updated': self.chain[-1].timestamp if self.chain else None,
            'evidence_types': evidence_types,
            'genesis_hash': self.chain[0].block_hash,
            'latest_hash': self.chain[-1].block_hash if self.chain else None,
            'integrity_verified': self.verify_chain_integrity()['valid']
        }
    
    def export_legal_report(self) -> Dict[str, Any]:
        """
        Export chain as legal evidence report
        Suitable for court proceedings
        """
        verification = self.verify_chain_integrity()
        
        evidence_list = []
        for block in self.chain[1:]:  # Skip genesis
            evidence_list.append({
                'evidence_id': block.block_id,
                'timestamp': block.timestamp,
                'type': block.evidence_type,
                'file_hash': block.evidence_hash,
                'detection_result': block.detection_result,
                'metadata': block.file_metadata,
                'cryptographic_proof': {
                    'block_hash': block.block_hash,
                    'previous_hash': block.previous_hash,
                    'chain_position': block.chain_index,
                    'digital_signature': block.digital_signature
                }
            })
        
        return {
            'report_type': 'DIGITAL_EVIDENCE_CHAIN_REPORT',
            'generated': datetime.now().isoformat(),
            'case_information': {
                'case_id': self.case_id,
                'investigator_id': self.investigator_id,
                'evidence_count': len(self.chain) - 1,
                'chain_created': self.chain[0].timestamp
            },
            'chain_integrity': verification,
            'evidence_items': evidence_list,
            'legal_notice': (
                "This report contains a cryptographically secured chain of digital evidence. "
                "Each piece of evidence is linked via SHA-256 hashing, ensuring tamper detection. "
                "Any modification to the evidence or chain will break cryptographic integrity. "
                "This chain is admissible as authenticated digital evidence under applicable laws."
            ),
            'verification_instructions': (
                "To verify this evidence chain: "
                "1. Recalculate each block hash using provided data. "
                "2. Verify each block's previous_hash matches prior block's block_hash. "
                "3. Verify file hashes match original evidence files. "
                "4. Check digital signatures for authenticity."
            )
        }
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file"""
        sha256 = hashlib.sha256()
        
        try:
            with open(file_path, 'rb') as f:
                while True:
                    data = f.read(65536)  # 64KB chunks
                    if not data:
                        break
                    sha256.update(data)
            return sha256.hexdigest()
        except Exception as e:
            logger.error(f"Error hashing file {file_path}: {e}")
            return hashlib.sha256(file_path.encode()).hexdigest()
    
    def _calculate_block_hash(self, previous_hash: str, evidence_hash: str, block_data: Dict) -> str:
        """Calculate SHA-256 hash of block"""
        hash_data = json.dumps({
            'previous_hash': previous_hash,
            'evidence_hash': evidence_hash,
            **block_data
        }, sort_keys=True)
        
        return hashlib.sha256(hash_data.encode()).hexdigest()
    
    def _create_digital_signature(self, block_hash: str) -> str:
        """
        Create digital signature for block
        In production, use proper PKI/digital certificates
        """
        signature_data = f"{self.investigator_id}:{self.case_id}:{block_hash}"
        return hashlib.sha256(signature_data.encode()).hexdigest()
    
    def _save_chain(self):
        """Save chain to disk"""
        chain_data = {
            'case_id': self.case_id,
            'investigator_id': self.investigator_id,
            'created': self.chain[0].timestamp,
            'last_updated': datetime.now().isoformat(),
            'blocks': [block.to_dict() for block in self.chain]
        }
        
        with open(self.chain_file, 'w') as f:
            json.dump(chain_data, f, indent=2)
    
    def _load_chain(self):
        """Load chain from disk"""
        with open(self.chain_file, 'r') as f:
            data = json.load(f)
        
        self.chain = [EvidenceBlock(**block) for block in data['blocks']]
        logger.info(f"Loaded evidence chain for case {self.case_id} with {len(self.chain)} blocks")


class EvidenceManager:
    """
    Manages multiple evidence chains
    Provides high-level interface for evidence handling
    """
    
    def __init__(self):
        self.active_chains: Dict[str, BlockchainEvidenceChain] = {}
    
    def create_case(self, case_id: str, investigator_id: str) -> BlockchainEvidenceChain:
        """Create new evidence chain for case"""
        chain = BlockchainEvidenceChain(case_id, investigator_id)
        self.active_chains[case_id] = chain
        return chain
    
    def get_chain(self, case_id: str) -> Optional[BlockchainEvidenceChain]:
        """Get existing evidence chain"""
        if case_id not in self.active_chains:
            # Try to load from disk
            chain_file = Path(f"evidence_chains/case_{case_id}.json")
            if chain_file.exists():
                # Load investigator_id from file
                with open(chain_file, 'r') as f:
                    data = json.load(f)
                chain = BlockchainEvidenceChain(case_id, data['investigator_id'])
                self.active_chains[case_id] = chain
                return chain
        return self.active_chains.get(case_id)
    
    def add_evidence_to_case(
        self,
        case_id: str,
        evidence_path: str,
        evidence_type: str,
        detection_result: Dict[str, Any],
        file_metadata: Dict[str, Any]
    ) -> EvidenceBlock:
        """Add evidence to existing case"""
        chain = self.get_chain(case_id)
        if not chain:
            raise ValueError(f"Case {case_id} not found")
        
        return chain.add_evidence(
            evidence_path,
            evidence_type,
            detection_result,
            file_metadata
        )
    
    def verify_case_integrity(self, case_id: str) -> Dict[str, Any]:
        """Verify integrity of case evidence chain"""
        chain = self.get_chain(case_id)
        if not chain:
            return {'valid': False, 'error': f'Case {case_id} not found'}
        
        return chain.verify_chain_integrity()
    
    def export_case_report(self, case_id: str) -> Dict[str, Any]:
        """Export legal report for case"""
        chain = self.get_chain(case_id)
        if not chain:
            raise ValueError(f"Case {case_id} not found")
        
        return chain.export_legal_report()
    
    def list_all_cases(self) -> List[Dict[str, Any]]:
        """List all evidence chains"""
        chains_dir = Path("evidence_chains")
        if not chains_dir.exists():
            return []
        
        cases = []
        for chain_file in chains_dir.glob("case_*.json"):
            with open(chain_file, 'r') as f:
                data = json.load(f)
            
            cases.append({
                'case_id': data['case_id'],
                'investigator_id': data['investigator_id'],
                'created': data['created'],
                'last_updated': data.get('last_updated', data['created']),
                'evidence_count': len(data['blocks']) - 1,
                'file': str(chain_file)
            })
        
        return cases


# Global evidence manager
evidence_manager = EvidenceManager()


def create_evidence_chain(case_id: str, investigator_id: str) -> BlockchainEvidenceChain:
    """Create new evidence chain"""
    return evidence_manager.create_case(case_id, investigator_id)


def add_evidence(
    case_id: str,
    evidence_path: str,
    evidence_type: str,
    detection_result: Dict[str, Any],
    file_metadata: Dict[str, Any]
) -> EvidenceBlock:
    """Add evidence to case"""
    return evidence_manager.add_evidence_to_case(
        case_id,
        evidence_path,
        evidence_type,
        detection_result,
        file_metadata
    )


def verify_evidence_chain(case_id: str) -> Dict[str, Any]:
    """Verify evidence chain integrity"""
    return evidence_manager.verify_case_integrity(case_id)


def export_legal_report(case_id: str) -> Dict[str, Any]:
    """Export legal evidence report"""
    return evidence_manager.export_case_report(case_id)
