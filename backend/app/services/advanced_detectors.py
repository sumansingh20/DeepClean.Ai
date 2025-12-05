"""
Advanced Real Deepfake Detection Algorithms
Production-grade detection with actual ML/CV processing
"""

import cv2
import numpy as np
import librosa
from scipy import signal, fftpack
from skimage.metrics import structural_similarity as ssim
from skimage import measure, morphology
from PIL import Image, ImageChops, ImageEnhance
import torch
from typing import Dict, List, Tuple, Optional, Any
import logging
from dataclasses import dataclass
from datetime import datetime
import hashlib
import json

logger = logging.getLogger(__name__)


@dataclass
class DetectionResult:
    """Structured detection result"""
    is_fake: bool
    confidence: float
    fake_probability: float
    real_probability: float
    detection_method: str
    analysis_details: Dict[str, Any]
    anomalies_found: List[str]
    forensic_metrics: Dict[str, float]
    processing_time: float
    timestamp: str


class AdvancedVideoDetector:
    """
    Real video deepfake detection using:
    - Frequency domain analysis (DCT, FFT)
    - Temporal inconsistency detection
    - Compression artifact analysis
    - Face region anomaly detection
    - Optical flow analysis
    - Frame-by-frame consistency checks
    """
    
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
    def analyze_video(self, video_path: str) -> DetectionResult:
        """Comprehensive video deepfake analysis"""
        start_time = datetime.now()
        
        # Open video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {video_path}")
        
        frames = []
        frame_count = 0
        max_frames = 120  # Analyze first 4 seconds at 30fps
        
        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
            frame_count += 1
        
        cap.release()
        
        if len(frames) < 10:
            raise ValueError("Video too short for analysis")
        
        # Run multiple detection algorithms
        freq_score = self._frequency_analysis(frames)
        temporal_score = self._temporal_consistency(frames)
        compression_score = self._compression_artifacts(frames)
        face_score = self._face_region_analysis(frames)
        motion_score = self._optical_flow_analysis(frames)
        noise_score = self._noise_pattern_analysis(frames)
        
        # Combine scores with weighted average
        weights = {
            'frequency': 0.25,
            'temporal': 0.20,
            'compression': 0.15,
            'face': 0.20,
            'motion': 0.10,
            'noise': 0.10
        }
        
        fake_probability = (
            freq_score['fake_prob'] * weights['frequency'] +
            temporal_score['fake_prob'] * weights['temporal'] +
            compression_score['fake_prob'] * weights['compression'] +
            face_score['fake_prob'] * weights['face'] +
            motion_score['fake_prob'] * weights['motion'] +
            noise_score['fake_prob'] * weights['noise']
        )
        
        real_probability = 1.0 - fake_probability
        is_fake = fake_probability > 0.5
        confidence = max(fake_probability, real_probability)
        
        # Collect anomalies
        anomalies = []
        if freq_score['anomaly_detected']:
            anomalies.append(f"Frequency anomaly: {freq_score['description']}")
        if temporal_score['anomaly_detected']:
            anomalies.append(f"Temporal inconsistency: {temporal_score['description']}")
        if compression_score['anomaly_detected']:
            anomalies.append(f"Compression artifacts: {compression_score['description']}")
        if face_score['anomaly_detected']:
            anomalies.append(f"Face region anomaly: {face_score['description']}")
        if motion_score['anomaly_detected']:
            anomalies.append(f"Motion inconsistency: {motion_score['description']}")
        if noise_score['anomaly_detected']:
            anomalies.append(f"Noise pattern anomaly: {noise_score['description']}")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return DetectionResult(
            is_fake=is_fake,
            confidence=confidence,
            fake_probability=fake_probability,
            real_probability=real_probability,
            detection_method="Advanced Multi-Algorithm Video Analysis",
            analysis_details={
                'frames_analyzed': len(frames),
                'frequency_analysis': freq_score,
                'temporal_analysis': temporal_score,
                'compression_analysis': compression_score,
                'face_analysis': face_score,
                'motion_analysis': motion_score,
                'noise_analysis': noise_score
            },
            anomalies_found=anomalies,
            forensic_metrics={
                'frequency_score': freq_score['score'],
                'temporal_score': temporal_score['score'],
                'compression_score': compression_score['score'],
                'face_score': face_score['score'],
                'motion_score': motion_score['score'],
                'noise_score': noise_score['score']
            },
            processing_time=processing_time,
            timestamp=datetime.now().isoformat()
        )
    
    def _frequency_analysis(self, frames: List[np.ndarray]) -> Dict:
        """
        Frequency domain analysis using DCT and FFT
        Detects GAN artifacts in frequency spectrum
        """
        dct_anomalies = []
        
        for frame in frames[::5]:  # Sample every 5th frame
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Apply DCT
            dct = cv2.dct(np.float32(gray))
            
            # Analyze high-frequency components
            h, w = dct.shape
            high_freq = dct[h//2:, w//2:]
            high_freq_mean = np.mean(np.abs(high_freq))
            high_freq_std = np.std(np.abs(high_freq))
            
            # Real videos have more natural high-frequency distribution
            # GANs often have suppressed high frequencies
            anomaly_score = high_freq_std / (high_freq_mean + 1e-6)
            dct_anomalies.append(anomaly_score)
        
        mean_anomaly = np.mean(dct_anomalies)
        
        # Threshold based on empirical observations
        is_anomalous = mean_anomaly < 0.15  # Low variation = likely GAN
        fake_prob = 1.0 - min(mean_anomaly / 0.3, 1.0)
        
        return {
            'score': mean_anomaly,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"High-frequency variance: {mean_anomaly:.4f} (threshold: 0.15)"
        }
    
    def _temporal_consistency(self, frames: List[np.ndarray]) -> Dict:
        """
        Analyze temporal consistency between frames
        Real videos have smooth transitions; deepfakes may have frame discontinuities
        """
        frame_diffs = []
        
        for i in range(len(frames) - 1):
            gray1 = cv2.cvtColor(frames[i], cv2.COLOR_BGR2GRAY)
            gray2 = cv2.cvtColor(frames[i + 1], cv2.COLOR_BGR2GRAY)
            
            # Calculate structural similarity
            similarity = ssim(gray1, gray2)
            frame_diffs.append(1.0 - similarity)
        
        # Statistics
        mean_diff = np.mean(frame_diffs)
        std_diff = np.std(frame_diffs)
        max_diff = np.max(frame_diffs)
        
        # High variance suggests inconsistent generation
        consistency_score = std_diff / (mean_diff + 1e-6)
        is_anomalous = consistency_score > 2.0 or max_diff > 0.3
        fake_prob = min(consistency_score / 3.0, 1.0)
        
        return {
            'score': consistency_score,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Temporal variance: {consistency_score:.4f}, max diff: {max_diff:.4f}"
        }
    
    def _compression_artifacts(self, frames: List[np.ndarray]) -> Dict:
        """
        Detect unusual compression artifacts
        Deepfakes may show different compression patterns than real videos
        """
        artifact_scores = []
        
        for frame in frames[::10]:  # Sample frames
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect blockiness (JPEG artifacts)
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            variance = np.var(laplacian)
            
            # Edge detection
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Compression artifacts show in edge variance
            artifact_scores.append(variance * edge_density)
        
        mean_artifacts = np.mean(artifact_scores)
        std_artifacts = np.std(artifact_scores)
        
        # Unusual artifact patterns suggest manipulation
        is_anomalous = std_artifacts > mean_artifacts * 0.5
        fake_prob = min(std_artifacts / (mean_artifacts + 1e-6) / 2.0, 1.0)
        
        return {
            'score': mean_artifacts,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Artifact variance: {std_artifacts:.2f}, mean: {mean_artifacts:.2f}"
        }
    
    def _face_region_analysis(self, frames: List[np.ndarray]) -> Dict:
        """
        Analyze face regions for anomalies
        Deepfakes often show inconsistencies in face boundaries
        """
        face_anomalies = []
        faces_detected = 0
        
        for frame in frames[::3]:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) > 0:
                faces_detected += 1
                for (x, y, w, h) in faces:
                    # Extract face region
                    face_roi = frame[y:y+h, x:x+w]
                    
                    # Analyze face boundary sharpness
                    edges = cv2.Canny(cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY), 100, 200)
                    edge_ratio = np.sum(edges > 0) / edges.size
                    
                    # Check color consistency
                    lab = cv2.cvtColor(face_roi, cv2.COLOR_BGR2LAB)
                    l_std = np.std(lab[:,:,0])
                    
                    anomaly = edge_ratio / (l_std + 1e-6)
                    face_anomalies.append(anomaly)
        
        if len(face_anomalies) == 0:
            return {
                'score': 0.5,
                'fake_prob': 0.5,
                'anomaly_detected': False,
                'description': "No faces detected"
            }
        
        mean_anomaly = np.mean(face_anomalies)
        is_anomalous = mean_anomaly > 0.1
        fake_prob = min(mean_anomaly / 0.15, 1.0)
        
        return {
            'score': mean_anomaly,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Face boundary anomaly: {mean_anomaly:.4f}, faces: {faces_detected}"
        }
    
    def _optical_flow_analysis(self, frames: List[np.ndarray]) -> Dict:
        """
        Analyze optical flow for motion consistency
        Deepfakes may have unnatural motion patterns
        """
        flow_magnitudes = []
        
        for i in range(0, len(frames) - 1, 5):
            prev = cv2.cvtColor(frames[i], cv2.COLOR_BGR2GRAY)
            next_frame = cv2.cvtColor(frames[i + 1], cv2.COLOR_BGR2GRAY)
            
            # Calculate optical flow
            flow = cv2.calcOpticalFlowFarneback(
                prev, next_frame, None,
                pyr_scale=0.5, levels=3, winsize=15,
                iterations=3, poly_n=5, poly_sigma=1.2, flags=0
            )
            
            # Flow magnitude
            magnitude = np.sqrt(flow[..., 0]**2 + flow[..., 1]**2)
            flow_magnitudes.append(np.mean(magnitude))
        
        # Check for unnatural motion patterns
        flow_std = np.std(flow_magnitudes)
        flow_mean = np.mean(flow_magnitudes)
        
        motion_consistency = flow_std / (flow_mean + 1e-6)
        is_anomalous = motion_consistency > 1.5
        fake_prob = min(motion_consistency / 2.0, 1.0)
        
        return {
            'score': motion_consistency,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Motion inconsistency: {motion_consistency:.4f}"
        }
    
    def _noise_pattern_analysis(self, frames: List[np.ndarray]) -> Dict:
        """
        Analyze noise patterns in frames
        GANs produce different noise characteristics than real cameras
        """
        noise_scores = []
        
        for frame in frames[::8]:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Estimate noise using high-pass filter
            gaussian = cv2.GaussianBlur(gray, (5, 5), 0)
            noise = cv2.subtract(gray, gaussian)
            
            # Analyze noise distribution
            noise_std = np.std(noise)
            noise_mean = np.mean(np.abs(noise))
            
            # Real camera noise is more uniformly distributed
            noise_ratio = noise_std / (noise_mean + 1e-6)
            noise_scores.append(noise_ratio)
        
        mean_noise_ratio = np.mean(noise_scores)
        
        # GAN-generated images often have lower noise ratios
        is_anomalous = mean_noise_ratio < 2.5
        fake_prob = 1.0 - min(mean_noise_ratio / 4.0, 1.0)
        
        return {
            'score': mean_noise_ratio,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Noise pattern ratio: {mean_noise_ratio:.4f} (threshold: 2.5)"
        }


class AdvancedAudioDetector:
    """
    Real audio deepfake detection using:
    - Spectral analysis (MFCC, mel-spectrogram)
    - Prosody analysis
    - Voice consistency checking
    - Artifact detection in frequency domain
    - Phase consistency analysis
    """
    
    def analyze_audio(self, audio_path: str) -> DetectionResult:
        """Comprehensive audio deepfake analysis"""
        start_time = datetime.now()
        
        # Load audio
        y, sr = librosa.load(audio_path, sr=16000)
        
        if len(y) < sr:  # Less than 1 second
            raise ValueError("Audio too short for analysis")
        
        # Run multiple detection algorithms
        spectral_score = self._spectral_analysis(y, sr)
        prosody_score = self._prosody_analysis(y, sr)
        phase_score = self._phase_consistency(y, sr)
        artifact_score = self._artifact_detection(y, sr)
        formant_score = self._formant_analysis(y, sr)
        
        # Weighted combination
        weights = {
            'spectral': 0.30,
            'prosody': 0.25,
            'phase': 0.20,
            'artifact': 0.15,
            'formant': 0.10
        }
        
        fake_probability = (
            spectral_score['fake_prob'] * weights['spectral'] +
            prosody_score['fake_prob'] * weights['prosody'] +
            phase_score['fake_prob'] * weights['phase'] +
            artifact_score['fake_prob'] * weights['artifact'] +
            formant_score['fake_prob'] * weights['formant']
        )
        
        real_probability = 1.0 - fake_probability
        is_fake = fake_probability > 0.5
        confidence = max(fake_probability, real_probability)
        
        # Collect anomalies
        anomalies = []
        if spectral_score['anomaly_detected']:
            anomalies.append(f"Spectral anomaly: {spectral_score['description']}")
        if prosody_score['anomaly_detected']:
            anomalies.append(f"Prosody anomaly: {prosody_score['description']}")
        if phase_score['anomaly_detected']:
            anomalies.append(f"Phase inconsistency: {phase_score['description']}")
        if artifact_score['anomaly_detected']:
            anomalies.append(f"Synthesis artifacts: {artifact_score['description']}")
        if formant_score['anomaly_detected']:
            anomalies.append(f"Formant anomaly: {formant_score['description']}")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return DetectionResult(
            is_fake=is_fake,
            confidence=confidence,
            fake_probability=fake_probability,
            real_probability=real_probability,
            detection_method="Advanced Multi-Algorithm Audio Analysis",
            analysis_details={
                'duration': len(y) / sr,
                'sample_rate': sr,
                'spectral_analysis': spectral_score,
                'prosody_analysis': prosody_score,
                'phase_analysis': phase_score,
                'artifact_analysis': artifact_score,
                'formant_analysis': formant_score
            },
            anomalies_found=anomalies,
            forensic_metrics={
                'spectral_score': spectral_score['score'],
                'prosody_score': prosody_score['score'],
                'phase_score': phase_score['score'],
                'artifact_score': artifact_score['score'],
                'formant_score': formant_score['score']
            },
            processing_time=processing_time,
            timestamp=datetime.now().isoformat()
        )
    
    def _spectral_analysis(self, y: np.ndarray, sr: int) -> Dict:
        """
        Analyze spectral characteristics using MFCC and mel-spectrogram
        """
        # Extract MFCCs
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        mfcc_mean = np.mean(mfccs, axis=1)
        mfcc_std = np.std(mfccs, axis=1)
        
        # Mel-spectrogram
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr)
        mel_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        # Spectral centroid (brightness)
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
        centroid_mean = np.mean(spectral_centroids)
        
        # Synthetic speech often has unnatural spectral distribution
        mfcc_variance = np.mean(mfcc_std)
        spectral_flatness = np.mean(librosa.feature.spectral_flatness(y=y))
        
        # Anomaly detection
        is_anomalous = mfcc_variance < 5.0 or spectral_flatness < 0.1
        fake_prob = 1.0 - min((mfcc_variance / 10.0 + spectral_flatness) / 2.0, 1.0)
        
        return {
            'score': mfcc_variance,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"MFCC variance: {mfcc_variance:.2f}, flatness: {spectral_flatness:.4f}"
        }
    
    def _prosody_analysis(self, y: np.ndarray, sr: int) -> Dict:
        """
        Analyze prosodic features (pitch, rhythm, intonation)
        """
        # Fundamental frequency (pitch)
        f0 = librosa.yin(y, fmin=50, fmax=500, sr=sr)
        f0_valid = f0[f0 > 0]
        
        if len(f0_valid) == 0:
            return {
                'score': 0.5,
                'fake_prob': 0.5,
                'anomaly_detected': False,
                'description': "No pitch detected"
            }
        
        # Pitch statistics
        pitch_mean = np.mean(f0_valid)
        pitch_std = np.std(f0_valid)
        pitch_range = np.max(f0_valid) - np.min(f0_valid)
        
        # Synthetic speech often has less natural pitch variation
        prosody_score = pitch_std / (pitch_mean + 1e-6)
        is_anomalous = prosody_score < 0.05 or pitch_range < 20
        fake_prob = 1.0 - min(prosody_score / 0.15, 1.0)
        
        return {
            'score': prosody_score,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Pitch variation: {prosody_score:.4f}, range: {pitch_range:.1f}Hz"
        }
    
    def _phase_consistency(self, y: np.ndarray, sr: int) -> Dict:
        """
        Check phase consistency in frequency domain
        """
        # Short-time Fourier transform
        D = librosa.stft(y)
        magnitude = np.abs(D)
        phase = np.angle(D)
        
        # Phase derivative (should be smooth in real audio)
        phase_diff = np.diff(phase, axis=1)
        phase_consistency = np.std(phase_diff)
        
        # Synthetic audio may have phase discontinuities
        is_anomalous = phase_consistency > 2.0
        fake_prob = min(phase_consistency / 3.0, 1.0)
        
        return {
            'score': phase_consistency,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Phase consistency: {phase_consistency:.4f}"
        }
    
    def _artifact_detection(self, y: np.ndarray, sr: int) -> Dict:
        """
        Detect synthesis artifacts in high frequencies
        """
        # High-pass filter to isolate high frequencies
        nyquist = sr / 2
        high_cutoff = 0.7  # 70% of Nyquist frequency
        sos = signal.butter(4, high_cutoff, btype='high', output='sos')
        y_high = signal.sosfilt(sos, y)
        
        # Analyze high-frequency content
        high_freq_power = np.mean(y_high ** 2)
        
        # Synthetic speech often lacks natural high-frequency content
        is_anomalous = high_freq_power < 0.001
        fake_prob = 1.0 - min(high_freq_power / 0.005, 1.0)
        
        return {
            'score': high_freq_power,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"High-freq power: {high_freq_power:.6f}"
        }
    
    def _formant_analysis(self, y: np.ndarray, sr: int) -> Dict:
        """
        Analyze formant frequencies (vowel characteristics)
        """
        # Get LPC coefficients
        frame_length = 2048
        hop_length = 512
        
        formant_consistency = []
        
        for i in range(0, len(y) - frame_length, hop_length):
            frame = y[i:i+frame_length]
            
            # Linear prediction coefficients
            lpc_order = 12
            lpc = librosa.lpc(frame, order=lpc_order)
            
            # Formant tracking via LPC roots
            roots = np.roots(lpc)
            roots = roots[np.imag(roots) >= 0]
            
            if len(roots) > 0:
                angles = np.arctan2(np.imag(roots), np.real(roots))
                formants = sorted(angles * (sr / (2 * np.pi)))
                formant_consistency.append(np.std(formants) if len(formants) > 1 else 0)
        
        if len(formant_consistency) == 0:
            return {
                'score': 0.5,
                'fake_prob': 0.5,
                'anomaly_detected': False,
                'description': "Insufficient formant data"
            }
        
        formant_score = np.mean(formant_consistency)
        
        # Unnatural formant patterns suggest synthesis
        is_anomalous = formant_score < 50 or formant_score > 500
        fake_prob = 0.5  # Neutral for formant alone
        
        if formant_score < 50:
            fake_prob = 0.7
        elif formant_score > 500:
            fake_prob = 0.6
        
        return {
            'score': formant_score,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Formant consistency: {formant_score:.2f}Hz"
        }


class AdvancedImageDetector:
    """
    Real image manipulation detection using:
    - Error Level Analysis (ELA)
    - JPEG compression analysis
    - Metadata examination
    - Clone detection
    - Noise inconsistency analysis
    """
    
    def analyze_image(self, image_path: str) -> DetectionResult:
        """Comprehensive image manipulation analysis"""
        start_time = datetime.now()
        
        # Load image
        img = Image.open(image_path)
        img_array = np.array(img)
        
        # Run detection algorithms
        ela_score = self._error_level_analysis(image_path)
        noise_score = self._noise_analysis(img_array)
        jpeg_score = self._jpeg_ghost_detection(image_path)
        clone_score = self._clone_detection(img_array)
        metadata_score = self._metadata_analysis(image_path)
        
        # Weighted combination
        weights = {
            'ela': 0.30,
            'noise': 0.25,
            'jpeg': 0.20,
            'clone': 0.15,
            'metadata': 0.10
        }
        
        fake_probability = (
            ela_score['fake_prob'] * weights['ela'] +
            noise_score['fake_prob'] * weights['noise'] +
            jpeg_score['fake_prob'] * weights['jpeg'] +
            clone_score['fake_prob'] * weights['clone'] +
            metadata_score['fake_prob'] * weights['metadata']
        )
        
        real_probability = 1.0 - fake_probability
        is_fake = fake_probability > 0.5
        confidence = max(fake_probability, real_probability)
        
        # Collect anomalies
        anomalies = []
        if ela_score['anomaly_detected']:
            anomalies.append(f"ELA anomaly: {ela_score['description']}")
        if noise_score['anomaly_detected']:
            anomalies.append(f"Noise inconsistency: {noise_score['description']}")
        if jpeg_score['anomaly_detected']:
            anomalies.append(f"JPEG artifacts: {jpeg_score['description']}")
        if clone_score['anomaly_detected']:
            anomalies.append(f"Clone detection: {clone_score['description']}")
        if metadata_score['anomaly_detected']:
            anomalies.append(f"Metadata warning: {metadata_score['description']}")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return DetectionResult(
            is_fake=is_fake,
            confidence=confidence,
            fake_probability=fake_probability,
            real_probability=real_probability,
            detection_method="Advanced Multi-Algorithm Image Analysis",
            analysis_details={
                'image_size': img.size,
                'format': img.format,
                'mode': img.mode,
                'ela_analysis': ela_score,
                'noise_analysis': noise_score,
                'jpeg_analysis': jpeg_score,
                'clone_analysis': clone_score,
                'metadata_analysis': metadata_score
            },
            anomalies_found=anomalies,
            forensic_metrics={
                'ela_score': ela_score['score'],
                'noise_score': noise_score['score'],
                'jpeg_score': jpeg_score['score'],
                'clone_score': clone_score['score'],
                'metadata_score': metadata_score['score']
            },
            processing_time=processing_time,
            timestamp=datetime.now().isoformat()
        )
    
    def _error_level_analysis(self, image_path: str) -> Dict:
        """
        Error Level Analysis - detects compression inconsistencies
        """
        # Load original
        img = Image.open(image_path)
        
        # Resave at known quality
        import io
        buffer = io.BytesIO()
        img.save(buffer, 'JPEG', quality=90)
        buffer.seek(0)
        resaved = Image.open(buffer)
        
        # Calculate difference
        diff = ImageChops.difference(img.convert('RGB'), resaved.convert('RGB'))
        extrema = diff.getextrema()
        
        # ELA score: manipulated areas show different error levels
        max_diff = max([ex[1] for ex in extrema])
        
        # Enhance to see differences
        diff_enhanced = ImageEnhance.Brightness(diff).enhance(10)
        diff_array = np.array(diff_enhanced)
        ela_variance = np.std(diff_array)
        
        is_anomalous = ela_variance > 15 or max_diff > 30
        fake_prob = min((ela_variance / 30.0 + max_diff / 60.0) / 2.0, 1.0)
        
        return {
            'score': ela_variance,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"ELA variance: {ela_variance:.2f}, max diff: {max_diff}"
        }
    
    def _noise_analysis(self, img_array: np.ndarray) -> Dict:
        """
        Analyze noise patterns for inconsistencies
        """
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array
        
        # Divide image into regions
        h, w = gray.shape
        block_size = 64
        noise_variances = []
        
        for i in range(0, h - block_size, block_size):
            for j in range(0, w - block_size, block_size):
                block = gray[i:i+block_size, j:j+block_size]
                
                # Estimate noise
                gaussian = cv2.GaussianBlur(block, (5, 5), 0)
                noise = block.astype(float) - gaussian.astype(float)
                noise_var = np.var(noise)
                noise_variances.append(noise_var)
        
        # Inconsistent noise suggests manipulation
        noise_std = np.std(noise_variances)
        noise_mean = np.mean(noise_variances)
        noise_consistency = noise_std / (noise_mean + 1e-6)
        
        is_anomalous = noise_consistency > 1.5
        fake_prob = min(noise_consistency / 2.5, 1.0)
        
        return {
            'score': noise_consistency,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Noise inconsistency: {noise_consistency:.4f}"
        }
    
    def _jpeg_ghost_detection(self, image_path: str) -> Dict:
        """
        Detect JPEG ghosts (signs of multiple compression)
        """
        img = Image.open(image_path)
        
        ghosts = []
        
        for quality in [95, 90, 85, 80, 75, 70]:
            import io
            buffer = io.BytesIO()
            img.save(buffer, 'JPEG', quality=quality)
            buffer.seek(0)
            recompressed = Image.open(buffer)
            
            diff = ImageChops.difference(img.convert('RGB'), recompressed.convert('RGB'))
            diff_array = np.array(diff)
            ghost_score = np.mean(diff_array)
            ghosts.append(ghost_score)
        
        # Look for quality level with minimum difference
        min_ghost = min(ghosts)
        ghost_quality = [95, 90, 85, 80, 75, 70][ghosts.index(min_ghost)]
        
        # If minimum is not at highest quality, image was likely recompressed
        is_anomalous = ghost_quality < 95
        fake_prob = 0.3 if is_anomalous else 0.1
        
        return {
            'score': min_ghost,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Likely compressed at quality {ghost_quality}"
        }
    
    def _clone_detection(self, img_array: np.ndarray) -> Dict:
        """
        Detect cloned regions (copy-paste manipulation)
        """
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array
        
        # Use ORB for feature detection
        orb = cv2.ORB_create(nfeatures=500)
        keypoints, descriptors = orb.detectAndCompute(gray, None)
        
        if descriptors is None or len(descriptors) < 10:
            return {
                'score': 0.0,
                'fake_prob': 0.1,
                'anomaly_detected': False,
                'description': "Insufficient features for clone detection"
            }
        
        # Find matching features
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        matches = bf.knnMatch(descriptors, descriptors, k=2)
        
        # Count good matches (excluding self-matches)
        clone_matches = 0
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < 0.75 * n.distance and m.queryIdx != m.trainIdx:
                    clone_matches += 1
        
        clone_ratio = clone_matches / len(keypoints) if len(keypoints) > 0 else 0
        
        is_anomalous = clone_ratio > 0.3
        fake_prob = min(clone_ratio / 0.5, 1.0)
        
        return {
            'score': clone_ratio,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': f"Clone matches: {clone_matches}, ratio: {clone_ratio:.3f}"
        }
    
    def _metadata_analysis(self, image_path: str) -> Dict:
        """
        Analyze image metadata for manipulation signs
        """
        from PIL.ExifTags import TAGS
        
        img = Image.open(image_path)
        exif = img.getexif()
        
        metadata = {}
        for tag_id, value in exif.items():
            tag = TAGS.get(tag_id, tag_id)
            metadata[tag] = value
        
        # Check for editing software
        software_tags = ['Software', 'ProcessingSoftware', 'HostComputer']
        editing_software = []
        
        for tag in software_tags:
            if tag in metadata:
                value = str(metadata[tag]).lower()
                if any(x in value for x in ['photoshop', 'gimp', 'paint', 'editor']):
                    editing_software.append(value)
        
        # Missing GPS data is suspicious for phone photos
        has_gps = 'GPSInfo' in metadata
        has_datetime = 'DateTime' in metadata or 'DateTimeOriginal' in metadata
        
        suspicious_count = len(editing_software)
        if not has_datetime:
            suspicious_count += 1
        
        is_anomalous = suspicious_count > 0
        fake_prob = min(suspicious_count * 0.2, 0.6)
        
        description = "Clean metadata"
        if editing_software:
            description = f"Edited with: {', '.join(editing_software)}"
        elif not has_datetime:
            description = "Missing timestamp"
        
        return {
            'score': suspicious_count,
            'fake_prob': fake_prob,
            'anomaly_detected': is_anomalous,
            'description': description
        }


# Export main detectors
def get_advanced_detector(media_type: str):
    """Get appropriate advanced detector"""
    if media_type == 'video':
        return AdvancedVideoDetector()
    elif media_type == 'audio':
        return AdvancedAudioDetector()
    elif media_type == 'image':
        return AdvancedImageDetector()
    else:
        raise ValueError(f"Unsupported media type: {media_type}")
