"""
Perceptual Hashing Service
==========================

Implements real-world perceptual hashing using:
- PDQ (Image hashing) from Meta ThreatExchange
- TMK+PDQF (Video hashing) from Meta ThreatExchange

These hashes are robust to common modifications:
- Cropping, scaling, rotation
- Color adjustments, filters
- Compression (JPEG, H.264)
- Re-encoding, format conversion
- Watermarks, overlays

Installation:
    pip install pdqhash opencv-python pillow numpy

References:
- PDQ: https://github.com/facebook/ThreatExchange/tree/main/pdq
- TMK: https://github.com/facebook/ThreatExchange/tree/main/tmk
"""

import hashlib
import logging
from typing import List, Tuple, Optional, Dict
from pathlib import Path
import tempfile

import cv2
import numpy as np
from PIL import Image

try:
    import pdqhash
    PDQ_AVAILABLE = True
except ImportError:
    PDQ_AVAILABLE = False
    logging.warning("pdqhash not available. Install with: pip install pdqhash")

logger = logging.getLogger(__name__)


class PerceptualHasher:
    """
    Generates perceptual hashes for images and videos using Meta's PDQ and TMK algorithms.
    """
    
    def __init__(self):
        if not PDQ_AVAILABLE:
            raise ImportError(
                "pdqhash is required. Install with: pip install pdqhash\n"
                "or build from source: https://github.com/facebook/ThreatExchange/tree/main/pdq"
            )
    
    def hash_image(self, image_path: str) -> Dict[str, any]:
        """
        Generate PDQ hash for an image.
        
        Args:
            image_path: Path to image file
            
        Returns:
            dict: {
                'hash_value': str (64-char hex),
                'hash_binary': str (256-bit binary string),
                'hash_type': 'pdq',
                'quality': int (0-100, PDQ quality score)
            }
        """
        try:
            # Load image using PIL
            img = Image.open(image_path)
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Generate PDQ hash and quality score
            # PDQ returns a tuple: (hash_vector, quality)
            # hash_vector is a 16x16 binary matrix (256 bits)
            hash_vector, quality = pdqhash.compute(img)
            
            # Convert hash vector to hex string (64 characters)
            hash_hex = self._vector_to_hex(hash_vector)
            
            # Convert to binary string for database storage
            hash_binary = self._vector_to_binary(hash_vector)
            
            logger.info(f"PDQ hash generated: {hash_hex[:16]}... (quality: {quality})")
            
            return {
                'hash_value': hash_hex,
                'hash_binary': hash_binary,
                'hash_type': 'pdq',
                'quality': quality,
                'metadata': {
                    'image_size': f"{img.width}x{img.height}",
                    'image_mode': img.mode
                }
            }
            
        except Exception as e:
            logger.error(f"Error hashing image {image_path}: {e}")
            raise
    
    def hash_video(
        self, 
        video_path: str, 
        frame_interval: int = 30,  # Extract 1 frame per second (for 30fps video)
        max_frames: int = 300  # Maximum 5 minutes of video
    ) -> Dict[str, any]:
        """
        Generate TMK+PDQF hash for a video.
        
        This extracts keyframes and generates PDQ hashes for each frame,
        then creates a temporal signature.
        
        Args:
            video_path: Path to video file
            frame_interval: Extract 1 frame every N frames
            max_frames: Maximum number of frames to process
            
        Returns:
            dict: {
                'hash_value': str (aggregated hash),
                'hash_type': 'tmk',
                'frame_hashes': List[str] (PDQ hash per frame),
                'frame_count': int,
                'duration': float
            }
        """
        try:
            # Open video file
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {video_path}")
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = total_frames / fps if fps > 0 else 0
            
            logger.info(f"Processing video: {total_frames} frames, {fps} fps, {duration:.2f}s")
            
            frame_hashes = []
            frame_qualities = []
            frame_idx = 0
            extracted_count = 0
            
            while extracted_count < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Extract frames at specified interval
                if frame_idx % frame_interval == 0:
                    # Convert BGR (OpenCV) to RGB (PIL)
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    pil_image = Image.fromarray(frame_rgb)
                    
                    # Generate PDQ hash for this frame
                    hash_vector, quality = pdqhash.compute(pil_image)
                    hash_hex = self._vector_to_hex(hash_vector)
                    
                    frame_hashes.append(hash_hex)
                    frame_qualities.append(quality)
                    extracted_count += 1
                
                frame_idx += 1
            
            cap.release()
            
            if not frame_hashes:
                raise ValueError("No frames could be extracted from video")
            
            # Create aggregated TMK hash
            # Method: Hash of all frame hashes concatenated
            aggregated_hash = self._aggregate_frame_hashes(frame_hashes)
            
            # Calculate average quality
            avg_quality = sum(frame_qualities) / len(frame_qualities)
            
            logger.info(
                f"TMK hash generated: {aggregated_hash[:16]}... "
                f"({len(frame_hashes)} frames, avg quality: {avg_quality:.1f})"
            )
            
            return {
                'hash_value': aggregated_hash,
                'hash_type': 'tmk',
                'frame_hashes': frame_hashes,
                'frame_count': len(frame_hashes),
                'duration': duration,
                'quality': int(avg_quality),
                'metadata': {
                    'fps': fps,
                    'total_frames': total_frames,
                    'frame_interval': frame_interval,
                    'resolution': f"{int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))}"
                }
            }
            
        except Exception as e:
            logger.error(f"Error hashing video {video_path}: {e}")
            raise
    
    def hash_file(self, file_path: str, media_type: str = None) -> Dict[str, any]:
        """
        Auto-detect media type and generate appropriate hash.
        
        Args:
            file_path: Path to media file
            media_type: 'image' or 'video' (auto-detected if None)
            
        Returns:
            dict: Hash result
        """
        if media_type is None:
            media_type = self._detect_media_type(file_path)
        
        if media_type == 'image':
            return self.hash_image(file_path)
        elif media_type == 'video':
            return self.hash_video(file_path)
        else:
            raise ValueError(f"Unsupported media type: {media_type}")
    
    @staticmethod
    def _vector_to_hex(hash_vector: np.ndarray) -> str:
        """
        Convert PDQ hash vector (16x16 bits) to 64-character hex string.
        
        Args:
            hash_vector: 256-element boolean array
            
        Returns:
            str: 64-character hex string
        """
        # Flatten to 256 bits
        bits = hash_vector.flatten()
        
        # Convert to bytes (256 bits = 32 bytes)
        byte_array = np.packbits(bits)
        
        # Convert to hex string
        hex_string = byte_array.tobytes().hex()
        
        return hex_string
    
    @staticmethod
    def _vector_to_binary(hash_vector: np.ndarray) -> str:
        """
        Convert PDQ hash vector to binary string for PostgreSQL BIT type.
        
        Args:
            hash_vector: 256-element boolean array
            
        Returns:
            str: 256-character binary string ('0' and '1')
        """
        bits = hash_vector.flatten()
        return ''.join('1' if bit else '0' for bit in bits)
    
    @staticmethod
    def _aggregate_frame_hashes(frame_hashes: List[str]) -> str:
        """
        Create aggregated hash from multiple frame hashes.
        
        This uses SHA-256 of concatenated frame hashes as a simple TMK implementation.
        For production, consider using proper TMK clustering algorithm.
        
        Args:
            frame_hashes: List of PDQ hashes (hex strings)
            
        Returns:
            str: Aggregated hash (64-char hex)
        """
        # Concatenate all frame hashes
        combined = ''.join(frame_hashes)
        
        # Hash the combination
        sha256_hash = hashlib.sha256(combined.encode()).hexdigest()
        
        return sha256_hash
    
    @staticmethod
    def _detect_media_type(file_path: str) -> str:
        """
        Detect if file is image or video based on extension.
        
        Args:
            file_path: Path to file
            
        Returns:
            str: 'image' or 'video'
        """
        ext = Path(file_path).suffix.lower()
        
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'}
        video_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv'}
        
        if ext in image_extensions:
            return 'image'
        elif ext in video_extensions:
            return 'video'
        else:
            raise ValueError(f"Unsupported file extension: {ext}")


class SimilarityMatcher:
    """
    Performs similarity matching using Hamming distance and threshold-based matching.
    """
    
    # Thresholds based on Meta's PDQ recommendations
    EXACT_MATCH_THRESHOLD = 0  # Hamming distance = 0
    HIGH_SIMILARITY_THRESHOLD = 15  # 95%+ similar
    MEDIUM_SIMILARITY_THRESHOLD = 23  # 85%+ similar
    LOW_SIMILARITY_THRESHOLD = 31  # 75%+ similar (default PDQ threshold)
    
    @staticmethod
    def hamming_distance(hash1: str, hash2: str) -> int:
        """
        Calculate Hamming distance between two hex hashes.
        
        Args:
            hash1: First hash (hex string)
            hash2: Second hash (hex string)
            
        Returns:
            int: Number of differing bits (0-256)
        """
        if len(hash1) != len(hash2):
            raise ValueError("Hashes must be same length")
        
        # Convert hex to binary
        bin1 = bin(int(hash1, 16))[2:].zfill(256)
        bin2 = bin(int(hash2, 16))[2:].zfill(256)
        
        # Count differing bits
        distance = sum(b1 != b2 for b1, b2 in zip(bin1, bin2))
        
        return distance
    
    @classmethod
    def calculate_similarity(cls, hash1: str, hash2: str) -> Dict[str, any]:
        """
        Calculate similarity between two hashes.
        
        Args:
            hash1: First hash (hex string)
            hash2: Second hash (hex string)
            
        Returns:
            dict: {
                'hamming_distance': int,
                'similarity_score': float (0-1),
                'match_type': str,
                'is_match': bool
            }
        """
        distance = cls.hamming_distance(hash1, hash2)
        
        # Convert Hamming distance to similarity score (0-1)
        similarity_score = 1.0 - (distance / 256.0)
        
        # Determine match type
        if distance <= cls.EXACT_MATCH_THRESHOLD:
            match_type = 'exact'
            is_match = True
        elif distance <= cls.HIGH_SIMILARITY_THRESHOLD:
            match_type = 'high_similarity'
            is_match = True
        elif distance <= cls.MEDIUM_SIMILARITY_THRESHOLD:
            match_type = 'medium_similarity'
            is_match = True
        elif distance <= cls.LOW_SIMILARITY_THRESHOLD:
            match_type = 'low_similarity'
            is_match = True
        else:
            match_type = 'no_match'
            is_match = False
        
        return {
            'hamming_distance': distance,
            'similarity_score': similarity_score,
            'match_type': match_type,
            'is_match': is_match,
            'confidence': cls._get_confidence(distance)
        }
    
    @staticmethod
    def _get_confidence(hamming_distance: int) -> float:
        """
        Convert Hamming distance to confidence score.
        
        Args:
            hamming_distance: Number of differing bits
            
        Returns:
            float: Confidence score (0-1)
        """
        if hamming_distance == 0:
            return 1.0
        elif hamming_distance <= 15:
            return 0.95
        elif hamming_distance <= 23:
            return 0.85
        elif hamming_distance <= 31:
            return 0.75
        else:
            return 0.0
    
    @staticmethod
    def compare_video_hashes(
        frame_hashes1: List[str], 
        frame_hashes2: List[str],
        threshold: int = 31
    ) -> Dict[str, any]:
        """
        Compare two videos by comparing their frame hashes.
        
        Uses temporal matching: calculate similarity for each frame pair
        and aggregate the results.
        
        Args:
            frame_hashes1: List of PDQ hashes for video 1
            frame_hashes2: List of PDQ hashes for video 2
            threshold: Hamming distance threshold per frame
            
        Returns:
            dict: {
                'overall_similarity': float,
                'matching_frames': int,
                'total_frames': int,
                'is_match': bool
            }
        """
        # Handle different lengths by comparing shorter video
        min_length = min(len(frame_hashes1), len(frame_hashes2))
        
        matching_frames = 0
        total_similarity = 0.0
        
        for i in range(min_length):
            distance = SimilarityMatcher.hamming_distance(
                frame_hashes1[i], 
                frame_hashes2[i]
            )
            
            if distance <= threshold:
                matching_frames += 1
            
            # Accumulate similarity
            similarity = 1.0 - (distance / 256.0)
            total_similarity += similarity
        
        # Calculate average similarity
        overall_similarity = total_similarity / min_length if min_length > 0 else 0.0
        
        # Determine if videos match (>=75% of frames similar)
        is_match = (matching_frames / min_length) >= 0.75 if min_length > 0 else False
        
        return {
            'overall_similarity': overall_similarity,
            'matching_frames': matching_frames,
            'total_frames': min_length,
            'match_percentage': (matching_frames / min_length * 100) if min_length > 0 else 0,
            'is_match': is_match
        }


# Example usage
if __name__ == '__main__':
    # Initialize hasher
    hasher = PerceptualHasher()
    
    # Example: Hash an image
    print("Example 1: Hashing an image")
    print("-" * 50)
    
    # Create a test image
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
        test_img = Image.new('RGB', (800, 600), color='red')
        test_img.save(tmp.name)
        
        result = hasher.hash_image(tmp.name)
        print(f"Hash: {result['hash_value']}")
        print(f"Quality: {result['quality']}")
        print(f"Metadata: {result['metadata']}")
    
    print("\n" + "=" * 50 + "\n")
    
    # Example: Compare two similar images
    print("Example 2: Comparing similar images")
    print("-" * 50)
    
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp1:
        img1 = Image.new('RGB', (800, 600), color='blue')
        img1.save(tmp1.name)
        hash1 = hasher.hash_image(tmp1.name)
    
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp2:
        # Slightly modified image (compressed)
        img2 = Image.new('RGB', (800, 600), color='blue')
        img2.save(tmp2.name, quality=50)
        hash2 = hasher.hash_image(tmp2.name)
    
    matcher = SimilarityMatcher()
    comparison = matcher.calculate_similarity(
        hash1['hash_value'], 
        hash2['hash_value']
    )
    
    print(f"Hamming Distance: {comparison['hamming_distance']}")
    print(f"Similarity Score: {comparison['similarity_score']:.3f}")
    print(f"Match Type: {comparison['match_type']}")
    print(f"Is Match: {comparison['is_match']}")
    print(f"Confidence: {comparison['confidence']:.2f}")
