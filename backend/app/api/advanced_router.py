"""
Enhanced Deepfake Analysis API with Advanced Features
Real-time processing, blockchain evidence, forensic reports
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, FileResponse
import aiofiles
import os
from pathlib import Path
from typing import Optional, List, Dict, Any
import logging
from datetime import datetime
import uuid
import json
import asyncio

from app.services.advanced_detectors import get_advanced_detector, DetectionResult
from app.services.blockchain_evidence import (
    create_evidence_chain, add_evidence, verify_evidence_chain, export_legal_report
)
from app.services.report_generator import generate_forensic_report
from app.core.dependencies import get_current_user, get_db
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter()

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Active WebSocket connections for real-time updates
active_connections: Dict[str, WebSocket] = {}


# ============================================================================
# REAL-TIME VIDEO ANALYSIS WITH WEBSOCKET
# ============================================================================

@router.websocket("/ws/analyze/{session_id}")
async def websocket_analysis(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time analysis updates
    Client receives progress updates as analysis proceeds
    """
    await websocket.accept()
    active_connections[session_id] = websocket
    
    try:
        while True:
            # Keep connection alive and receive any client messages
            data = await websocket.receive_text()
            
            if data == "ping":
                await websocket.send_json({"type": "pong"})
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session {session_id}")
        if session_id in active_connections:
            del active_connections[session_id]


async def send_progress_update(session_id: str, progress: Dict[str, Any]):
    """Send progress update to connected WebSocket client"""
    if session_id in active_connections:
        try:
            await active_connections[session_id].send_json(progress)
        except Exception as e:
            logger.error(f"Error sending WebSocket update: {e}")
            if session_id in active_connections:
                del active_connections[session_id]


# ============================================================================
# ADVANCED VIDEO ANALYSIS
# ============================================================================

@router.post("/video/analyze-advanced", tags=["Advanced Analysis"])
async def analyze_video_advanced(
    file: UploadFile = File(...),
    case_id: Optional[str] = None,
    enable_blockchain: bool = True,
    generate_report: bool = True,
    current_user: Dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Advanced video deepfake analysis with:
    - Real ML detection algorithms (frequency, temporal, compression analysis)
    - Blockchain evidence storage
    - Forensic PDF report generation
    - Multiple detection methods combined
    """
    try:
        session_id = str(uuid.uuid4())
        if not case_id:
            case_id = f"CASE_{session_id[:8]}"
        
        # Send initial progress
        await send_progress_update(session_id, {
            "type": "progress",
            "stage": "upload",
            "progress": 0,
            "message": "Processing video upload..."
        })
        
        # Save uploaded file
        video_path = UPLOAD_DIR / f"video_{session_id}.mp4"
        async with aiofiles.open(video_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        file_metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "upload_time": datetime.now().isoformat(),
            "session_id": session_id
        }
        
        await send_progress_update(session_id, {
            "type": "progress",
            "stage": "analysis",
            "progress": 20,
            "message": "Running advanced detection algorithms..."
        })
        
        # Run advanced detection
        detector = get_advanced_detector('video')
        detection_result = detector.analyze_video(str(video_path))
        
        await send_progress_update(session_id, {
            "type": "progress",
            "stage": "analysis",
            "progress": 60,
            "message": "Analysis complete, processing results..."
        })
        
        # Blockchain evidence storage
        evidence_block = None
        evidence_chain_data = {}
        
        if enable_blockchain:
            await send_progress_update(session_id, {
                "type": "progress",
                "stage": "blockchain",
                "progress": 70,
                "message": "Creating blockchain evidence..."
            })
            
            # Create or get evidence chain
            from app.services.blockchain_evidence import evidence_manager
            chain = evidence_manager.get_chain(case_id)
            if not chain:
                chain = evidence_manager.create_case(case_id, current_user.get('user_id', 'system'))
            
            # Add evidence to chain
            evidence_block = add_evidence(
                case_id=case_id,
                evidence_path=str(video_path),
                evidence_type="VIDEO_ANALYSIS",
                detection_result={
                    "is_fake": detection_result.is_fake,
                    "confidence": detection_result.confidence,
                    "fake_probability": detection_result.fake_probability,
                    "anomalies": detection_result.anomalies_found
                },
                file_metadata=file_metadata
            )
            
            # Get chain summary
            evidence_chain_data = {
                "block_id": evidence_block.block_id,
                "block_hash": evidence_block.block_hash,
                "chain_index": evidence_block.chain_index,
                "timestamp": evidence_block.timestamp,
                "chain_integrity": verify_evidence_chain(case_id)
            }
        
        # Generate forensic report
        report_path = None
        if generate_report:
            await send_progress_update(session_id, {
                "type": "progress",
                "stage": "report",
                "progress": 85,
                "message": "Generating forensic report..."
            })
            
            analyst_info = {
                "name": current_user.get('name', 'System Analyst'),
                "organization": "DeepClean.AI",
                "credentials": "AI-Powered Forensic Analysis"
            }
            
            report_path = generate_forensic_report(
                case_id=case_id,
                detection_result={
                    "is_fake": detection_result.is_fake,
                    "confidence": detection_result.confidence,
                    "fake_probability": detection_result.fake_probability,
                    "real_probability": detection_result.real_probability,
                    "detection_method": detection_result.detection_method,
                    "analysis_details": detection_result.analysis_details,
                    "anomalies_found": detection_result.anomalies_found,
                    "forensic_metrics": detection_result.forensic_metrics,
                    "processing_time": detection_result.processing_time,
                    "timestamp": detection_result.timestamp
                },
                evidence_chain=evidence_chain_data,
                file_metadata=file_metadata,
                analyst_info=analyst_info
            )
        
        await send_progress_update(session_id, {
            "type": "complete",
            "stage": "complete",
            "progress": 100,
            "message": "Analysis complete!"
        })
        
        # Cleanup
        try:
            os.remove(video_path)
        except:
            pass
        
        return {
            "session_id": session_id,
            "case_id": case_id,
            "analysis_type": "advanced_video",
            "detection_result": {
                "is_fake": detection_result.is_fake,
                "confidence": detection_result.confidence,
                "fake_probability": detection_result.fake_probability,
                "real_probability": detection_result.real_probability,
                "detection_method": detection_result.detection_method
            },
            "anomalies_found": detection_result.anomalies_found,
            "forensic_metrics": detection_result.forensic_metrics,
            "processing_time": detection_result.processing_time,
            "evidence_chain": evidence_chain_data if enable_blockchain else None,
            "report_available": report_path is not None,
            "report_path": report_path,
            "timestamp": detection_result.timestamp
        }
        
    except Exception as e:
        logger.error(f"Error in advanced video analysis: {e}")
        await send_progress_update(session_id, {
            "type": "error",
            "stage": "error",
            "progress": 0,
            "message": f"Analysis failed: {str(e)}"
        })
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ADVANCED AUDIO ANALYSIS
# ============================================================================

@router.post("/audio/analyze-advanced", tags=["Advanced Analysis"])
async def analyze_audio_advanced(
    file: UploadFile = File(...),
    case_id: Optional[str] = None,
    enable_blockchain: bool = True,
    generate_report: bool = True,
    current_user: Dict = Depends(get_current_user)
):
    """
    Advanced audio deepfake analysis with:
    - Spectral analysis (MFCC, mel-spectrogram)
    - Prosody analysis
    - Phase consistency checking
    - Artifact detection
    - Blockchain evidence
    - Forensic reports
    """
    try:
        session_id = str(uuid.uuid4())
        if not case_id:
            case_id = f"CASE_{session_id[:8]}"
        
        # Save uploaded file
        audio_path = UPLOAD_DIR / f"audio_{session_id}.wav"
        async with aiofiles.open(audio_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        file_metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "upload_time": datetime.now().isoformat(),
            "session_id": session_id
        }
        
        # Run advanced detection
        detector = get_advanced_detector('audio')
        detection_result = detector.analyze_audio(str(audio_path))
        
        # Blockchain evidence
        evidence_chain_data = {}
        if enable_blockchain:
            from app.services.blockchain_evidence import evidence_manager
            chain = evidence_manager.get_chain(case_id)
            if not chain:
                chain = evidence_manager.create_case(case_id, current_user.get('user_id', 'system'))
            
            evidence_block = add_evidence(
                case_id=case_id,
                evidence_path=str(audio_path),
                evidence_type="AUDIO_ANALYSIS",
                detection_result={
                    "is_fake": detection_result.is_fake,
                    "confidence": detection_result.confidence,
                    "fake_probability": detection_result.fake_probability,
                    "anomalies": detection_result.anomalies_found
                },
                file_metadata=file_metadata
            )
            
            evidence_chain_data = {
                "block_id": evidence_block.block_id,
                "block_hash": evidence_block.block_hash,
                "chain_index": evidence_block.chain_index,
                "timestamp": evidence_block.timestamp,
                "chain_integrity": verify_evidence_chain(case_id)
            }
        
        # Generate report
        report_path = None
        if generate_report:
            analyst_info = {
                "name": current_user.get('name', 'System Analyst'),
                "organization": "DeepClean.AI",
                "credentials": "AI-Powered Forensic Analysis"
            }
            
            report_path = generate_forensic_report(
                case_id=case_id,
                detection_result={
                    "is_fake": detection_result.is_fake,
                    "confidence": detection_result.confidence,
                    "fake_probability": detection_result.fake_probability,
                    "real_probability": detection_result.real_probability,
                    "detection_method": detection_result.detection_method,
                    "analysis_details": detection_result.analysis_details,
                    "anomalies_found": detection_result.anomalies_found,
                    "forensic_metrics": detection_result.forensic_metrics,
                    "processing_time": detection_result.processing_time,
                    "timestamp": detection_result.timestamp
                },
                evidence_chain=evidence_chain_data,
                file_metadata=file_metadata,
                analyst_info=analyst_info
            )
        
        # Cleanup
        try:
            os.remove(audio_path)
        except:
            pass
        
        return {
            "session_id": session_id,
            "case_id": case_id,
            "analysis_type": "advanced_audio",
            "detection_result": {
                "is_fake": detection_result.is_fake,
                "confidence": detection_result.confidence,
                "fake_probability": detection_result.fake_probability,
                "real_probability": detection_result.real_probability,
                "detection_method": detection_result.detection_method
            },
            "anomalies_found": detection_result.anomalies_found,
            "forensic_metrics": detection_result.forensic_metrics,
            "processing_time": detection_result.processing_time,
            "evidence_chain": evidence_chain_data if enable_blockchain else None,
            "report_available": report_path is not None,
            "report_path": report_path,
            "timestamp": detection_result.timestamp
        }
        
    except Exception as e:
        logger.error(f"Error in advanced audio analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ADVANCED IMAGE ANALYSIS
# ============================================================================

@router.post("/image/analyze-advanced", tags=["Advanced Analysis"])
async def analyze_image_advanced(
    file: UploadFile = File(...),
    case_id: Optional[str] = None,
    enable_blockchain: bool = True,
    generate_report: bool = True,
    current_user: Dict = Depends(get_current_user)
):
    """
    Advanced image manipulation analysis with:
    - Error Level Analysis (ELA)
    - JPEG compression analysis
    - Noise inconsistency detection
    - Clone detection
    - Metadata examination
    - Blockchain evidence
    - Forensic reports
    """
    try:
        session_id = str(uuid.uuid4())
        if not case_id:
            case_id = f"CASE_{session_id[:8]}"
        
        # Save uploaded file
        image_path = UPLOAD_DIR / f"image_{session_id}.jpg"
        async with aiofiles.open(image_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        file_metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "upload_time": datetime.now().isoformat(),
            "session_id": session_id
        }
        
        # Run advanced detection
        detector = get_advanced_detector('image')
        detection_result = detector.analyze_image(str(image_path))
        
        # Blockchain evidence
        evidence_chain_data = {}
        if enable_blockchain:
            from app.services.blockchain_evidence import evidence_manager
            chain = evidence_manager.get_chain(case_id)
            if not chain:
                chain = evidence_manager.create_case(case_id, current_user.get('user_id', 'system'))
            
            evidence_block = add_evidence(
                case_id=case_id,
                evidence_path=str(image_path),
                evidence_type="IMAGE_ANALYSIS",
                detection_result={
                    "is_fake": detection_result.is_fake,
                    "confidence": detection_result.confidence,
                    "fake_probability": detection_result.fake_probability,
                    "anomalies": detection_result.anomalies_found
                },
                file_metadata=file_metadata
            )
            
            evidence_chain_data = {
                "block_id": evidence_block.block_id,
                "block_hash": evidence_block.block_hash,
                "chain_index": evidence_block.chain_index,
                "timestamp": evidence_block.timestamp,
                "chain_integrity": verify_evidence_chain(case_id)
            }
        
        # Generate report
        report_path = None
        if generate_report:
            analyst_info = {
                "name": current_user.get('name', 'System Analyst'),
                "organization": "DeepClean.AI",
                "credentials": "AI-Powered Forensic Analysis"
            }
            
            report_path = generate_forensic_report(
                case_id=case_id,
                detection_result={
                    "is_fake": detection_result.is_fake,
                    "confidence": detection_result.confidence,
                    "fake_probability": detection_result.fake_probability,
                    "real_probability": detection_result.real_probability,
                    "detection_method": detection_result.detection_method,
                    "analysis_details": detection_result.analysis_details,
                    "anomalies_found": detection_result.anomalies_found,
                    "forensic_metrics": detection_result.forensic_metrics,
                    "processing_time": detection_result.processing_time,
                    "timestamp": detection_result.timestamp
                },
                evidence_chain=evidence_chain_data,
                file_metadata=file_metadata,
                analyst_info=analyst_info
            )
        
        # Cleanup
        try:
            os.remove(image_path)
        except:
            pass
        
        return {
            "session_id": session_id,
            "case_id": case_id,
            "analysis_type": "advanced_image",
            "detection_result": {
                "is_fake": detection_result.is_fake,
                "confidence": detection_result.confidence,
                "fake_probability": detection_result.fake_probability,
                "real_probability": detection_result.real_probability,
                "detection_method": detection_result.detection_method
            },
            "anomalies_found": detection_result.anomalies_found,
            "forensic_metrics": detection_result.forensic_metrics,
            "processing_time": detection_result.processing_time,
            "evidence_chain": evidence_chain_data if enable_blockchain else None,
            "report_available": report_path is not None,
            "report_path": report_path,
            "timestamp": detection_result.timestamp
        }
        
    except Exception as e:
        logger.error(f"Error in advanced image analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# EVIDENCE CHAIN MANAGEMENT
# ============================================================================

@router.get("/evidence/chain/{case_id}", tags=["Evidence Management"])
async def get_evidence_chain(
    case_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Get complete evidence chain for a case"""
    chain_data = verify_evidence_chain(case_id)
    if not chain_data.get('valid'):
        return {"error": "Case not found or chain compromised", "data": chain_data}
    
    from app.services.blockchain_evidence import evidence_manager
    chain = evidence_manager.get_chain(case_id)
    if not chain:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    
    return chain.get_chain_summary()


@router.get("/evidence/verify/{case_id}", tags=["Evidence Management"])
async def verify_case_integrity(
    case_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Verify cryptographic integrity of evidence chain"""
    return verify_evidence_chain(case_id)


@router.get("/evidence/report/{case_id}", tags=["Evidence Management"])
async def get_legal_report(
    case_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Get legal evidence report suitable for court proceedings"""
    return export_legal_report(case_id)


@router.get("/report/download/{case_id}", tags=["Reports"])
async def download_forensic_report(
    case_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Download PDF forensic report"""
    from pathlib import Path
    reports_dir = Path("reports")
    
    # Find most recent report for this case
    report_files = list(reports_dir.glob(f"forensic_report_{case_id}_*.pdf"))
    if not report_files:
        raise HTTPException(status_code=404, detail="Report not found")
    
    latest_report = max(report_files, key=lambda p: p.stat().st_mtime)
    
    return FileResponse(
        path=str(latest_report),
        filename=latest_report.name,
        media_type="application/pdf"
    )


@router.get("/cases/list", tags=["Case Management"])
async def list_all_cases(current_user: Dict = Depends(get_current_user)):
    """List all evidence cases"""
    from app.services.blockchain_evidence import evidence_manager
    return evidence_manager.list_all_cases()
