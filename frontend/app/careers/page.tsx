'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [platformStats, setPlatformStats] = useState({
    team_members: 0,
    organizations: 0
  });

  useEffect(() => {
    // Fetch real stats from backend
    fetch('http://localhost:8001/api/v1/stats')
      .then(res => res.json())
      .then(data => setPlatformStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  const stats = [
    { label: 'Team Members', value: platformStats.team_members > 0 ? `${platformStats.team_members}` : '0', icon: '👥' },
    { label: 'Organizations', value: platformStats.organizations > 0 ? `${platformStats.organizations}` : '0', icon: '🌍' },
    { label: 'Open Positions', value: '0', icon: '📋' },
    { label: 'Rating', value: '5/5', icon: '⭐' },
  ];

  const departments = [
    { id: 'all', name: 'All Positions', count: 42 },
    { id: 'engineering', name: 'Engineering', count: 18 },
    { id: 'data-science', name: 'Data Science', count: 8 },
    { id: 'security', name: 'Security', count: 6 },
    { id: 'product', name: 'Product', count: 4 },
    { id: 'sales', name: 'Sales & Marketing', count: 4 },
    { id: 'operations', name: 'Operations', count: 2 },
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Industry-leading compensation packages with performance bonuses and equity options'
    },
    {
      icon: '🏥',
      title: 'Health & Wellness',
      description: 'Comprehensive medical insurance for you and family, mental health support, gym membership'
    },
    {
      icon: '🏖️',
      title: 'Work-Life Balance',
      description: '25 days paid vacation, flexible hours, remote work options, and unlimited sick leave'
    },
    {
      icon: '📚',
      title: 'Learning & Growth',
      description: 'Annual learning budget, conference attendance, mentorship programs, and career development'
    },
    {
      icon: '🍱',
      title: 'Office Perks',
      description: 'Free meals, snacks & beverages, game rooms, nap pods, and monthly team events'
    },
    {
      icon: '👶',
      title: 'Family Support',
      description: 'Generous parental leave, childcare assistance, and family health coverage'
    },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior ML Engineer - Deepfake Detection',
      department: 'engineering',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '5-8 years',
      salary: '₹30-50 LPA',
      description: 'Lead the development of cutting-edge deepfake detection algorithms using advanced machine learning techniques.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'Deep Learning'],
      applicants: 127
    },
    {
      id: 2,
      title: 'Data Scientist - AI Research',
      department: 'data-science',
      location: 'Remote',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹25-40 LPA',
      description: 'Research and implement novel approaches for detecting synthetic media across multiple modalities.',
      skills: ['Python', 'R', 'Statistics', 'ML Algorithms', 'Research'],
      applicants: 89
    },
    {
      id: 3,
      title: 'Security Architect',
      department: 'security',
      location: 'Mumbai, India',
      type: 'Full-time',
      experience: '8+ years',
      salary: '₹40-65 LPA',
      description: 'Design and implement enterprise-grade security architecture for our deepfake detection platform.',
      skills: ['Security', 'Cloud', 'Cryptography', 'Compliance', 'Architecture'],
      applicants: 64
    },
    {
      id: 4,
      title: 'Product Manager - Enterprise AI',
      department: 'product',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '5-7 years',
      salary: '₹35-55 LPA',
      description: 'Drive product strategy and roadmap for our enterprise deepfake detection solutions.',
      skills: ['Product Strategy', 'AI/ML', 'Enterprise', 'Agile', 'Stakeholder Management'],
      applicants: 103
    },
    {
      id: 5,
      title: 'Frontend Engineer - React/Next.js',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹20-35 LPA',
      description: 'Build beautiful, responsive interfaces for our deepfake detection platform.',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'UI/UX'],
      applicants: 156
    },
    {
      id: 6,
      title: 'DevOps Engineer - Cloud Infrastructure',
      department: 'engineering',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₹25-40 LPA',
      description: 'Scale and optimize our cloud infrastructure to handle millions of deepfake detection requests.',
      skills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Monitoring'],
      applicants: 78
    },
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  const values = [
    {
      icon: '🎯',
      title: 'Mission-Driven',
      description: 'Fighting fraud and protecting society from deepfake threats'
    },
    {
      icon: '🚀',
      title: 'Innovation First',
      description: 'Pushing boundaries of AI and machine learning'
    },
    {
      icon: '🤝',
      title: 'Collaborative',
      description: 'Working together to solve complex challenges'
    },
    {
      icon: '🌟',
      title: 'Excellence',
      description: 'Committed to highest quality in everything we do'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                DC
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DeepClean AI
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/about" className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition">
                About
              </Link>
              <Link href="/contact" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-bold">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              We&apos;re Hiring!
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up">
              Help us build the future of AI-powered fraud detection and protect millions from deepfake threats
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-2xl text-center animate-fade-in-up hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
                <div className="text-5xl mb-3">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-blue-100 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join DeepClean AI?
            </h2>
            <p className="text-lg text-gray-600">
              We offer comprehensive benefits designed to support your growth and well-being
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-effect p-8 rounded-2xl hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600">
              Find your next career opportunity
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedDepartment === dept.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {dept.name} ({dept.count})
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {filteredJobs.map((job) => (
              <div key={job.id} className="glass-effect p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-3 uppercase">
                      {job.department.replace('-', ' ')}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  <div className="text-3xl">💼</div>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="text-gray-700">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span className="text-gray-700">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span className="text-gray-700">{job.experience}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    👥 {job.applicants} applicants
                  </span>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Don&apos;t See the Perfect Role?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals to join our team. Send us your resume and let&apos;s talk!
          </p>
          <Link href="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 DeepClean AI. Equal Opportunity Employer.</p>
        </div>
      </footer>
    </div>
  );
}
