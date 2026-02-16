"""
Deepfake Detection Service
===========================

Implements ensemble deepfake detection using:
- XceptionNet (primary detector)
- EfficientNet-B7 (secondary detector)
- Vision Transformer (ViT-Base) (tertiary detector)
- CLIP embeddings (for semantic similarity)

Models are pre-trained on FaceForensics++ and fine-tuned for production use.

Installation:
    pip install torch torchvision timm transformers pillow opencv-python numpy

References:
- XceptionNet: https://arxiv.org/abs/1610.02357
- EfficientNet: https://arxiv.org/abs/1905.11946
- ViT: https://arxiv.org/abs/2010.11929
- FaceForensics++: https://github.com/ondyari/FaceForensics
"""

import logging
from typing import Dict, List, Tuple, Optional
from pathlib import Path
import tempfile

import cv2
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
import timm  # PyTorch Image Models

# For CLIP embeddings
try:
    from transformers import CLIPProcessor, CLIPModel
    CLIP_AVAILABLE = True
except ImportError:
    CLIP_AVAILABLE = False
    logging.warning("transformers not available for CLIP. Install with: pip install transformers")

logger = logging.getLogger(__name__)


class DeepfakeDetector:
    """
    Ensemble deepfake detector using multiple models.
    """
    
    # Model weights (adjust based on validation performance)
    XCEPTION_WEIGHT = 0.50
    EFFICIENTNET_WEIGHT = 0.30
    VIT_WEIGHT = 0.20
    
    # Detection threshold
    DEEPFAKE_THRESHOLD = 0.65
    
    def __init__(
        self,
        device: str = 'cuda' if torch.cuda.is_available() else 'cpu',
        model_dir: str = './ml_models/checkpoints'
    ):
        """
        Initialize the ensemble detector.
        
        Args:
            device: 'cuda' or 'cpu'
            model_dir: Directory containing model checkpoints
        """
        self.device = torch.device(device)
        self.model_dir = Path(model_dir)
        
        logger.info(f"Initializing DeepfakeDetector on {device}")
        
        # Load models
        self.xception_model = self._load_xception()
        self.efficientnet_model = self._load_efficientnet()
        self.vit_model = self._load_vit()
        
        # Load CLIP for embeddings
        if CLIP_AVAILABLE:
            self.clip_model, self.clip_processor = self._load_clip()
        else:
            self.clip_model = None
            self.clip_processor = None
        
        # Define preprocessing transforms
        self.xception_transform = transforms.Compose([
            transforms.Resize((299, 299)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
        ])
        
        self.efficientnet_transform = transforms.Compose([
            transforms.Resize((600, 600)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        self.vit_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
        ])
        
        logger.info("DeepfakeDetector initialized successfully")
    
    def _load_xception(self) -> nn.Module:
        """
        Load XceptionNet model.
        
        Uses timm's implementation with custom classifier head.
        """
        try:
            # Load pre-trained Xception
            model = timm.create_model('xception', pretrained=True, num_classes=2)
            
            # Try to load fine-tuned weights
            checkpoint_path = self.model_dir / 'xception_deepfake.pth'
            if checkpoint_path.exists():
                logger.info(f"Loading XceptionNet checkpoint: {checkpoint_path}")
                model.load_state_dict(torch.load(checkpoint_path, map_location=self.device))
            else:
                logger.warning("XceptionNet checkpoint not found, using ImageNet weights")
            
            model.to(self.device)
            model.eval()
            
            return model
            
        except Exception as e:
            logger.error(f"Error loading XceptionNet: {e}")
            raise
    
    def _load_efficientnet(self) -> nn.Module:
        """
        Load EfficientNet-B7 model.
        """
        try:
            # Load pre-trained EfficientNet-B7
            model = timm.create_model('efficientnet_b7', pretrained=True, num_classes=2)
            
            # Try to load fine-tuned weights
            checkpoint_path = self.model_dir / 'efficientnet_b7_deepfake.pth'
            if checkpoint_path.exists():
                logger.info(f"Loading EfficientNet-B7 checkpoint: {checkpoint_path}")
                model.load_state_dict(torch.load(checkpoint_path, map_location=self.device))
            else:
                logger.warning("EfficientNet-B7 checkpoint not found, using ImageNet weights")
            
            model.to(self.device)
            model.eval()
            
            return model
            
        except Exception as e:
            logger.error(f"Error loading EfficientNet-B7: {e}")
            raise
    
    def _load_vit(self) -> nn.Module:
        """
        Load Vision Transformer (ViT-Base) model.
        """
        try:
            # Load pre-trained ViT-Base
            model = timm.create_model('vit_base_patch16_224', pretrained=True, num_classes=2)
            
            # Try to load fine-tuned weights
            checkpoint_path = self.model_dir / 'vit_base_deepfake.pth'
            if checkpoint_path.exists():
                logger.info(f"Loading ViT-Base checkpoint: {checkpoint_path}")
                model.load_state_dict(torch.load(checkpoint_path, map_location=self.device))
            else:
                logger.warning("ViT-Base checkpoint not found, using ImageNet weights")
            
            model.to(self.device)
            model.eval()
            
            return model
            
        except Exception as e:
            logger.error(f"Error loading ViT-Base: {e}")
            raise
    
    def _load_clip(self) -> Tuple[nn.Module, any]:
        """
        Load CLIP model for generating embeddings.
        """
        try:
            model_name = "openai/clip-vit-base-patch32"
            model = CLIPModel.from_pretrained(model_name).to(self.device)
            processor = CLIPProcessor.from_pretrained(model_name)
            
            model.eval()
            
            logger.info("CLIP model loaded successfully")
            return model, processor
            
        except Exception as e:
            logger.error(f"Error loading CLIP: {e}")
            return None, None
    
    @torch.no_grad()
    def detect_image(self, image_path: str) -> Dict[str, any]:
        """
        Detect if an image is a deepfake using ensemble of models.
        
        Args:
            image_path: Path to image file
            
        Returns:
            dict: {
                'is_deepfake': bool,
                'confidence': float (0-1),
                'model_scores': dict,
                'ensemble_score': float,
                'embedding': list (512-dim vector)
            }
        """
        try:
            # Load image
            image = Image.open(image_path).convert('RGB')
            
            # Run each model
            xception_score = self._predict_xception(image)
            efficientnet_score = self._predict_efficientnet(image)
            vit_score = self._predict_vit(image)
            
            # Calculate weighted ensemble score
            ensemble_score = (
                xception_score * self.XCEPTION_WEIGHT +
                efficientnet_score * self.EFFICIENTNET_WEIGHT +
                vit_score * self.VIT_WEIGHT
            )
            
            # Determine if deepfake
            is_deepfake = ensemble_score >= self.DEEPFAKE_THRESHOLD
            
            # Generate CLIP embedding
            embedding = self._generate_clip_embedding(image) if self.clip_model else None
            
            result = {
                'is_deepfake': is_deepfake,
                'confidence': float(ensemble_score),
                'model_scores': {
                    'xception': float(xception_score),
                    'efficientnet': float(efficientnet_score),
                    'vit': float(vit_score)
                },
                'ensemble_score': float(ensemble_score),
                'embedding': embedding,
                'detection_model': 'Ensemble(XceptionNet+EfficientNet-B7+ViT)',
                'threshold': self.DEEPFAKE_THRESHOLD
            }
            
            logger.info(
                f"Detection result: {'DEEPFAKE' if is_deepfake else 'REAL'} "
                f"(confidence: {ensemble_score:.3f})"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error detecting image {image_path}: {e}")
            raise
    
    @torch.no_grad()
    def detect_video(
        self,
        video_path: str,
        frame_interval: int = 30,
        max_frames: int = 100
    ) -> Dict[str, any]:
        """
        Detect if a video contains deepfakes by analyzing multiple frames.
        
        Args:
            video_path: Path to video file
            frame_interval: Extract 1 frame every N frames
            max_frames: Maximum number of frames to analyze
            
        Returns:
            dict: {
                'is_deepfake': bool,
                'confidence': float (0-1),
                'frame_scores': list,
                'deepfake_frame_count': int,
                'total_frames_analyzed': int,
                'temporal_consistency': float
            }
        """
        try:
            # Open video
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {video_path}")
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            logger.info(f"Analyzing video: {total_frames} frames @ {fps} fps")
            
            frame_results = []
            frame_idx = 0
            analyzed_count = 0
            
            while analyzed_count < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Analyze frames at specified interval
                if frame_idx % frame_interval == 0:
                    # Convert BGR to RGB
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    pil_image = Image.fromarray(frame_rgb)
                    
                    # Run detection on this frame
                    xception_score = self._predict_xception(pil_image)
                    efficientnet_score = self._predict_efficientnet(pil_image)
                    vit_score = self._predict_vit(pil_image)
                    
                    ensemble_score = (
                        xception_score * self.XCEPTION_WEIGHT +
                        efficientnet_score * self.EFFICIENTNET_WEIGHT +
                        vit_score * self.VIT_WEIGHT
                    )
                    
                    frame_results.append({
                        'frame_idx': frame_idx,
                        'timestamp': frame_idx / fps if fps > 0 else 0,
                        'ensemble_score': float(ensemble_score),
                        'is_deepfake': ensemble_score >= self.DEEPFAKE_THRESHOLD
                    })
                    
                    analyzed_count += 1
                
                frame_idx += 1
            
            cap.release()
            
            if not frame_results:
                raise ValueError("No frames could be analyzed")
            
            # Aggregate results
            deepfake_frames = sum(1 for r in frame_results if r['is_deepfake'])
            avg_confidence = sum(r['ensemble_score'] for r in frame_results) / len(frame_results)
            
            # Calculate temporal consistency (standard deviation of scores)
            scores = [r['ensemble_score'] for r in frame_results]
            temporal_consistency = 1.0 - (np.std(scores) if len(scores) > 1 else 0.0)
            
            # Video is deepfake if >50% of frames are deepfakes
            is_deepfake = (deepfake_frames / len(frame_results)) > 0.5
            
            result = {
                'is_deepfake': is_deepfake,
                'confidence': float(avg_confidence),
                'frame_scores': frame_results,
                'deepfake_frame_count': deepfake_frames,
                'total_frames_analyzed': len(frame_results),
                'deepfake_percentage': (deepfake_frames / len(frame_results) * 100),
                'temporal_consistency': float(temporal_consistency),
                'detection_model': 'Ensemble(XceptionNet+EfficientNet-B7+ViT)',
                'metadata': {
                    'fps': fps,
                    'total_frames': total_frames,
                    'frame_interval': frame_interval
                }
            }
            
            logger.info(
                f"Video detection: {'DEEPFAKE' if is_deepfake else 'REAL'} "
                f"({deepfake_frames}/{len(frame_results)} frames, "
                f"confidence: {avg_confidence:.3f})"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error detecting video {video_path}: {e}")
            raise
    
    @torch.no_grad()
    def _predict_xception(self, image: Image.Image) -> float:
        """
        Get deepfake probability from XceptionNet.
        
        Returns:
            float: Probability of being deepfake (0-1)
        """
        # Preprocess
        input_tensor = self.xception_transform(image).unsqueeze(0).to(self.device)
        
        # Forward pass
        logits = self.xception_model(input_tensor)
        probs = F.softmax(logits, dim=1)
        
        # Return probability of class 1 (deepfake)
        return probs[0, 1].item()
    
    @torch.no_grad()
    def _predict_efficientnet(self, image: Image.Image) -> float:
        """
        Get deepfake probability from EfficientNet-B7.
        
        Returns:
            float: Probability of being deepfake (0-1)
        """
        # Preprocess
        input_tensor = self.efficientnet_transform(image).unsqueeze(0).to(self.device)
        
        # Forward pass
        logits = self.efficientnet_model(input_tensor)
        probs = F.softmax(logits, dim=1)
        
        # Return probability of class 1 (deepfake)
        return probs[0, 1].item()
    
    @torch.no_grad()
    def _predict_vit(self, image: Image.Image) -> float:
        """
        Get deepfake probability from Vision Transformer.
        
        Returns:
            float: Probability of being deepfake (0-1)
        """
        # Preprocess
        input_tensor = self.vit_transform(image).unsqueeze(0).to(self.device)
        
        # Forward pass
        logits = self.vit_model(input_tensor)
        probs = F.softmax(logits, dim=1)
        
        # Return probability of class 1 (deepfake)
        return probs[0, 1].item()
    
    @torch.no_grad()
    def _generate_clip_embedding(self, image: Image.Image) -> List[float]:
        """
        Generate CLIP embedding for semantic similarity.
        
        Returns:
            List[float]: 512-dimensional embedding vector
        """
        if not self.clip_model or not self.clip_processor:
            return None
        
        try:
            # Preprocess
            inputs = self.clip_processor(images=image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Generate embedding
            outputs = self.clip_model.get_image_features(**inputs)
            
            # Normalize
            embedding = F.normalize(outputs, p=2, dim=1)
            
            # Convert to list
            return embedding[0].cpu().numpy().tolist()
            
        except Exception as e:
            logger.error(f"Error generating CLIP embedding: {e}")
            return None
    
    def detect_file(self, file_path: str, media_type: str = None) -> Dict[str, any]:
        """
        Auto-detect media type and run appropriate detection.
        
        Args:
            file_path: Path to media file
            media_type: 'image' or 'video' (auto-detected if None)
            
        Returns:
            dict: Detection result
        """
        if media_type is None:
            media_type = self._detect_media_type(file_path)
        
        if media_type == 'image':
            return self.detect_image(file_path)
        elif media_type == 'video':
            return self.detect_video(file_path)
        else:
            raise ValueError(f"Unsupported media type: {media_type}")
    
    @staticmethod
    def _detect_media_type(file_path: str) -> str:
        """
        Detect if file is image or video based on extension.
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


class EmbeddingSimilarity:
    """
    Calculate similarity between embeddings (semantic similarity).
    """
    
    @staticmethod
    def cosine_similarity(embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            float: Cosine similarity (0-1, higher = more similar)
        """
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        
        # Calculate cosine similarity
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        similarity = dot_product / (norm1 * norm2)
        
        # Convert to 0-1 range (cosine similarity is -1 to 1)
        similarity = (similarity + 1) / 2
        
        return float(similarity)
    
    @classmethod
    def is_similar(
        cls,
        embedding1: List[float],
        embedding2: List[float],
        threshold: float = 0.90
    ) -> Dict[str, any]:
        """
        Determine if two embeddings represent similar content.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            threshold: Similarity threshold (default: 0.90)
            
        Returns:
            dict: {
                'similarity': float,
                'is_similar': bool,
                'confidence': str
            }
        """
        similarity = cls.cosine_similarity(embedding1, embedding2)
        
        is_similar = similarity >= threshold
        
        if similarity >= 0.95:
            confidence = 'very_high'
        elif similarity >= 0.90:
            confidence = 'high'
        elif similarity >= 0.80:
            confidence = 'medium'
        elif similarity >= 0.70:
            confidence = 'low'
        else:
            confidence = 'very_low'
        
        return {
            'similarity': similarity,
            'is_similar': is_similar,
            'confidence': confidence,
            'threshold': threshold
        }


# Example usage
if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python deepfake_detection.py <image_or_video_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    # Initialize detector
    print("Loading models...")
    detector = DeepfakeDetector()
    
    # Run detection
    print(f"\nAnalyzing: {file_path}")
    result = detector.detect_file(file_path)
    
    # Print results
    print("\n" + "=" * 50)
    print("DETECTION RESULTS")
    print("=" * 50)
    print(f"Is Deepfake: {result['is_deepfake']}")
    print(f"Confidence: {result['confidence']:.3f}")
    
    if 'model_scores' in result:
        print("\nModel Scores:")
        for model, score in result['model_scores'].items():
            print(f"  {model}: {score:.3f}")
    
    if 'frame_scores' in result:
        print(f"\nFrames Analyzed: {result['total_frames_analyzed']}")
        print(f"Deepfake Frames: {result['deepfake_frame_count']}")
        print(f"Deepfake %: {result['deepfake_percentage']:.1f}%")
        print(f"Temporal Consistency: {result['temporal_consistency']:.3f}")
    
    print("=" * 50)
