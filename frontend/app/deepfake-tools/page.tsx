'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DeepfakeToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const realTools = [
    {
      id: 'faceswap',
      name: 'DeepFaceLab',
      category: 'Face Swap',
      icon: '🎭',
      description: 'Industry-standard face swap using deep learning',
      technology: 'Autoencoder Neural Networks',
      models: ['SAE (Separate Autoencoder)', 'SAEHD (High Definition)', 'Quick96', 'Avatar'],
      requirements: 'NVIDIA GPU (6GB+ VRAM), CUDA, cuDNN',
      accuracy: '95-98%',
      processing: '2-48 hours training',
      opensource: true,
      github: 'https://github.com/iperov/DeepFaceLab',
      features: [
        'Face extraction from video',
        'Face landmark detection (68 points)',
        'Custom model training',
        'XSeg face masking',
        'Real-time preview',
        'HD output (up to 4K)'
      ]
    },
    {
      id: 'faceswap2',
      name: 'FaceSwap',
      category: 'Face Swap',
      icon: '🔄',
      description: 'Open-source multi-face swap system',
      technology: 'CNN + GAN Architecture',
      models: ['Original', 'Villain', 'DFaker', 'DLight', 'IAE'],
      requirements: 'NVIDIA/AMD GPU, TensorFlow 2.x',
      accuracy: '90-95%',
      processing: '1-24 hours training',
      opensource: true,
      github: 'https://github.com/deepfakes/faceswap',
      features: [
        'Multi-face training',
        'Face alignment',
        'Color correction',
        'Augmentation options',
        'Plugin system',
        'GUI + CLI interface'
      ]
    },
    {
      id: 'stylegan',
      name: 'StyleGAN2/3',
      category: 'Face Generation',
      icon: '🎨',
      description: 'Generate photorealistic faces from scratch',
      technology: 'Style-based GAN Architecture',
      models: ['StyleGAN2', 'StyleGAN2-ADA', 'StyleGAN3'],
      requirements: 'NVIDIA GPU (12GB+ VRAM), PyTorch',
      accuracy: '99% photorealism',
      processing: 'Days-weeks for full training',
      opensource: true,
      github: 'https://github.com/NVlabs/stylegan3',
      features: [
        'High-resolution generation (1024x1024)',
        'Style mixing',
        'Latent space interpolation',
        'Attribute manipulation',
        'Transfer learning',
        'Few-shot adaptation'
      ]
    },
    {
      id: 'gfpgan',
      name: 'GFPGAN',
      category: 'Face Restoration',
      icon: '✨',
      description: 'Enhance and restore low-quality faces',
      technology: 'GAN-based Face Restoration',
      models: ['GFPGANv1.3', 'GFPGANv1.4', 'RestoreFormer'],
      requirements: 'NVIDIA GPU (4GB+ VRAM), PyTorch',
      accuracy: 'High quality restoration',
      processing: 'Real-time to seconds',
      opensource: true,
      github: 'https://github.com/TencentARC/GFPGAN',
      features: [
        'Face enhancement',
        'Detail recovery',
        'Color correction',
        'Blind face restoration',
        'Batch processing',
        'API integration'
      ]
    },
    {
      id: 'first-order',
      name: 'First Order Motion',
      category: 'Face Animation',
      icon: '🎬',
      description: 'Animate faces using driving video',
      technology: 'Keypoint-based Motion Transfer',
      models: ['FOMM', 'Face-vid2vid', 'Thin-Plate-Spline'],
      requirements: 'NVIDIA GPU (6GB+ VRAM), PyTorch',
      accuracy: '85-90% motion transfer',
      processing: 'Real-time inference',
      opensource: true,
      github: 'https://github.com/AliaksandrSiarohin/first-order-model',
      features: [
        'One-shot learning',
        'Driving video animation',
        'Face reenactment',
        'Expression transfer',
        'Head pose control',
        'Real-time processing'
      ]
    },
    {
      id: 'wav2lip',
      name: 'Wav2Lip',
      category: 'Lip Sync',
      icon: '🗣️',
      description: 'Accurate lip-sync to any audio',
      technology: 'Audio-Visual Synchronization',
      models: ['Wav2Lip', 'Wav2Lip_GAN'],
      requirements: 'NVIDIA GPU (4GB+ VRAM), PyTorch',
      accuracy: '95%+ lip sync accuracy',
      processing: 'Near real-time',
      opensource: true,
      github: 'https://github.com/Rudrabha/Wav2Lip',
      features: [
        'Any audio to any face',
        'Multi-language support',
        'HD output',
        'Batch processing',
        'Pre-trained models',
        'Easy fine-tuning'
      ]
    },
    {
      id: 'realesrgan',
      name: 'Real-ESRGAN',
      category: 'Video Enhancement',
      icon: '🎥',
      description: 'AI-powered video super-resolution',
      technology: 'Real-ESRGAN Architecture',
      models: ['RealESRGAN_x4plus', 'RealESRGANv2', 'anime model'],
      requirements: 'NVIDIA GPU (4GB+ VRAM), PyTorch',
      accuracy: '4x upscaling quality',
      processing: 'Seconds per frame',
      opensource: true,
      github: 'https://github.com/xinntao/Real-ESRGAN',
      features: [
        '4x video upscaling',
        'Noise reduction',
        'Artifact removal',
        'Anime specialized model',
        'Face enhancement mode',
        'Batch processing'
      ]
    },
    {
      id: 'sadtalker',
      name: 'SadTalker',
      category: 'Face Animation',
      icon: '🎤',
      description: 'Generate talking face videos from audio',
      technology: '3D Motion Coefficients + Neural Rendering',
      models: ['SadTalker', 'SadTalker-Sensitive'],
      requirements: 'NVIDIA GPU (6GB+ VRAM), PyTorch',
      accuracy: 'Natural head motion + lip sync',
      processing: '30-60 seconds per video',
      opensource: true,
      github: 'https://github.com/OpenTalker/SadTalker',
      features: [
        'Audio-driven animation',
        'Natural head motion',
        'Emotional expressions',
        'Still image input',
        '3D aware rendering',
        'Multi-person support'
      ]
    },
    {
      id: 'roop',
      name: 'Roop',
      category: 'Face Swap',
      icon: '⚡',
      description: 'One-click face swap in videos',
      technology: 'InsightFace + GFPGAN',
      models: ['inswapper_128', 'buffalo_l'],
      requirements: 'NVIDIA GPU (4GB+ VRAM), Python',
      accuracy: '90-95% single face',
      processing: 'Real-time to minutes',
      opensource: true,
      github: 'https://github.com/s0md3v/roop',
      features: [
        'One-click operation',
        'Video face swap',
        'Multiple faces support',
        'GPU acceleration',
        'Enhancement options',
        'Simple interface'
      ]
    },
    {
      id: 'codeformer',
      name: 'CodeFormer',
      category: 'Face Restoration',
      icon: '🔧',
      description: 'Robust face restoration with fidelity control',
      technology: 'VQ-Transformer Architecture',
      models: ['CodeFormer'],
      requirements: 'NVIDIA GPU (4GB+ VRAM), PyTorch',
      accuracy: 'Controllable quality/fidelity',
      processing: 'Seconds per image',
      opensource: true,
      github: 'https://github.com/sczhou/CodeFormer',
      features: [
        'Fidelity control slider',
        'Blind face restoration',
        'Old photo restoration',
        'Color enhancement',
        'Background upscaling',
        'Batch processing'
      ]
    },
    {
      id: 'facefusion',
      name: 'FaceFusion',
      category: 'Face Swap',
      icon: '🚀',
      description: 'Next-gen face swap with multiple enhancers',
      technology: 'Multi-model Fusion Pipeline',
      models: ['inswapper', 'GFPGAN', 'CodeFormer', 'GPEN'],
      requirements: 'NVIDIA GPU (6GB+ VRAM), Python',
      accuracy: '95%+ with enhancement',
      processing: 'Near real-time',
      opensource: true,
      github: 'https://github.com/facefusion/facefusion',
      features: [
        'Multi-enhancer support',
        'Video processing',
        'Live camera mode',
        'GPU optimization',
        'Quality presets',
        'Frame interpolation'
      ]
    },
    {
      id: 'mediaipe',
      name: 'MediaPipe Face',
      category: 'Face Detection',
      icon: '📍',
      description: 'Real-time face mesh detection',
      technology: 'Google MediaPipe ML',
      models: ['Face Mesh (468 landmarks)', 'Face Detection'],
      requirements: 'CPU/GPU, JavaScript/Python',
      accuracy: '99%+ detection',
      processing: 'Real-time (60+ FPS)',
      opensource: true,
      github: 'https://github.com/google/mediapipe',
      features: [
        '468 face landmarks',
        'Real-time performance',
        'Cross-platform',
        'WebGL acceleration',
        'Mobile support',
        'Face geometry'
      ]
    },
    {
      id: 'dlib',
      name: 'Dlib Face Recognition',
      category: 'Face Detection',
      icon: '🎯',
      description: 'High-accuracy face detection and recognition',
      technology: 'HOG + CNN Face Detector',
      models: ['HOG', 'CNN', '68-point predictor'],
      requirements: 'CPU/GPU, C++/Python',
      accuracy: '99.38% on LFW',
      processing: 'Fast CPU inference',
      opensource: true,
      github: 'https://github.com/davisking/dlib',
      features: [
        '68 facial landmarks',
        'Face recognition',
        'Age/gender detection',
        'Emotion detection',
        'CPU optimized',
        'Production ready'
      ]
    },
    {
      id: 'simswap',
      name: 'SimSwap',
      category: 'Face Swap',
      icon: '🎪',
      description: 'Arbitrary face swap with weak supervision',
      technology: 'Identity Injection + Weak Supervision',
      models: ['SimSwap 224', 'SimSwap 512'],
      requirements: 'NVIDIA GPU (8GB+ VRAM), PyTorch',
      accuracy: '92-96% identity preservation',
      processing: 'Minutes per video',
      opensource: true,
      github: 'https://github.com/neuralchen/SimSwap',
      features: [
        'Arbitrary face swap',
        'Video processing',
        'ID preservation',
        'Attribute transfer',
        'Official models',
        'Training code'
      ]
    },
    {
      id: 'deepfacelive',
      name: 'DeepFaceLive',
      category: 'Live Streaming',
      icon: '📹',
      description: 'Real-time face swap for streaming',
      technology: 'Optimized DeepFaceLab Models',
      models: ['RTM (Real-Time Model)', 'XSeg masking'],
      requirements: 'NVIDIA GPU (6GB+ VRAM), Windows',
      accuracy: '85-90% real-time',
      processing: 'Real-time (30+ FPS)',
      opensource: true,
      github: 'https://github.com/iperov/DeepFaceLive',
      features: [
        'Live webcam swap',
        'Virtual camera output',
        'Streaming compatible',
        'Low latency',
        'Face detection',
        'OBS integration'
      ]
    }
  ];

  const categories = ['all', 'Face Swap', 'Face Generation', 'Face Restoration', 'Face Animation', 'Lip Sync', 'Video Enhancement', 'Face Detection', 'Live Streaming'];

  const filteredTools = selectedCategory === 'all' 
    ? realTools 
    : realTools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🔬 Real Deepfake Tools & Models
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-6">
            Professional-grade AI models and frameworks used in actual deepfake production. All open-source, production-ready tools with real ML implementations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
              <span className="text-green-300 font-medium">✅ {realTools.length} Production Tools</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <span className="text-blue-300 font-medium">🔓 100% Open Source</span>
            </div>
            <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg">
              <span className="text-purple-300 font-medium">Real ML Models</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category === 'all' ? '🌐 All Tools' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <div key={tool.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:border-purple-500/50 transition-all hover:scale-[1.02]">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                  <span className="text-sm text-purple-300">{tool.category}</span>
                </div>
                {tool.opensource && (
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-300">
                    Open Source
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4">{tool.description}</p>

              {/* Technology */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Technology:</div>
                <div className="text-sm text-white font-medium">{tool.technology}</div>
              </div>

              {/* Models */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Available Models:</div>
                <div className="flex flex-wrap gap-1">
                  {tool.models.map((model, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/5 rounded p-2">
                  <div className="text-xs text-gray-400">Accuracy</div>
                  <div className="text-sm text-white font-bold">{tool.accuracy}</div>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <div className="text-xs text-gray-400">Processing</div>
                  <div className="text-sm text-white font-bold text-xs">{tool.processing}</div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">Requirements:</div>
                <div className="text-xs text-gray-300">{tool.requirements}</div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Key Features:</div>
                <ul className="space-y-1">
                  {tool.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-1">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GitHub Link */}
              <a
                href={tool.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center rounded-lg font-medium hover:shadow-lg transition-all"
              >
                📦 View on GitHub
              </a>
            </div>
          ))}
        </div>

        {/* Implementation Guide */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-6">🛠️ Implementation Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🖥️ Hardware Requirements</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <div>
                    <strong>GPU:</strong> NVIDIA RTX 3060+ (8GB+ VRAM recommended)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <div>
                    <strong>RAM:</strong> 16GB+ system memory
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <div>
                    <strong>Storage:</strong> 50GB+ for models and datasets
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <div>
                    <strong>CUDA:</strong> 11.8+ with cuDNN 8.9+
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📚 Software Stack</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <div>
                    <strong>Python:</strong> 3.10+ with pip/conda
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <div>
                    <strong>PyTorch:</strong> 2.0+ or TensorFlow 2.13+
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <div>
                    <strong>OpenCV:</strong> 4.8+ for video processing
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <div>
                    <strong>FFmpeg:</strong> For video encoding/decoding
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">⚠️ Production Deployment</h3>
            <p className="text-gray-300 mb-4">
              These tools require significant computational resources. For production use:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Use cloud GPU instances (AWS EC2 P3, GCP A100, Azure NC-series)</li>
              <li>• Implement model optimization (ONNX, TensorRT, quantization)</li>
              <li>• Set up load balancing and queue systems for batch processing</li>
              <li>• Monitor GPU usage and implement auto-scaling</li>
              <li>• Use model caching and pre-warming for faster inference</li>
            </ul>
          </div>
        </div>

        {/* Ethics Notice */}
        <div className="mt-8 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-3">⚖️ Ethical Use & Legal Notice</h3>
          <p className="text-gray-300">
            These are powerful tools that should be used responsibly. Always obtain consent before creating deepfakes of individuals. 
            Deepfake technology can be misused for fraud, defamation, and spreading misinformation. Many jurisdictions have laws 
            against malicious deepfake creation. This documentation is for educational and legitimate use cases only (entertainment, 
            film production, research, etc.). Our detection platform exists to combat malicious deepfakes.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
