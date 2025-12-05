"""
Deepfake Tools & Utilities
Advanced detection tools and helper functions
"""

from enum import Enum
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
import cv2
from dataclasses import dataclass, asdict
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# DEEPFAKE TOOLS
# ============================================================================

class DeepfakeTool(str, Enum):
    """Known deepfake creation tools"""
    FACESWAP = "faceswap"
    DEEPFACELAB = "deepfacelab"
    FIRST_ORDER_MOTION = "first_order_motion"
    NEURAL_TEXTURES = "neural_textures"
    TALKING_HEAD = "talking_head"
    TACOTRON2 = "tacotron2"
    WAVEGLOW = "waveglow"
    VOCODER_UNIVERSAL = "vocoder_universal"
    GLOW_TTS = "glow_tts"
    REAL_ESRGAN = "real_esrgan"
    STYLEGAN = "stylegan"
    STYLEGANV2 = "styleganv2"
    IDINVERT = "idinvert"
    E4E = "e4e"
    PGAN = "pgan"
    UNKNOWN = "unknown"


class DeepfakeAttackType(str, Enum):
    """Types of deepfake attacks"""
    SYNTHESIS = "synthesis"  # Completely generated
    MANIPULATION = "manipulation"  # Modified real content
    REPLACEMENT = "replacement"  # Face/voice swapped
    AUGMENTATION = "augmentation"  # Enhanced/distorted
    HYBRID = "hybrid"  # Multiple techniques


class BiometricVulnerability(str, Enum):
    """Biometric vulnerabilities exploited"""
    FACE_RECOGNITION = "face_recognition"
    SPEAKER_VERIFICATION = "speaker_verification"
    IRIS_RECOGNITION = "iris_recognition"
    FINGERPRINT = "fingerprint"
    BEHAVIORAL = "behavioral"
    GAIT_RECOGNITION = "gait_recognition"


# ============================================================================
# DETECTION TOOLS
# ============================================================================

class FrequencyDomainAnalyzer:
    """Analyze frequency domain artifacts in deepfakes"""
    
    @staticmethod
    def analyze_fft_spectrum(image: np.ndarray) -> Dict[str, Any]:
        """Analyze FFT spectrum for GAN artifacts"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Compute FFT
        fft = np.fft.fft2(gray)
        fft_shift = np.fft.fftshift(fft)
        magnitude_spectrum = np.abs(fft_shift)
        
        # Analyze spectrum characteristics
        log_spectrum = np.log(magnitude_spectrum + 1)
        
        # Detect ring artifacts (typical of StyleGAN)
        ring_score = FrequencyDomainAnalyzer._detect_ring_artifacts(log_spectrum)
        
        # Detect radial patterns (typical of GANs)
        radial_score = FrequencyDomainAnalyzer._detect_radial_patterns(log_spectrum)
        
        return {
            "ring_artifacts": ring_score,
            "radial_patterns": radial_score,
            "gan_likelihood": max(ring_score, radial_score),
            "spectrum_entropy": float(np.std(log_spectrum))
        }
    
    @staticmethod
    def _detect_ring_artifacts(spectrum: np.ndarray) -> float:
        """Detect ring artifacts in frequency spectrum"""
        h, w = spectrum.shape
        cy, cx = h // 2, w // 2
        
        # Sample rings at different radii
        max_radius = min(cy, cx)
        ring_scores = []
        
        for r in range(10, max_radius, 10):
            # Create ring mask
            y, x = np.ogrid[:h, :w]
            mask = (np.sqrt((x-cx)**2 + (y-cy)**2) > r-3) & (np.sqrt((x-cx)**2 + (y-cy)**2) < r+3)
            
            ring_mean = np.mean(spectrum[mask]) if np.any(mask) else 0
            ring_scores.append(ring_mean)
        
        # High variance in ring intensities suggests artifacts
        if len(ring_scores) > 0:
            return min(np.std(ring_scores) / (np.mean(ring_scores) + 0.001), 1.0)
        return 0.0
    
    @staticmethod
    def _detect_radial_patterns(spectrum: np.ndarray) -> float:
        """Detect radial patterns typical of GAN artifacts"""
        h, w = spectrum.shape
        center = spectrum[h//2, w//2]
        
        # Check for unusually high central component
        central_ratio = center / (np.mean(spectrum) + 0.001)
        
        return min(central_ratio / 100.0, 1.0)


class TemporalConsistencyAnalyzer:
    """Analyze temporal consistency in videos"""
    
    @staticmethod
    def analyze_optical_flow(frames: List[np.ndarray]) -> Dict[str, Any]:
        """Analyze optical flow for temporal inconsistencies"""
        if len(frames) < 2:
            return {"score": 0.0}
        
        flow_vectors = []
        
        for i in range(1, len(frames)):
            prev_gray = cv2.cvtColor(frames[i-1], cv2.COLOR_BGR2GRAY)
            curr_gray = cv2.cvtColor(frames[i], cv2.COLOR_BGR2GRAY)
            
            # Compute optical flow
            flow = cv2.calcOpticalFlowFarneback(
                prev_gray, curr_gray, None,
                pyr_scale=0.5, levels=3, winsize=15,
                iterations=3, n8=True, poly_n=5,
                poly_sigma=1.2, flags=0
            )
            
            # Compute flow magnitude
            mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])
            flow_vectors.append(np.mean(mag))
        
        # Analyze flow consistency
        flow_variance = np.std(flow_vectors)
        flow_mean = np.mean(flow_vectors)
        
        # Normalized inconsistency score
        inconsistency = flow_variance / (flow_mean + 0.001)
        
        return {
            "flow_consistency": 1.0 / (1.0 + inconsistency),
            "flow_variance": float(flow_variance),
            "flow_mean": float(flow_mean),
            "irregular_frames": sum(1 for f in flow_vectors if f > flow_mean + 2*flow_variance)
        }
    
    @staticmethod
    def analyze_flickering(frames: List[np.ndarray]) -> Dict[str, Any]:
        """Detect unnatural flickering patterns"""
        if len(frames) < 3:
            return {"flicker_score": 0.0}
        
        brightness_values = []
        
        for frame in frames:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            brightness = np.mean(gray)
            brightness_values.append(brightness)
        
        # Analyze brightness transitions
        transitions = np.diff(brightness_values)
        
        # Detect rapid, unnatural transitions
        high_transitions = np.sum(np.abs(transitions) > np.std(transitions) * 3)
        
        flicker_score = min(high_transitions / len(frames), 1.0)
        
        return {
            "flicker_score": float(flicker_score),
            "brightness_consistency": 1.0 - float(flicker_score),
            "transition_count": len(transitions),
            "high_transition_count": int(high_transitions)
        }


class AudioArtifactDetector:
    """Detect audio manipulation artifacts"""
    
    @staticmethod
    def detect_clicks_pops(audio: np.ndarray, sr: int) -> Dict[str, Any]:
        """Detect clicks and pops in audio"""
        # High-pass filter to isolate clicks
        sos = None
        try:
            from scipy import signal
            sos = signal.butter(4, 5000, 'hp', fs=sr, output='sos')
            filtered = signal.sosfilt(sos, audio)
        except:
            filtered = audio
        
        # Detect peaks
        threshold = np.std(filtered) * 3
        peaks = np.where(np.abs(filtered) > threshold)[0]
        
        click_rate = len(peaks) / len(audio)
        
        return {
            "click_pop_score": min(click_rate * 100, 1.0),
            "detected_clicks": len(peaks),
            "click_threshold": float(threshold)
        }
    
    @staticmethod
    def detect_robot_effect(audio: np.ndarray, sr: int) -> Dict[str, Any]:
        """Detect robotic/synthetic voice effects"""
        import librosa
        
        # Extract MFCCs
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        
        # Analyze MFCC variability
        mfcc_var = np.var(mfcc, axis=1)
        
        # Low variance across time is typical of synthetic voices
        low_var_mfccs = np.sum(mfcc_var < np.median(mfcc_var) * 0.5)
        
        robot_score = low_var_mfccs / 13.0
        
        return {
            "robot_effect_score": float(robot_score),
            "low_variance_coefficients": int(low_var_mfccs),
            "total_coefficients": 13
        }


class BiometricVulnerabilityAnalyzer:
    """Analyze which biometric systems could be spoofed"""
    
    @staticmethod
    def assess_face_recognition_vulnerability(
        image: np.ndarray,
        deepfake_score: float
    ) -> Dict[str, Any]:
        """Assess face recognition vulnerability"""
        
        return {
            "vulnerability": BiometricVulnerability.FACE_RECOGNITION.value,
            "risk_score": deepfake_score,
            "affected_systems": [
                "facial_authentication",
                "facial_identification",
                "facial_clustering"
            ],
            "mitigation_strategies": [
                "Liveness detection",
                "3D face reconstruction",
                "Active authentication",
                "Multi-modal biometric fusion"
            ]
        }
    
    @staticmethod
    def assess_speaker_verification_vulnerability(
        audio: np.ndarray,
        deepfake_score: float,
        sr: int = 16000
    ) -> Dict[str, Any]:
        """Assess speaker verification vulnerability"""
        
        return {
            "vulnerability": BiometricVulnerability.SPEAKER_VERIFICATION.value,
            "risk_score": deepfake_score,
            "affected_systems": [
                "voice_authentication",
                "speaker_identification",
                "voice_clustering"
            ],
            "mitigation_strategies": [
                "Anti-spoofing detection",
                "Liveness challenge-response",
                "Phrase randomization",
                "Multi-modal biometric fusion"
            ]
        }


# ============================================================================
# FORENSIC ANALYSIS TOOLS
# ============================================================================

class ForensicAnalyzer:
    """Comprehensive forensic analysis of deepfakes"""
    
    @staticmethod
    def generate_forensic_fingerprint(media_data: np.ndarray) -> Dict[str, Any]:
        """Generate forensic fingerprint of media"""
        return {
            "fingerprint_type": "media_forensic",
            "content_hash": hash(media_data.tobytes()),
            "creation_timestamp": datetime.utcnow().isoformat(),
            "processing_metadata": {
                "width": media_data.shape[1] if len(media_data.shape) >= 2 else 0,
                "height": media_data.shape[0] if len(media_data.shape) >= 1 else 0,
                "channels": media_data.shape[2] if len(media_data.shape) == 3 else 1
            }
        }
    
    @staticmethod
    def trace_creation_tool(deepfake_indicators: Dict[str, Any]) -> Dict[str, Any]:
        """Attempt to identify which tool was used to create deepfake"""
        
        # Pattern matching for known tools
        tool_signatures = {
            DeepfakeTool.FACESWAP: {
                "ring_artifacts": 0.7,
                "radial_patterns": 0.6
            },
            DeepfakeTool.DEEPFACELAB: {
                "ring_artifacts": 0.8,
                "blending_artifacts": 0.7
            },
            DeepfakeTool.FIRST_ORDER_MOTION: {
                "temporal_inconsistencies": 0.75,
                "boundary_artifacts": 0.6
            },
            DeepfakeTool.STYLEGAN: {
                "ring_artifacts": 0.9,
                "central_bias": 0.8
            },
        }
        
        # Score each tool
        tool_scores = {}
        for tool, signature in tool_signatures.items():
            score = 0.0
            for indicator, weight in signature.items():
                if indicator in deepfake_indicators:
                    score += deepfake_indicators[indicator] * weight
            tool_scores[tool.value] = score / len(signature)
        
        # Find best match
        best_match = max(tool_scores.items(), key=lambda x: x[1])
        
        return {
            "likely_tools": sorted(
                tool_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )[:3],
            "best_match": best_match[0],
            "confidence": best_match[1],
            "attack_type": DeepfakeAttackType.SYNTHESIS.value if best_match[1] > 0.7 else DeepfakeAttackType.REPLACEMENT.value
        }


# ============================================================================
# DEEPFAKE COMPARISON TOOLS
# ============================================================================

class DeepfakeComparisonAnalyzer:
    """Compare multiple samples to identify patterns"""
    
    @staticmethod
    def compare_samples(samples: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compare multiple deepfake samples"""
        
        if len(samples) < 2:
            return {"error": "Need at least 2 samples"}
        
        # Extract common characteristics
        common_tool = None
        common_indicators = {}
        
        for sample in samples:
            for key, value in sample.items():
                if key not in common_indicators:
                    common_indicators[key] = []
                common_indicators[key].append(value)
        
        # Calculate consistency
        consistency = {}
        for key, values in common_indicators.items():
            if isinstance(values[0], (int, float)):
                consistency[key] = float(np.std(values))
        
        return {
            "sample_count": len(samples),
            "common_indicators": list(common_indicators.keys()),
            "characteristic_consistency": consistency,
            "likely_same_source": max(consistency.values()) < 0.3 if consistency else False
        }


# ============================================================================
# DETECTION RESULT FORMATTER
# ============================================================================

@dataclass
class DeepfakeDetectionResult:
    """Formatted deepfake detection result"""
    is_deepfake: bool
    fraud_score: float
    confidence: float
    detection_method: str
    tool_identification: Optional[DeepfakeTool]
    attack_type: Optional[DeepfakeAttackType]
    vulnerabilities: List[BiometricVulnerability]
    recommendations: List[str]
    evidence: Dict[str, Any]
    forensic_analysis: Dict[str, Any]
    
    def to_json(self) -> str:
        """Convert to JSON"""
        data = asdict(self)
        data['tool_identification'] = self.tool_identification.value if self.tool_identification else None
        data['attack_type'] = self.attack_type.value if self.attack_type else None
        data['vulnerabilities'] = [v.value for v in self.vulnerabilities]
        return json.dumps(data, indent=2)


# Initialization helper
def initialize_deepfake_tools() -> Dict[str, Any]:
    """Initialize all deepfake detection tools"""
    return {
        "frequency_analyzer": FrequencyDomainAnalyzer(),
        "temporal_analyzer": TemporalConsistencyAnalyzer(),
        "audio_detector": AudioArtifactDetector(),
        "biometric_analyzer": BiometricVulnerabilityAnalyzer(),
        "forensic_analyzer": ForensicAnalyzer(),
        "comparison_analyzer": DeepfakeComparisonAnalyzer(),
    }
