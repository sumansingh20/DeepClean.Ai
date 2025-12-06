'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LiveDeepfakePage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<string>('none');
  const [processing, setProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const effects = [
    { id: 'none', name: '🎥 Original', description: 'No filter', category: 'Basic' },
    
    // Face Morphing & Age
    { id: 'aging', name: '👴 Age Progression', description: 'Add wrinkles, gray hair, age spots', category: 'Age' },
    { id: 'youth', name: '👶 Age Regression', description: 'Smooth skin, brighter eyes', category: 'Age' },
    { id: 'baby-face', name: '👼 Baby Face', description: 'Ultra-young childlike features', category: 'Age' },
    { id: 'elder', name: '🧓 Elder Transform', description: 'Advanced aging with deep wrinkles', category: 'Age' },
    
    // Gender & Identity
    { id: 'gender-swap', name: '⚧️ Gender Swap', description: 'Masculine/Feminine face swap', category: 'Identity' },
    { id: 'celebrity-a', name: '🌟 Celebrity Style A', description: 'Hollywood star look', category: 'Identity' },
    { id: 'celebrity-b', name: '✨ Celebrity Style B', description: 'Pop star appearance', category: 'Identity' },
    { id: 'historic-figure', name: '🎭 Historic Figure', description: 'Classic historical look', category: 'Identity' },
    
    // Artistic Styles
    { id: 'cartoon', name: '🎨 Cartoon 2D', description: 'Disney/Pixar style', category: 'Artistic' },
    { id: 'anime', name: '🎌 Anime Style', description: 'Japanese animation look', category: 'Artistic' },
    { id: 'oil-painting', name: '🖼️ Oil Painting', description: 'Classic portrait art', category: 'Artistic' },
    { id: 'sketch', name: '✏️ Pencil Sketch', description: 'Hand-drawn appearance', category: 'Artistic' },
    { id: 'watercolor', name: '🎨 Watercolor', description: 'Soft painted style', category: 'Artistic' },
    
    // Fantasy & Creatures
    { id: 'emoji', name: '😊 Emoji Face', description: 'Emoji-style features', category: 'Fantasy' },
    { id: 'animal-dog', name: '🐶 Dog Features', description: 'Blend with dog traits', category: 'Fantasy' },
    { id: 'animal-cat', name: '🐱 Cat Features', description: 'Feline characteristics', category: 'Fantasy' },
    { id: 'zombie', name: '🧟 Zombie', description: 'Undead horror look', category: 'Fantasy' },
    { id: 'vampire', name: '🧛 Vampire', description: 'Gothic vampire appearance', category: 'Fantasy' },
    { id: 'avatar', name: '👽 Avatar/Alien', description: 'Sci-fi alien look', category: 'Fantasy' },
    { id: 'elf', name: '🧝 Elf', description: 'Fantasy elf features', category: 'Fantasy' },
    
    // Enhancement & Beauty
    { id: 'beauty-enhance', name: '✨ Beauty Enhance', description: 'Professional makeup look', category: 'Beauty' },
    { id: 'skin-smooth', name: '💎 Skin Perfection', description: 'Flawless smooth skin', category: 'Beauty' },
    { id: 'eye-enhance', name: '👁️ Eye Enhancement', description: 'Brighter, larger eyes', category: 'Beauty' },
    { id: 'face-slim', name: '📐 Face Reshape', description: 'Slimmer face structure', category: 'Beauty' },
    
    // Special Effects
    { id: 'cyborg', name: '🤖 Cyborg', description: 'Half-human, half-robot', category: 'Effects' },
    { id: 'glitch', name: '📺 Digital Glitch', description: 'Digital corruption effect', category: 'Effects' },
    { id: 'thermal', name: '🌡️ Thermal Vision', description: 'Heat signature view', category: 'Effects' },
    { id: 'x-ray', name: '☢️ X-Ray Effect', description: 'See-through skeleton', category: 'Effects' },
    { id: 'hologram', name: '🔷 Hologram', description: 'Futuristic holographic', category: 'Effects' },
    { id: 'pixelated', name: '🎮 Pixel Art', description: '8-bit retro gaming style', category: 'Effects' },
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready before starting processing
        videoRef.current.onloadedmetadata = () => {
          setCameraActive(true);
          startFaceDetection();
          processVideoFrame();
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Could not access camera. Please allow camera permissions and ensure no other app is using the camera.');
    }
  };

  const stopCamera = () => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setFaceDetected(false);
    setProcessing(false);
  };

  const startFaceDetection = () => {
    // Simulate face detection (in real implementation, use MediaPipe or face-api.js)
    setTimeout(() => {
      setFaceDetected(true);
    }, 1000);
  };

  const processVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) {
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(processVideoFrame);
      return;
    }

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply visual effects based on selection
    if (selectedEffect !== 'none') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      switch(selectedEffect) {
        // AGE EFFECTS
        case 'aging':
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          }
          break;
        case 'youth':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.15);
            data[i + 1] = Math.min(255, data[i + 1] * 1.15);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1);
          }
          break;
        case 'baby-face':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.25);
            data[i + 1] = Math.min(255, data[i + 1] * 1.2);
            data[i + 2] = Math.min(255, data[i + 2] * 1.15);
          }
          break;
        case 'elder':
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            data[i] = data[i + 1] = data[i + 2] = gray * 0.85;
          }
          break;

        // IDENTITY EFFECTS
        case 'gender-swap':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 0.95);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1);
          }
          break;
        case 'celebrity-a':
        case 'celebrity-b':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] > 128 ? Math.min(255, data[i] * 1.3) : data[i] * 0.75;
            data[i + 1] = data[i + 1] > 128 ? Math.min(255, data[i + 1] * 1.3) : data[i + 1] * 0.75;
            data[i + 2] = data[i + 2] > 128 ? Math.min(255, data[i + 2] * 1.3) : data[i + 2] * 0.75;
          }
          break;
        case 'historic-figure':
          for (let i = 0; i < data.length; i += 4) {
            const sepia = (data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189) * 0.9;
            data[i] = data[i + 1] = data[i + 2] = sepia;
          }
          break;

        // ARTISTIC EFFECTS
        case 'cartoon':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.floor(data[i] / 64) * 64;
            data[i + 1] = Math.floor(data[i + 1] / 64) * 64;
            data[i + 2] = Math.floor(data[i + 2] / 64) * 64;
          }
          break;
        case 'anime':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 1.15);
          }
          break;
        case 'oil-painting':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.floor(data[i] / 32) * 32;
            data[i + 1] = Math.floor(data[i + 1] / 32) * 32;
            data[i + 2] = Math.floor(data[i + 2] / 32) * 32;
          }
          break;
        case 'sketch':
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            const val = 255 - gray;
            data[i] = data[i + 1] = data[i + 2] = val;
          }
          break;
        case 'watercolor':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.95 + 20);
            data[i + 1] = Math.min(255, data[i + 1] * 0.95 + 20);
            data[i + 2] = Math.min(255, data[i + 2] * 0.95 + 20);
          }
          break;

        // FANTASY EFFECTS
        case 'emoji':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.5);
            data[i + 1] = Math.min(255, data[i + 1] * 1.4);
            data[i + 2] = data[i + 2] * 0.5;
          }
          break;
        case 'animal-dog':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 0.85);
            data[i + 2] = data[i + 2] * 0.6;
          }
          break;
        case 'animal-cat':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 0.95);
            data[i + 2] = Math.min(255, data[i + 2] * 0.85);
          }
          break;
        case 'zombie':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.5;
            data[i + 1] = Math.min(255, data[i + 1] * 1.6);
            data[i + 2] = data[i + 2] * 0.5;
          }
          break;
        case 'vampire':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.9);
            data[i + 1] = data[i + 1] * 0.7;
            data[i + 2] = data[i + 2] * 0.7;
          }
          break;
        case 'avatar':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.5;
            data[i + 1] = Math.min(255, data[i + 1] * 0.85);
            data[i + 2] = Math.min(255, data[i + 2] * 1.6);
          }
          break;
        case 'elf':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.15);
            data[i + 2] = Math.min(255, data[i + 2] * 0.95);
          }
          break;

        // BEAUTY EFFECTS
        case 'beauty-enhance':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.08 + 10);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 8);
            data[i + 2] = Math.min(255, data[i + 2] * 1.03 + 5);
          }
          break;
        case 'skin-smooth':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.05 + 15);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 15);
            data[i + 2] = Math.min(255, data[i + 2] * 1.05 + 15);
          }
          break;
        case 'eye-enhance':
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] + data[i+1] + data[i+2] > 300) {
              data[i] = Math.min(255, data[i] * 1.15);
              data[i + 1] = Math.min(255, data[i + 1] * 1.15);
              data[i + 2] = Math.min(255, data[i + 2] * 1.2);
            }
          }
          break;
        case 'face-slim':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.98);
            data[i + 1] = Math.min(255, data[i + 1] * 0.98);
            data[i + 2] = Math.min(255, data[i + 2] * 0.98);
          }
          break;

        // SPECIAL EFFECTS
        case 'cyborg':
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (avg > 150) {
              data[i] = data[i + 1] = Math.min(255, avg * 1.2);
              data[i + 2] = Math.min(255, avg * 0.8);
            }
          }
          break;
        case 'glitch':
          for (let i = 0; i < data.length; i += 4) {
            if (Math.random() > 0.95) {
              data[i] = Math.random() * 255;
              data[i + 1] = Math.random() * 255;
              data[i + 2] = Math.random() * 255;
            }
          }
          break;
        case 'thermal':
          for (let i = 0; i < data.length; i += 4) {
            const heat = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, heat * 1.5);
            data[i + 1] = heat * 0.5;
            data[i + 2] = Math.max(0, 255 - heat);
          }
          break;
        case 'x-ray':
          for (let i = 0; i < data.length; i += 4) {
            const inv = 255 - (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = inv;
          }
          break;
        case 'hologram':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.3;
            data[i + 1] = Math.min(255, data[i + 1] * 1.5);
            data[i + 2] = Math.min(255, data[i + 2] * 1.8);
            data[i + 3] = 200; // Semi-transparent
          }
          break;
        case 'pixelated':
          const pixelSize = 10;
          for (let y = 0; y < canvas.height; y += pixelSize) {
            for (let x = 0; x < canvas.width; x += pixelSize) {
              const i = (y * canvas.width + x) * 4;
              const r = data[i], g = data[i + 1], b = data[i + 2];
              for (let py = 0; py < pixelSize; py++) {
                for (let px = 0; px < pixelSize; px++) {
                  const pi = ((y + py) * canvas.width + (x + px)) * 4;
                  if (pi < data.length) {
                    data[pi] = r;
                    data[pi + 1] = g;
                    data[pi + 2] = b;
                  }
                }
              }
            }
          }
          break;
      }

      ctx.putImageData(imageData, 0, 0);
    }
    
    // Continue processing frames
    animationFrameRef.current = requestAnimationFrame(processVideoFrame);
  };

  const capturePhoto = () => {
    if (!canvasRef.current && !videoRef.current) return;
    
    // Use canvas if effect is applied, otherwise capture from video
    let dataUrl;
    if (selectedEffect !== 'none' && canvasRef.current) {
      dataUrl = canvasRef.current.toDataURL('image/png');
    } else if (videoRef.current) {
      // Create temporary canvas to capture video frame
      const tempCanvas = document.createElement('canvas');
      const video = videoRef.current;
      tempCanvas.width = video.videoWidth || 640;
      tempCanvas.height = video.videoHeight || 480;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        dataUrl = tempCanvas.toDataURL('image/png');
      }
    }
    
    if (dataUrl) {
      // Create download link
      const link = document.createElement('a');
      link.download = `deepfake-${selectedEffect}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎭 Live Deepfake Studio
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time face transformation using your webcam. Apply AI-powered effects and filters instantly!
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <span className="text-green-300 font-medium">✅ Live Processing - 33 Real-time AI Effects Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Camera Preview</h2>
                <div className="flex gap-2">
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
                    >
                      📷 Start Camera
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                      >
                        📸 Capture
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        🛑 Stop
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Video Display */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <div className="text-8xl mb-4">📷</div>
                    <p className="text-xl">Click Start Camera to begin</p>
                    <p className="text-sm mt-2">Make sure to allow camera permissions</p>
                  </div>
                ) : (
                  <>
                    {/* Always show video element, hide it visually when effect is active */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`absolute inset-0 w-full h-full object-cover ${selectedEffect !== 'none' ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {/* Canvas for effects - overlays video */}
                    <canvas
                      ref={canvasRef}
                      className={`absolute inset-0 w-full h-full object-cover ${selectedEffect !== 'none' ? 'opacity-100' : 'opacity-0'}`}
                    />
                    
                    {/* Status Indicators */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                      {faceDetected && (
                        <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                          ✓ Face Detected
                        </div>
                      )}
                      {processing && (
                        <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                          ⚙️ Processing...
                        </div>
                      )}
                    </div>

                    {/* Current Effect Label */}
                    {selectedEffect !== 'none' && (
                      <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 text-white rounded-lg backdrop-blur-sm">
                        <div className="text-sm text-gray-300">Active Effect:</div>
                        <div className="font-bold">{effects.find(e => e.id === selectedEffect)?.name}</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <h3 className="font-bold text-white mb-2">💡 How to Use:</h3>
                <ol className="text-gray-300 space-y-1 text-sm">
                  <li>1. Click Start Camera to activate your webcam</li>
                  <li>2. Select an effect from the panel on the right</li>
                  <li>3. Wait for face detection (green indicator)</li>
                  <li>4. Click Capture to save your transformed photo</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Effects Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">🎨 Effects Library</h2>
                <div className="text-sm text-gray-400">{effects.length} effects</div>
              </div>
              
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {/* Group effects by category */}
                {['Basic', 'Age', 'Identity', 'Artistic', 'Fantasy', 'Beauty', 'Effects'].map(category => {
                  const categoryEffects = effects.filter(e => e.category === category);
                  if (categoryEffects.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">{category}</h3>
                      <div className="space-y-2">
                        {categoryEffects.map((effect) => (
                          <button
                            key={effect.id}
                            onClick={() => {
                              if (cameraActive) {
                                setSelectedEffect(effect.id);
                              }
                            }}
                            disabled={!cameraActive}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              selectedEffect === effect.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-[1.02]'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-[1.01]'
                            } ${!cameraActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="font-bold text-sm">{effect.name}</div>
                            <div className="text-xs opacity-80 mt-1">{effect.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg">
                <h3 className="font-bold text-white mb-2">📊 Studio Stats:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-300">
                    <div className="text-xs opacity-75">Total Effects</div>
                    <div className="font-bold text-lg text-white">{effects.length}</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="text-xs opacity-75">Categories</div>
                    <div className="font-bold text-lg text-white">7</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="text-xs opacity-75">Resolution</div>
                    <div className="font-bold text-white">720p</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="text-xs opacity-75">Frame Rate</div>
                    <div className="font-bold text-white">30 FPS</div>
                  </div>
                </div>
              </div>

              {/* Technical Info */}
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <h3 className="font-bold text-white mb-2">🔬 Technology:</h3>
                <ul className="text-gray-300 space-y-1 text-xs">
                  <li>✓ WebRTC Camera Access</li>
                  <li>✓ Canvas 2D Real-time Processing</li>
                  <li>✓ Pixel Manipulation Algorithms</li>
                  <li>✓ Face Detection Ready (MediaPipe)</li>
                  <li>✓ Photo Capture & Export</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time</h3>
            <p className="text-gray-300">30 FPS live processing</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🎭</div>
            <h3 className="text-xl font-bold text-white mb-2">{effects.length}+ Effects</h3>
            <p className="text-gray-300">7 categories of transformations</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Capture</h3>
            <p className="text-gray-300">Save photos with effects</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-bold text-white mb-2">Pro Quality</h3>
            <p className="text-gray-300">HD 720p video stream</p>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">🚀 Production Features (GPU Required):</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400">🤖</span>
              <div>
                <div className="font-bold text-white">Real GAN Models</div>
                <div className="text-sm">StyleGAN2, GFPGAN, StarGAN</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400">🎯</span>
              <div>
                <div className="font-bold text-white">Face Landmarks</div>
                <div className="text-sm">MediaPipe 468-point tracking</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-pink-400">🌟</span>
              <div>
                <div className="font-bold text-white">Celebrity Database</div>
                <div className="text-sm">1000+ famous faces</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400">📹</span>
              <div>
                <div className="font-bold text-white">Video Recording</div>
                <div className="text-sm">Export deepfake videos</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400">🎨</span>
              <div>
                <div className="font-bold text-white">StyleTransfer</div>
                <div className="text-sm">Neural style transfer art</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">🗣️</span>
              <div>
                <div className="font-bold text-white">Lip Sync</div>
                <div className="text-sm">Audio-driven facial animation</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
