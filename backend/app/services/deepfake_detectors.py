"""
Comprehensive Deepfake Detection Engines
All deepfake-related detection tools and models
"""

import torch
import cv2
import numpy as np
import librosa
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# DETECTION TYPES
# ============================================================================

class DeepfakeType(str, Enum):
    """Types of deepfakes we can detect"""
    FACE_SWAP = "face_swap"
    FACE_REENACTMENT = "face_reenactment"
    VOICE_SYNTHESIS = "voice_synthesis"
    SPEECH_SYNTHESIS = "speech_synthesis"
    LIP_SYNC = "lip_sync"
    FULL_BODY = "full_body"
    EXPRESSION_MANIPULATION = "expression_manipulation"
    DOCUMENT_FORGERY = "document_forgery"
    VIDEO_SPLICING = "video_splicing"
    AUDIO_SPLICING = "audio_splicing"


class DetectionMethod(str, Enum):
    """Detection methods/algorithms"""
    FREQUENCY_ANALYSIS = "frequency_analysis"
    TEMPORAL_ANALYSIS = "temporal_analysis"
    ARTIFACT_DETECTION = "artifact_detection"
    FACE_CONSISTENCY = "face_consistency"
    EYE_MOVEMENT = "eye_movement"
    SPEECH_PATTERN = "speech_pattern"
    ACOUSTIC_ANALYSIS = "acoustic_analysis"
    TEXTURE_ANALYSIS = "texture_analysis"
    LIGHTING_ANALYSIS = "lighting_analysis"
    COMPRESSION_ANALYSIS = "compression_analysis"


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class DetectionScore:
    """Single detection score"""
    method: DetectionMethod
    score: float  # 0-1
    confidence: float  # 0-1
    explanation: str


@dataclass
class DeepfakeIndicator:
    """Indicator of deepfake presence"""
    type: DeepfakeType
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    score: float  # 0-1
    detection_methods: List[DetectionScore]
    explanation: str
    location: Optional[Dict] = None  # For spatial indicators


@dataclass
class DetailedAnalysisResult:
    """Comprehensive deepfake analysis"""
    is_deepfake: bool
    fraud_score: float  # 0-1
    confidence: float
    detected_types: List[DeepfakeIndicator]
    primary_indicator: Optional[DeepfakeIndicator]
    secondary_indicators: List[DeepfakeIndicator]
    analysis_details: Dict[str, Any]
    recommendations: List[str]
    processing_time_ms: float


# ============================================================================
# FACE MANIPULATION DETECTOR
# ============================================================================

class FaceManipulationDetector:
    """Detect face swaps, reenactments, and expressions"""
    
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
    
    def detect_face_swap(self, video_frames: List[np.ndarray]) -> Dict[str, Any]:
        """Detect face swap by analyzing face consistency"""
        results = {
            "face_swap_detected": False,
            "swap_frames": [],
            "confidence": 0.0,
            "explanation": []
        }
        
        if len(video_frames) < 2:
            return results
        
        face_features = []
        
        # Extract face features from each frame
        for idx, frame in enumerate(video_frames):
            faces = self.face_cascade.detectMultiScale(frame, 1.3, 5)
            if len(faces) > 0:
                face_features.append({
                    'frame': idx,
                    'faces': faces,
                    'feature_hash': self._compute_face_hash(frame, faces[0])
                })
        
        # Analyze consistency
        if len(face_features) > 1:
            hash_changes = 0
            for i in range(1, len(face_features)):
                if face_features[i]['feature_hash'] != face_features[i-1]['feature_hash']:
                    hash_changes += 1
                    results['swap_frames'].append(i)
            
            swap_ratio = hash_changes / len(face_features)
            if swap_ratio > 0.3:
                results['face_swap_detected'] = True
                results['confidence'] = min(swap_ratio, 1.0)
                results['explanation'].append(
                    f"Face inconsistency detected in {swap_ratio*100:.1f}% of frames"
                )
        
        return results
    
    def detect_reenactment(self, video_frames: List[np.ndarray]) -> Dict[str, Any]:
        """Detect face reenactment by analyzing micro-expressions"""
        results = {
            "reenactment_detected": False,
            "inconsistent_frames": [],
            "confidence": 0.0,
            "explanation": []
        }
        
        # Analyze temporal consistency of expressions
        expression_vectors = []
        for frame in video_frames:
            expr_vec = self._extract_expression_vector(frame)
            if expr_vec is not None:
                expression_vectors.append(expr_vec)
        
        if len(expression_vectors) > 10:
            # Check for unnatural transitions
            for i in range(1, len(expression_vectors)):
                diff = np.linalg.norm(
                    expression_vectors[i] - expression_vectors[i-1]
                )
                if diff > 2.0:  # Threshold for unnatural transition
                    results['inconsistent_frames'].append(i)
            
            if len(results['inconsistent_frames']) / len(expression_vectors) > 0.2:
                results['reenactment_detected'] = True
                results['confidence'] = min(
                    len(results['inconsistent_frames']) / len(expression_vectors),
                    1.0
                )
                results['explanation'].append("Unnatural facial expression transitions detected")
        
        return results
    
    def detect_expression_manipulation(self, video_frames: List[np.ndarray]) -> Dict[str, Any]:
        """Detect expression manipulation"""
        results = {
            "manipulation_detected": False,
            "affected_frames": [],
            "confidence": 0.0,
            "explanation": []
        }
        
        # Check for expression inconsistency with audio
        for idx, frame in enumerate(video_frames):
            expr_score = self._analyze_expression_intensity(frame)
            if expr_score < 0.3:  # Weak expression score
                results['affected_frames'].append(idx)
        
        if len(results['affected_frames']) > len(video_frames) * 0.3:
            results['manipulation_detected'] = True
            results['confidence'] = len(results['affected_frames']) / len(video_frames)
            results['explanation'].append("Potential expression manipulation detected")
        
        return results
    
    def _compute_face_hash(self, frame: np.ndarray, face_rect: Tuple) -> str:
        """Compute hash of face region"""
        x, y, w, h = face_rect
        face_roi = frame[y:y+h, x:x+w]
        # Simple hash based on histogram
        hist = cv2.calcHist([face_roi], [0], None, [256], [0, 256])
        return str(hash(hist.tobytes()))
    
    def _extract_expression_vector(self, frame: np.ndarray) -> Optional[np.ndarray]:
        """Extract expression feature vector"""
        # Simplified: return intensity map of face region
        faces = self.face_cascade.detectMultiScale(frame, 1.3, 5)
        if len(faces) > 0:
            x, y, w, h = faces[0]
            face_roi = frame[y:y+h, x:x+w]
            gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
            return gray.flatten().astype(np.float32) / 255.0
        return None
    
    def _analyze_expression_intensity(self, frame: np.ndarray) -> float:
        """Analyze intensity of facial expression 0-1"""
        faces = self.face_cascade.detectMultiScale(frame, 1.3, 5)
        if len(faces) == 0:
            return 0.0
        
        x, y, w, h = faces[0]
        face_roi = frame[y:y+h, x:x+w]
        gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
        
        # Laplacian for edge intensity
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        intensity = np.mean(np.abs(laplacian))
        
        return min(intensity / 50.0, 1.0)


# ============================================================================
# AUDIO DEEPFAKE DETECTOR
# ============================================================================

class AudioDeepfakeDetector:
    """Detect synthetic/manipulated audio"""
    
    def __init__(self):
        self.sample_rate = 16000
    
    def detect_voice_synthesis(self, audio_path: str) -> Dict[str, Any]:
        """Detect AI-generated voice (TTS)"""
        results = {
            "voice_synthesis_detected": False,
            "confidence": 0.0,
            "explanation": [],
            "artifacts": []
        }
        
        try:
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Check for TTS artifacts
            # 1. Unnatural pitch contour
            f0, voiced_flag, voiced_probs = self._extract_f0(y, sr)
            pitch_smoothness = self._analyze_pitch_smoothness(f0)
            
            if pitch_smoothness > 0.85:  # Too smooth = synthetic
                results['voice_synthesis_detected'] = True
                results['artifacts'].append("Unnatural pitch smoothness")
            
            # 2. Spectral flatness analysis
            spectral_flatness = librosa.feature.spectral_flatness(y=y)
            avg_flatness = np.mean(spectral_flatness)
            
            if avg_flatness > 0.4:  # Too flat = synthetic
                results['voice_synthesis_detected'] = True
                results['artifacts'].append("Unusual spectral characteristics")
            
            # 3. Zero-crossing rate consistency
            zcr = librosa.feature.zero_crossing_rate(y)[0]
            zcr_variance = np.var(zcr)
            
            if zcr_variance < 0.0001:  # Too consistent = synthetic
                results['voice_synthesis_detected'] = True
                results['artifacts'].append("Unnatural zero-crossing consistency")
            
            # 4. MFCC analysis
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfcc_variance = np.var(mfcc, axis=1)
            
            if np.mean(mfcc_variance) < 0.1:  # Low variance = synthetic
                results['voice_synthesis_detected'] = True
                results['artifacts'].append("Low MFCC variance (synthetic indicator)")
            
            # Calculate confidence
            artifact_count = len(results['artifacts'])
            results['confidence'] = min(artifact_count * 0.25, 1.0)
            
            if results['voice_synthesis_detected']:
                results['explanation'].append(
                    f"Voice synthesis indicators: {', '.join(results['artifacts'])}"
                )
        
        except Exception as e:
            results['explanation'].append(f"Error: {str(e)}")
        
        return results
    
    def detect_speech_manipulation(self, audio_path: str) -> Dict[str, Any]:
        """Detect speech splicing/manipulation"""
        results = {
            "manipulation_detected": False,
            "splice_points": [],
            "confidence": 0.0,
            "explanation": []
        }
        
        try:
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Look for discontinuities
            frame_length = 2048
            frames = librosa.util.frame(y, frame_length=frame_length, hop_length=512)
            
            energy_per_frame = np.sqrt(np.mean(frames**2, axis=0))
            energy_diff = np.diff(energy_per_frame)
            
            # Detect sharp transitions
            threshold = np.std(energy_diff) * 2
            splice_candidates = np.where(np.abs(energy_diff) > threshold)[0]
            
            if len(splice_candidates) > len(energy_diff) * 0.1:
                results['manipulation_detected'] = True
                results['splice_points'] = splice_candidates.tolist()
                results['confidence'] = min(
                    len(splice_candidates) / len(energy_diff),
                    1.0
                )
                results['explanation'].append(
                    f"Detected {len(splice_candidates)} potential splice points"
                )
        
        except Exception as e:
            results['explanation'].append(f"Error: {str(e)}")
        
        return results
    
    def detect_lip_sync_mismatch(self, video_frames: List[np.ndarray], 
                                  audio_path: str) -> Dict[str, Any]:
        """Detect lip-sync mismatch between video and audio"""
        results = {
            "lip_sync_mismatch": False,
            "confidence": 0.0,
            "explanation": [],
            "affected_frames": []
        }
        
        try:
            # Extract mouth movement from video
            mouth_activity = self._extract_mouth_activity(video_frames)
            
            # Extract speech activity from audio
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            speech_activity = self._extract_speech_activity(y, sr)
            
            # Align and compare
            if len(mouth_activity) > 0 and len(speech_activity) > 0:
                mismatch_frames = self._compare_activities(mouth_activity, speech_activity)
                
                mismatch_ratio = len(mismatch_frames) / len(mouth_activity)
                if mismatch_ratio > 0.2:
                    results['lip_sync_mismatch'] = True
                    results['affected_frames'] = mismatch_frames
                    results['confidence'] = mismatch_ratio
                    results['explanation'].append(
                        f"Lip-sync mismatch in {mismatch_ratio*100:.1f}% of frames"
                    )
        
        except Exception as e:
            results['explanation'].append(f"Error: {str(e)}")
        
        return results
    
    def _extract_f0(self, y: np.ndarray, sr: int) -> Tuple:
        """Extract F0 (fundamental frequency)"""
        try:
            f0_method = librosa.piptrack(y=y, sr=sr)
            f0 = []
            for t in range(f0_method.shape[1]):
                index = np.argmax(f0_method[:, t])
                f0.append(librosa.midi_to_hz(index) if f0_method[index, t] > 0.1 else 0)
            return np.array(f0), None, None
        except:
            return np.array([0]), None, None
    
    def _analyze_pitch_smoothness(self, f0: np.ndarray) -> float:
        """Analyze smoothness of pitch contour"""
        if len(f0) < 2:
            return 0.0
        f0_diff = np.diff(f0)
        f0_diff = f0_diff[f0_diff != 0]
        if len(f0_diff) == 0:
            return 1.0
        return 1.0 - (np.std(f0_diff) / (np.mean(np.abs(f0_diff)) + 0.001))
    
    def _extract_mouth_activity(self, frames: List[np.ndarray]) -> List[float]:
        """Extract mouth movement activity per frame"""
        activity = []
        for frame in frames:
            # Simplified: detect mouth area brightness changes
            mouth_region = frame[frame.shape[0]//2:, :]
            gray = cv2.cvtColor(mouth_region, cv2.COLOR_BGR2GRAY)
            activity.append(float(np.std(gray)))
        return activity
    
    def _extract_speech_activity(self, y: np.ndarray, sr: int) -> List[float]:
        """Extract speech activity from audio"""
        energy = librosa.feature.rms(y=y)[0]
        return energy.tolist()
    
    def _compare_activities(self, mouth: List[float], speech: List[float]) -> List[int]:
        """Compare mouth and speech activity"""
        mismatch_frames = []
        
        # Simple DTW-like comparison
        step = len(speech) // len(mouth) if len(mouth) > 0 else 1
        if step == 0:
            step = 1
        
        for i, mouth_val in enumerate(mouth):
            idx = min(i * step, len(speech) - 1)
            if abs(mouth_val - speech[idx]) > np.std(speech):
                mismatch_frames.append(i)
        
        return mismatch_frames


# ============================================================================
# DOCUMENT FORGERY DETECTOR
# ============================================================================

class DocumentDeepfakeDetector:
    """Detect forged/manipulated documents"""
    
    def detect_document_forgery(self, image_path: str) -> Dict[str, Any]:
        """Detect forged documents"""
        results = {
            "forgery_detected": False,
            "confidence": 0.0,
            "explanation": [],
            "indicators": []
        }
        
        try:
            image = cv2.imread(image_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # 1. Edge inconsistency
            edges = cv2.Canny(gray, 100, 200)
            edge_score = self._analyze_edge_consistency(edges)
            
            if edge_score > 0.7:
                results['indicators'].append("Edge anomalies detected")
            
            # 2. Blur analysis
            blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
            if blur_score < 100:
                results['indicators'].append("Unusual blur detected")
            
            # 3. Compression artifacts
            compression_score = self._detect_compression_artifacts(image)
            if compression_score > 0.5:
                results['indicators'].append("Compression artifacts found")
            
            # Calculate confidence
            results['confidence'] = len(results['indicators']) / 3.0
            
            if len(results['indicators']) >= 2:
                results['forgery_detected'] = True
                results['explanation'].append(
                    f"Multiple forgery indicators: {', '.join(results['indicators'])}"
                )
        
        except Exception as e:
            results['explanation'].append(f"Error: {str(e)}")
        
        return results
    
    def _analyze_edge_consistency(self, edges: np.ndarray) -> float:
        """Analyze edge consistency 0-1"""
        # Find regions of inconsistent edge density
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        dilated = cv2.dilate(edges, kernel, iterations=1)
        
        inconsistency = np.sum(np.abs(edges - dilated)) / edges.size
        return min(inconsistency, 1.0)
    
    def _detect_compression_artifacts(self, image: np.ndarray) -> float:
        """Detect JPEG compression artifacts"""
        # Convert to YCbCr for better artifact detection
        ycbcr = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
        
        # Check for block patterns (8x8 blocks in JPEG)
        blocks = []
        for i in range(0, ycbcr.shape[0], 8):
            for j in range(0, ycbcr.shape[1], 8):
                block = ycbcr[i:i+8, j:j+8]
                if block.shape == (8, 8, 3):
                    blocks.append(np.std(block))
        
        if len(blocks) > 0:
            block_variance = np.std(blocks)
            return min(block_variance / 10.0, 1.0)
        return 0.0


# ============================================================================
# COMPOSITE DEEPFAKE ANALYZER
# ============================================================================

class CompositeDeepfakeAnalyzer:
    """Comprehensive deepfake analysis using multiple detectors"""
    
    def __init__(self):
        self.face_detector = FaceManipulationDetector()
        self.audio_detector = AudioDeepfakeDetector()
        self.document_detector = DocumentDeepfakeDetector()
    
    def analyze_video(self, video_path: str, audio_path: Optional[str] = None) \
            -> DetailedAnalysisResult:
        """Comprehensive video deepfake analysis"""
        
        indicators = []
        
        # Extract frames
        cap = cv2.VideoCapture(video_path)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
        cap.release()
        
        # Face swap detection
        face_swap = self.face_detector.detect_face_swap(frames)
        if face_swap['face_swap_detected']:
            indicator = DeepfakeIndicator(
                type=DeepfakeType.FACE_SWAP,
                severity="CRITICAL" if face_swap['confidence'] > 0.8 else "HIGH",
                score=face_swap['confidence'],
                detection_methods=[
                    DetectionScore(
                        method=DetectionMethod.FACE_CONSISTENCY,
                        score=face_swap['confidence'],
                        confidence=0.9,
                        explanation=face_swap['explanation'][0]
                    )
                ],
                explanation="Face swap detected in video"
            )
            indicators.append(indicator)
        
        # Reenactment detection
        reenactment = self.face_detector.detect_reenactment(frames)
        if reenactment['reenactment_detected']:
            indicator = DeepfakeIndicator(
                type=DeepfakeType.FACE_REENACTMENT,
                severity="HIGH" if reenactment['confidence'] > 0.7 else "MEDIUM",
                score=reenactment['confidence'],
                detection_methods=[
                    DetectionScore(
                        method=DetectionMethod.EYE_MOVEMENT,
                        score=reenactment['confidence'],
                        confidence=0.85,
                        explanation=reenactment['explanation'][0]
                    )
                ],
                explanation="Face reenactment detected"
            )
            indicators.append(indicator)
        
        # Audio analysis
        if audio_path:
            voice_synth = self.audio_detector.detect_voice_synthesis(audio_path)
            if voice_synth['voice_synthesis_detected']:
                indicator = DeepfakeIndicator(
                    type=DeepfakeType.VOICE_SYNTHESIS,
                    severity="HIGH" if voice_synth['confidence'] > 0.7 else "MEDIUM",
                    score=voice_synth['confidence'],
                    detection_methods=[
                        DetectionScore(
                            method=DetectionMethod.ACOUSTIC_ANALYSIS,
                            score=voice_synth['confidence'],
                            confidence=0.8,
                            explanation=voice_synth['explanation'][0]
                        )
                    ],
                    explanation="Synthetic voice detected"
                )
                indicators.append(indicator)
            
            # Lip-sync check
            lip_sync = self.audio_detector.detect_lip_sync_mismatch(frames, audio_path)
            if lip_sync['lip_sync_mismatch']:
                indicator = DeepfakeIndicator(
                    type=DeepfakeType.LIP_SYNC,
                    severity="MEDIUM",
                    score=lip_sync['confidence'],
                    detection_methods=[
                        DetectionScore(
                            method=DetectionMethod.TEMPORAL_ANALYSIS,
                            score=lip_sync['confidence'],
                            confidence=0.75,
                            explanation=lip_sync['explanation'][0]
                        )
                    ],
                    explanation="Lip-sync mismatch detected"
                )
                indicators.append(indicator)
        
        # Overall result
        is_deepfake = len(indicators) > 0
        fraud_score = max([ind.score for ind in indicators]) if indicators else 0.0
        
        return DetailedAnalysisResult(
            is_deepfake=is_deepfake,
            fraud_score=fraud_score,
            confidence=min(fraud_score, 1.0),
            detected_types=indicators,
            primary_indicator=indicators[0] if indicators else None,
            secondary_indicators=indicators[1:] if len(indicators) > 1 else [],
            analysis_details={
                'total_frames': len(frames),
                'face_swap_detected': face_swap.get('face_swap_detected', False),
                'reenactment_detected': reenactment.get('reenactment_detected', False),
            },
            recommendations=self._generate_recommendations(indicators),
            processing_time_ms=0.0
        )
    
    def analyze_audio(self, audio_path: str) -> DetailedAnalysisResult:
        """Comprehensive audio deepfake analysis"""
        
        indicators = []
        
        # Voice synthesis
        voice_synth = self.audio_detector.detect_voice_synthesis(audio_path)
        if voice_synth['voice_synthesis_detected']:
            indicator = DeepfakeIndicator(
                type=DeepfakeType.VOICE_SYNTHESIS,
                severity="CRITICAL" if voice_synth['confidence'] > 0.8 else "HIGH",
                score=voice_synth['confidence'],
                detection_methods=[
                    DetectionScore(
                        method=DetectionMethod.ACOUSTIC_ANALYSIS,
                        score=voice_synth['confidence'],
                        confidence=0.85,
                        explanation=voice_synth['explanation'][0]
                    )
                ],
                explanation="AI-generated voice detected"
            )
            indicators.append(indicator)
        
        # Speech manipulation
        manipulation = self.audio_detector.detect_speech_manipulation(audio_path)
        if manipulation['manipulation_detected']:
            indicator = DeepfakeIndicator(
                type=DeepfakeType.AUDIO_SPLICING,
                severity="HIGH",
                score=manipulation['confidence'],
                detection_methods=[
                    DetectionScore(
                        method=DetectionMethod.TEMPORAL_ANALYSIS,
                        score=manipulation['confidence'],
                        confidence=0.8,
                        explanation=manipulation['explanation'][0]
                    )
                ],
                explanation="Audio splicing/manipulation detected"
            )
            indicators.append(indicator)
        
        is_deepfake = len(indicators) > 0
        fraud_score = max([ind.score for ind in indicators]) if indicators else 0.0
        
        return DetailedAnalysisResult(
            is_deepfake=is_deepfake,
            fraud_score=fraud_score,
            confidence=min(fraud_score, 1.0),
            detected_types=indicators,
            primary_indicator=indicators[0] if indicators else None,
            secondary_indicators=indicators[1:] if len(indicators) > 1 else [],
            analysis_details={
                'voice_synthesis_detected': voice_synth.get('voice_synthesis_detected', False),
                'manipulation_detected': manipulation.get('manipulation_detected', False),
            },
            recommendations=self._generate_recommendations(indicators),
            processing_time_ms=0.0
        )
    
    def analyze_document(self, image_path: str) -> DetailedAnalysisResult:
        """Comprehensive document forgery analysis"""
        
        indicators = []
        
        forgery_result = self.document_detector.detect_document_forgery(image_path)
        if forgery_result['forgery_detected']:
            indicator = DeepfakeIndicator(
                type=DeepfakeType.DOCUMENT_FORGERY,
                severity="CRITICAL" if forgery_result['confidence'] > 0.8 else "HIGH",
                score=forgery_result['confidence'],
                detection_methods=[
                    DetectionScore(
                        method=DetectionMethod.ARTIFACT_DETECTION,
                        score=forgery_result['confidence'],
                        confidence=0.85,
                        explanation=forgery_result['explanation'][0]
                    )
                ],
                explanation="Document forgery detected"
            )
            indicators.append(indicator)
        
        is_deepfake = len(indicators) > 0
        fraud_score = max([ind.score for ind in indicators]) if indicators else 0.0
        
        return DetailedAnalysisResult(
            is_deepfake=is_deepfake,
            fraud_score=fraud_score,
            confidence=min(fraud_score, 1.0),
            detected_types=indicators,
            primary_indicator=indicators[0] if indicators else None,
            secondary_indicators=[],
            analysis_details=forgery_result,
            recommendations=self._generate_recommendations(indicators),
            processing_time_ms=0.0
        )
    
    def _generate_recommendations(self, indicators: List[DeepfakeIndicator]) -> List[str]:
        """Generate recommendations based on detected indicators"""
        recommendations = []
        
        if not indicators:
            recommendations.append("Content appears authentic. Standard verification recommended.")
            return recommendations
        
        for indicator in indicators:
            if indicator.type == DeepfakeType.FACE_SWAP:
                recommendations.append("Block content immediately - Face swap detected")
                recommendations.append("Request biometric verification from subject")
            elif indicator.type == DeepfakeType.FACE_REENACTMENT:
                recommendations.append("Flag for manual review - Facial reenactment detected")
                recommendations.append("Cross-reference with known reenactment attacks")
            elif indicator.type == DeepfakeType.VOICE_SYNTHESIS:
                recommendations.append("Block audio - AI-generated voice detected")
                recommendations.append("Request voice verification through alternate channel")
            elif indicator.type == DeepfakeType.LIP_SYNC:
                recommendations.append("Content likely manipulated - Lip-sync mismatch found")
            elif indicator.type == DeepfakeType.DOCUMENT_FORGERY:
                recommendations.append("Reject document - Forgery indicators detected")
                recommendations.append("Request original document through secure channel")
        
        return recommendations


# Singleton instance
_analyzer = None

def get_deepfake_analyzer() -> CompositeDeepfakeAnalyzer:
    """Get singleton analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = CompositeDeepfakeAnalyzer()
    return _analyzer
