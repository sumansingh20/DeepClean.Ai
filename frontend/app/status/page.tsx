'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StatusPage() {
  const [uptime, setUptime] = useState(99.98);

  useEffect(() => {
    // Simulate real-time status monitoring
    const interval = setInterval(() => {
      setUptime((prev) => Math.min(99.99, prev + Math.random() * 0.001));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'Web Application',
      status: 'operational',
      uptime: 99.99,
      responseTime: '124ms',
      icon: '🌐'
    },
    {
      name: 'REST API',
      status: 'operational',
      uptime: 99.98,
      responseTime: '89ms',
      icon: '⚡'
    },
    {
      name: 'WebSocket Service',
      status: 'operational',
      uptime: 99.95,
      responseTime: '45ms',
      icon: '📡'
    },
    {
      name: 'ML Detection Engine',
      status: 'operational',
      uptime: 99.92,
      responseTime: '1.8s',
      icon: '🤖'
    },
    {
      name: 'Database (PostgreSQL)',
      status: 'operational',
      uptime: 99.99,
      responseTime: '12ms',
      icon: '💾'
    },
    {
      name: 'Redis Cache',
      status: 'operational',
      uptime: 99.97,
      responseTime: '3ms',
      icon: '🚀'
    },
    {
      name: 'Celery Workers',
      status: 'operational',
      uptime: 99.94,
      responseTime: 'N/A',
      icon: '⚙️'
    },
    {
      name: 'File Storage (S3)',
      status: 'operational',
      uptime: 99.96,
      responseTime: '156ms',
      icon: '📦'
    }
  ];

  const incidents = [
    {
      date: '2025-12-05',
      title: 'Scheduled Maintenance - Database Upgrade',
      status: 'resolved',
      severity: 'minor',
      duration: '30 minutes',
      description: 'PostgreSQL upgraded to version 15.5. All services restored.'
    },
    {
      date: '2025-12-01',
      title: 'Increased API Latency',
      status: 'resolved',
      severity: 'minor',
      duration: '2 hours',
      description: 'Temporary spike in response times due to high traffic. Auto-scaling resolved the issue.'
    },
    {
      date: '2025-11-28',
      title: 'ML Model Update Deployment',
      status: 'resolved',
      severity: 'none',
      duration: '15 minutes',
      description: 'Deployed improved deepfake detection models. Accuracy increased to 96.8%.'
    }
  ];

  const metrics = [
    { label: 'Overall Uptime', value: `${uptime.toFixed(2)}%`, icon: '📈', color: 'green' },
    { label: 'Avg Response Time', value: '92ms', icon: '⚡', color: 'blue' },
    { label: 'Active Incidents', value: '0', icon: '✅', color: 'green' },
    { label: 'Services Monitored', value: '8', icon: '🔍', color: 'purple' }
  ];

  const statusColors = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    outage: 'bg-red-500',
    maintenance: 'bg-blue-500'
  };

  const statusLabels = {
    operational: 'Operational',
    degraded: 'Degraded Performance',
    outage: 'Major Outage',
    maintenance: 'Maintenance'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                DC
              </div>
              <div>
                <span className="text-2xl font-black text-gray-900">DeepClean AI</span>
                <div className="text-xs text-gray-500">System Status</div>
              </div>
            </Link>
            <Link href="/dashboard" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Current Status Banner */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-5xl font-black text-white mb-4">All Systems Operational</h1>
          <p className="text-xl text-green-100 mb-6">
            DeepClean AI is running smoothly across all services
          </p>
          <div className="flex justify-center gap-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 border-2 border-white/30">
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div className="text-3xl font-black text-white">{metric.value}</div>
                <div className="text-sm text-green-100">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-900">Service Status</h2>
          <div className="max-w-5xl mx-auto space-y-4">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{service.icon}</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{service.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Uptime: {service.uptime}%</span>
                        <span>•</span>
                        <span>Response: {service.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${statusColors[service.status as keyof typeof statusColors]} animate-pulse`}></span>
                    <span className="font-bold text-green-600">{statusLabels[service.status as keyof typeof statusLabels]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-900">Recent Incidents</h2>
          <div className="max-w-5xl mx-auto space-y-6">
            {incidents.map((incident, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">{incident.date}</div>
                    <h3 className="text-2xl font-black text-gray-900">{incident.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      {incident.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{incident.duration}</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring & Transparency */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-8 text-gray-900">Real-Time Monitoring</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our systems are monitored 24/7 with automated alerts and incident response. Subscribe to get status updates via email, SMS, or webhook.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition">
              📧 Subscribe to Updates
            </button>
            <Link href="/contact" className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-bold hover:border-blue-500 transition">
              📞 Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 DeepClean AI. All rights reserved.</p>
          <p className="mt-2 text-sm">Last updated: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
