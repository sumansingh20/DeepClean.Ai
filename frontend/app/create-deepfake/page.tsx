'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CreateDeepfakePage() {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string>('');
  const [targetPreview, setTargetPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    {
      id: 'face-swap',
      name: 'Face Swap',
      icon: '🎭',
      description: 'Swap faces between two images or videos',
      input: 'Source face + Target face',
      output: 'Target with source face',
      time: '2-5 minutes'
    },
    {
      id: 'age-transform',
      name: 'Age Transformation',
      icon: '👴',
      description: 'Make face older or younger',
      input: 'Face image',
      output: 'Aged/young face',
      time: '1-2 minutes'
    },
    {
      id: 'gender-swap',
      name: 'Gender Swap',
      icon: '⚧️',
      description: 'Transform male to female or vice versa',
      input: 'Face image',
      output: 'Gender-swapped face',
      time: '1-3 minutes'
    },
    {
      id: 'face-enhance',
      name: 'Face Enhancement',
      icon: '✨',
      description: 'Enhance face quality using AI',
      input: 'Low quality face',
      output: 'HD enhanced face',
      time: '30-60 seconds'
    },
    {
      id: 'lip-sync',
      name: 'Lip Sync',
      icon: '🗣️',
      description: 'Sync lips to audio file',
      input: 'Face video + Audio',
      output: 'Synced video',
      time: '3-10 minutes'
    },
    {
      id: 'face-animate',
      name: 'Face Animation',
      icon: '🎬',
      description: 'Animate photo using driving video',
      input: 'Photo + Driving video',
      output: 'Animated video',
      time: '5-15 minutes'
    }
  ];

  const handleSourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourcePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTargetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTargetFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTargetPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processDeepfake = async () => {
    if (!selectedTool || !sourceFile) {
      alert('Please select a tool and upload required files');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setResult('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('tool', selectedTool);
      formData.append('source', sourceFile);
      if (targetFile) {
        formData.append('target', targetFile);
      }

      // Call API (replace with actual backend endpoint)
      const response = await fetch('/api/deepfake/create', {
        method: 'POST',
        body: formData
      });

      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        setResult(data.resultUrl || sourcePreview);
      } else {
        throw new Error('Processing failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(sourcePreview);
      setProgress(100);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎨 Create Your Deepfake
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload your images/videos and transform them using AI. Select a tool, upload files, and let AI do the magic!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Select Tool</h2>
              <div className="space-y-3">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedTool === tool.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="font-bold">{tool.name}</span>
                    </div>
                    <div className="text-xs opacity-80">{tool.description}</div>
                    <div className="flex justify-between text-xs mt-2 opacity-70">
                      <span>⏱️ {tool.time}</span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTool && (
                <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <h3 className="font-bold text-white mb-2">Selected Tool:</h3>
                  <div className="text-sm text-gray-300">
                    {tools.find(t => t.id === selectedTool)?.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Input: {tools.find(t => t.id === selectedTool)?.input}
                  </div>
                  <div className="text-xs text-gray-400">
                    Output: {tools.find(t => t.id === selectedTool)?.output}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload & Process */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Upload Files</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Upload */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    📁 Source File (Required)
                  </label>
                  <div
                    onClick={() => sourceInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-500/50 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-all bg-white/5 hover:bg-white/10"
                  >
                    {sourcePreview ? (
                      <div className="relative">
                        <img src={sourcePreview} alt="Source" className="w-full h-48 object-cover rounded-lg" />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          ✓ Uploaded
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-5xl mb-3">📤</div>
                        <div className="text-gray-300">Click to upload</div>
                        <div className="text-xs text-gray-400 mt-2">
                          Image or Video
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={sourceInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleSourceUpload}
                    className="hidden"
                  />
                </div>

                {/* Target Upload (optional) */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    📁 Target File (Optional)
                  </label>
                  <div
                    onClick={() => targetInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-500/50 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-all bg-white/5 hover:bg-white/10"
                  >
                    {targetPreview ? (
                      <div className="relative">
                        <img src={targetPreview} alt="Target" className="w-full h-48 object-cover rounded-lg" />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          ✓ Uploaded
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-5xl mb-3">📤</div>
                        <div className="text-gray-300">Click to upload</div>
                        <div className="text-xs text-gray-400 mt-2">
                          For face swap, lip sync
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={targetInputRef}
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleTargetUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Process Button */}
              <div className="mt-6">
                <button
                  onClick={processDeepfake}
                  disabled={!selectedTool || !sourceFile || processing}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    !selectedTool || !sourceFile || processing
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-[1.02]'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚙️</span>
                      Processing... {progress}%
                    </span>
                  ) : (
                    '🚀 Create Deepfake'
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {processing && (
                <div className="mt-4">
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-gray-300 text-sm mt-2">
                    AI is processing your request...
                  </div>
                </div>
              )}
            </div>

            {/* Result */}
            {result && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">✅ Result</h2>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = result;
                      link.download = `deepfake-${Date.now()}.jpg`;
                      link.click();
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    📥 Download
                  </button>
                </div>
                <img src={result} alt="Result" className="w-full rounded-xl" />
              </div>
            )}
          </div>
        </div>


      </main>

      <Footer />
    </div>
  );
}
