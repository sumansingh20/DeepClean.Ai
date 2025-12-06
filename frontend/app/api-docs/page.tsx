'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function APIDocs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [apiKey] = useState(process.env.NEXT_PUBLIC_API_KEY || 'sk_live_deepclean_' + Date.now().toString(36));

  const sections = [
    { id: 'getting-started', title: '🚀 Getting Started', icon: '📘' },
    { id: 'authentication', title: '🔐 Authentication', icon: '🔑' },
    { id: 'detection', title: '🔬 Detection API', icon: '🤖' },
    { id: 'webhooks', title: '🔔 Webhooks', icon: '📡' },
    { id: 'sdks', title: '💻 SDKs & Libraries', icon: '📦' },
    { id: 'rate-limits', title: '⚡ Rate Limits', icon: '🚦' },
  ];

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/analyze/video',
      description: 'Analyze video for deepfake detection',
      color: 'green'
    },
    {
      method: 'POST',
      path: '/api/v1/analyze/audio',
      description: 'Analyze audio/voice for synthetic detection',
      color: 'green'
    },
    {
      method: 'POST',
      path: '/api/v1/analyze/document',
      description: 'Verify document authenticity',
      color: 'green'
    },
    {
      method: 'GET',
      path: '/api/v1/analysis/{id}',
      description: 'Get analysis results by ID',
      color: 'blue'
    },
    {
      method: 'POST',
      path: '/api/v1/takedown/request',
      description: 'Submit takedown request to platforms',
      color: 'green'
    },
    {
      method: 'GET',
      path: '/api/v1/takedown/{id}/status',
      description: 'Check takedown request status',
      color: 'blue'
    },
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.deepclean.ai/v1/analyze/video \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@video.mp4" \\
  -F "priority=high"`,
    
    python: `import requests

api_key = "${apiKey}"
url = "https://api.deepclean.ai/v1/analyze/video"

headers = {
    "Authorization": f"Bearer {api_key}"
}

files = {
    "file": open("video.mp4", "rb")
}

data = {
    "priority": "high"
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()

print(f"Analysis ID: {result['analysis_id']}")
print(f"Status: {result['status']}")
print(f"Confidence: {result['confidence']}%")`,

    javascript: `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const apiKey = '${apiKey}';
const url = 'https://api.deepclean.ai/v1/analyze/video';

const formData = new FormData();
formData.append('file', fs.createReadStream('video.mp4'));
formData.append('priority', 'high');

axios.post(url, formData, {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    ...formData.getHeaders()
  }
})
.then(response => {
  console.log('Analysis ID:', response.data.analysis_id);
  console.log('Status:', response.data.status);
  console.log('Confidence:', response.data.confidence + '%');
})
.catch(error => {
  console.error('Error:', error.response.data);
});`,

    java: `import okhttp3.*;
import java.io.File;

public class DeepCleanAPI {
    public static void main(String[] args) throws Exception {
        String apiKey = "${apiKey}";
        String url = "https://api.deepclean.ai/v1/analyze/video";
        
        OkHttpClient client = new OkHttpClient();
        
        RequestBody body = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", "video.mp4",
                RequestBody.create(new File("video.mp4"),
                    MediaType.parse("video/mp4")))
            .addFormDataPart("priority", "high")
            .build();
        
        Request request = new Request.Builder()
            .url(url)
            .header("Authorization", "Bearer " + apiKey)
            .post(body)
            .build();
        
        Response response = client.newCall(request).execute();
        System.out.println(response.body().string());
    }
}`
  };

  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof codeExamples>('python');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Header */}
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                DC
              </div>
              <div>
                <span className="text-2xl font-black">DeepClean AI</span>
                <div className="text-xs text-gray-400">API Documentation</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white font-semibold transition">
                Dashboard
              </Link>
              <Link href="/pricing" className="btn-primary">
                Get API Key
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-2xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-lg font-black mb-4 text-blue-400">Contents</h3>
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'getting-started' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-black mb-4 gradient-text">API Documentation</h1>
                  <p className="text-xl text-gray-400">
                    Integrate DeepClean AI's powerful deepfake detection into your applications
                  </p>
                </div>

                <div className="glass-dark rounded-2xl p-8 border border-white/10">
                  <h2 className="text-3xl font-black mb-6 text-blue-400">Quick Start</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3">1. Get Your API Key</h3>
                      <p className="text-gray-400 mb-4">
                        Sign up for an account and generate your API key from the dashboard.
                      </p>
                      <div className="bg-black/50 rounded-xl p-4 border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <code className="text-green-400 font-mono">{apiKey}</code>
                          <button className="text-xs bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3">2. Make Your First Request</h3>
                      <p className="text-gray-400 mb-4">
                        Send a POST request to analyze content:
                      </p>
                      <div className="bg-black/50 rounded-xl overflow-hidden border border-blue-500/30">
                        <div className="flex border-b border-white/10">
                          {Object.keys(codeExamples).map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setSelectedLanguage(lang as keyof typeof codeExamples)}
                              className={`px-6 py-3 font-semibold capitalize transition ${
                                selectedLanguage === lang
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {lang === 'javascript' ? 'Node.js' : lang}
                            </button>
                          ))}
                        </div>
                        <pre className="p-6 overflow-x-auto">
                          <code className="text-sm text-green-400 font-mono">
                            {codeExamples[selectedLanguage]}
                          </code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3">3. Parse the Response</h3>
                      <p className="text-gray-400 mb-4">
                        The API returns a JSON response with analysis results:
                      </p>
                      <div className="bg-black/50 rounded-xl p-6 border border-purple-500/30">
                        <pre className="text-sm text-purple-300 font-mono overflow-x-auto">
{`{
  "analysis_id": "anl_abc123def456",
  "status": "completed",
  "confidence": 94.5,
  "is_deepfake": true,
  "engines": [
    {
      "name": "facial_detection",
      "score": 96.2,
      "status": "fake_detected"
    },
    {
      "name": "audio_forensics",
      "score": 91.8,
      "status": "fake_detected"
    }
  ],
  "evidence": [
    "Facial manipulation detected",
    "GAN fingerprint: StyleGAN2"
  ],
  "processing_time_ms": 2847
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Base URL */}
                <div className="glass-dark rounded-2xl p-8 border border-white/10">
                  <h2 className="text-2xl font-black mb-4 text-blue-400">Base URL</h2>
                  <div className="bg-black/50 rounded-xl p-4 border border-blue-500/30">
                    <code className="text-blue-300 font-mono text-lg">
                      https://api.deepclean.ai/v1
                    </code>
                  </div>
                </div>

                {/* Endpoints */}
                <div className="glass-dark rounded-2xl p-8 border border-white/10">
                  <h2 className="text-2xl font-black mb-6 text-blue-400">Available Endpoints</h2>
                  <div className="space-y-4">
                    {endpoints.map((endpoint, idx) => (
                      <div key={idx} className="bg-black/50 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition">
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-3 py-1 rounded font-bold text-sm ${
                            endpoint.color === 'green' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-gray-300 font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-gray-400 text-sm">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'authentication' && (
              <div className="glass-dark rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-black mb-6 text-blue-400">🔐 Authentication</h2>
                <div className="space-y-6 text-gray-300">
                  <p>
                    All API requests must include your API key in the Authorization header using Bearer authentication.
                  </p>
                  <div className="bg-black/50 rounded-xl p-4 border border-blue-500/30">
                    <code className="text-blue-300 font-mono">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h3 className="font-bold text-yellow-400 mb-2">Keep Your API Key Secret</h3>
                        <p className="text-sm text-gray-300">
                          Never share your API key or commit it to version control. Use environment variables instead.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'rate-limits' && (
              <div className="glass-dark rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-black mb-6 text-blue-400">⚡ Rate Limits</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-black/50 rounded-xl p-6 border border-white/10">
                      <div className="text-3xl font-black text-green-400 mb-2">100</div>
                      <div className="text-sm text-gray-400">requests/hour</div>
                      <div className="text-xs text-gray-500 mt-2">Free Tier</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-6 border border-white/10">
                      <div className="text-3xl font-black text-blue-400 mb-2">1,000</div>
                      <div className="text-sm text-gray-400">requests/hour</div>
                      <div className="text-xs text-gray-500 mt-2">Professional</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-6 border border-white/10">
                      <div className="text-3xl font-black text-purple-400 mb-2">∞</div>
                      <div className="text-sm text-gray-400">Unlimited</div>
                      <div className="text-xs text-gray-500 mt-2">Enterprise</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
