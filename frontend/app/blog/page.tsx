'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'news', name: 'News & Updates', count: 8 },
    { id: 'technology', name: 'Technology', count: 6 },
    { id: 'security', name: 'Security', count: 5 },
    { id: 'case-studies', name: 'Case Studies', count: 3 },
    { id: 'guides', name: 'Guides', count: 2 },
  ];

  const featuredPost = {
    id: 1,
    title: 'DeepClean AI Successfully Prevents ₹500 Crore Scam Targeting Indian Banks',
    excerpt: 'Our advanced AI detection system identified and stopped a sophisticated deepfake attack targeting multiple Indian financial institutions, saving millions and protecting thousands of customers.',
    author: {
      name: 'Dr. Priya Sharma',
      role: 'Chief AI Officer',
      avatar: '👩‍🔬'
    },
    date: 'December 3, 2025',
    readTime: '5 min read',
    category: 'News',
    image: '📰',
    views: '15.2K',
    likes: 892
  };

  const blogPosts = [
    {
      id: 2,
      title: 'How AI-Powered Voice Cloning Scams Are Evolving in 2025',
      excerpt: 'Deep dive into the latest voice deepfake techniques being used by fraudsters and how our 91.8% accurate voice detection engine combats them.',
      author: { name: 'Rajesh Kumar', role: 'ML Engineer', avatar: '👨‍💻' },
      date: 'December 1, 2025',
      readTime: '8 min read',
      category: 'Technology',
      image: '🎙️',
      views: '8.5K',
      likes: 421
    },
    {
      id: 3,
      title: 'Government of India Mandates Deepfake Detection for Financial Institutions',
      excerpt: 'New regulations require all banks and NBFCs to implement AI-powered deepfake detection systems by Q2 2026.',
      author: { name: 'Amit Desai', role: 'Policy Expert', avatar: '👔' },
      date: 'November 28, 2025',
      readTime: '6 min read',
      category: 'News',
      image: '⚖️',
      views: '12.3K',
      likes: 678
    },
    {
      id: 4,
      title: 'Complete Guide: Protecting Your Organization from Deepfake Attacks',
      excerpt: 'Step-by-step implementation guide for enterprises looking to deploy comprehensive deepfake detection systems.',
      author: { name: 'Neha Patel', role: 'Security Consultant', avatar: '🔒' },
      date: 'November 25, 2025',
      readTime: '12 min read',
      category: 'Guides',
      image: '📚',
      views: '6.8K',
      likes: 334
    },
    {
      id: 5,
      title: 'Case Study: How HDFC Bank Stopped 1,200+ Deepfake Fraud Attempts',
      excerpt: 'Real-world success story of India\'s largest private bank implementing DeepClean AI across all digital channels.',
      author: { name: 'Vikram Singh', role: 'Enterprise Lead', avatar: '💼' },
      date: 'November 22, 2025',
      readTime: '10 min read',
      category: 'Case Studies',
      image: '🏦',
      views: '9.2K',
      likes: 567
    },
    {
      id: 6,
      title: 'Understanding Video Deepfakes: Detection Techniques Explained',
      excerpt: 'Technical breakdown of how our 94.2% accurate video detection engine identifies manipulated footage.',
      author: { name: 'Dr. Suresh Reddy', role: 'Research Scientist', avatar: '🔬' },
      date: 'November 20, 2025',
      readTime: '15 min read',
      category: 'Technology',
      image: '🎥',
      views: '7.1K',
      likes: 445
    },
    {
      id: 7,
      title: 'Zero-Day Deepfake Attack Vector Discovered and Patched',
      excerpt: 'Our security team identified a critical vulnerability in document verification systems that could have affected millions.',
      author: { name: 'Arjun Mehta', role: 'Security Researcher', avatar: '🛡️' },
      date: 'November 18, 2025',
      readTime: '7 min read',
      category: 'Security',
      image: '⚠️',
      views: '11.4K',
      likes: 723
    },
    {
      id: 8,
      title: 'The Rise of Synthetic Media: Opportunities and Threats',
      excerpt: 'Exploring both the positive applications and malicious uses of AI-generated content in today\'s digital landscape.',
      author: { name: 'Dr. Kavita Iyer', role: 'AI Ethics Lead', avatar: '🎓' },
      date: 'November 15, 2025',
      readTime: '11 min read',
      category: 'Technology',
      image: '🤖',
      views: '5.9K',
      likes: 312
    },
    {
      id: 9,
      title: 'Building Trust in Digital Identity: The Role of Liveness Detection',
      excerpt: 'Why our 96.1% accurate liveness detection is crucial for preventing identity fraud in remote verification.',
      author: { name: 'Sanjay Gupta', role: 'Product Manager', avatar: '👤' },
      date: 'November 12, 2025',
      readTime: '9 min read',
      category: 'Technology',
      image: '👁️',
      views: '6.5K',
      likes: 398
    },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === selectedCategory);

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
              <Link href="/contact" className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition">
                Contact
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-bold">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Latest Updates & Insights
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              DeepClean AI Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Stay informed about the latest in deepfake detection, AI security, and fraud prevention technology
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl">
                🔍
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 group cursor-pointer">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit">
                  ⭐ FEATURED
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:scale-105 transition-transform">
                  {featuredPost.title}
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{featuredPost.author.avatar}</div>
                    <div>
                      <div className="text-white font-bold">{featuredPost.author.name}</div>
                      <div className="text-blue-200 text-sm">{featuredPost.author.role}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-blue-100 text-sm">
                  <span>📅 {featuredPost.date}</span>
                  <span>⏱️ {featuredPost.readTime}</span>
                  <span>👁️ {featuredPost.views}</span>
                  <span>❤️ {featuredPost.likes}</span>
                </div>
                <button className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all w-fit shadow-lg">
                  Read Full Story →
                </button>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-9xl opacity-20 group-hover:scale-110 transition-transform">
                  {featuredPost.image}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="text-7xl">{post.image}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">⏱️ {post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{post.author.avatar}</div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{post.author.name}</div>
                        <div className="text-xs text-gray-500">{post.author.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span>📅 {post.date}</span>
                    <div className="flex gap-3">
                      <span>👁️ {post.views}</span>
                      <span>❤️ {post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">📧</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay Updated with Latest Insights
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Subscribe to our newsletter and get the latest articles, security alerts, and industry news delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 outline-none"
              />
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
                Subscribe Now
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              Join 25,000+ security professionals. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 DeepClean AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
