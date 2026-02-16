'use client';

import Link from 'next/link';

export default function SecurityPage() {
  const certifications = [
    {
      name: 'ISO 27001:2022',
      icon: '🏆',
      description: 'Information Security Management',
      issuer: 'International Organization for Standardization',
      valid: 'Valid until Dec 2026'
    },
    {
      name: 'SOC 2 Type II',
      icon: '✅',
      description: 'Security, Availability, Confidentiality',
      issuer: 'AICPA',
      valid: 'Audited Quarterly'
    },
    {
      name: 'PCI DSS Level 1',
      icon: '💳',
      description: 'Payment Card Industry Data Security',
      issuer: 'PCI Security Standards Council',
      valid: 'Compliant'
    },
    {
      name: 'GDPR Ready',
      icon: '🇪🇺',
      description: 'EU Data Protection Regulation',
      issuer: 'European Commission',
      valid: 'Certified'
    },
    {
      name: 'IT Act 2000',
      icon: '🇮🇳',
      description: 'Indian Information Technology Act',
      issuer: 'Govt. of India',
      valid: 'Compliant'
    },
    {
      name: 'DPDP Act 2023',
      icon: '📜',
      description: 'Digital Personal Data Protection',
      issuer: 'MeitY, Govt. of India',
      valid: 'Compliant'
    },
  ];

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      icon: '🔐',
      description: 'All data encrypted in transit (TLS 1.3) and at rest (AES-256)',
      details: [
        'TLS 1.3 for all connections',
        '256-bit AES encryption for stored data',
        'Perfect Forward Secrecy (PFS)',
        'Certificate pinning'
      ]
    },
    {
      title: 'Multi-Factor Authentication',
      icon: '🔑',
      description: 'Multiple authentication layers to protect your account',
      details: [
        'SMS-based OTP',
        'Email verification codes',
        'Authenticator app support (TOTP)',
        'Biometric authentication',
        'Hardware security key support (FIDO2)'
      ]
    },
    {
      title: 'Access Controls',
      icon: '👥',
      description: 'Granular role-based access control and permissions',
      details: [
        'Role-based access control (RBAC)',
        'Least privilege principle',
        'IP whitelisting',
        'Session management',
        'API key rotation'
      ]
    },
    {
      title: 'Data Isolation',
      icon: '🗄️',
      description: 'Complete logical and physical separation of customer data',
      details: [
        'Separate database per organization',
        'Network isolation',
        'Container-level isolation',
        'Dedicated encryption keys',
        'No cross-tenant access'
      ]
    },
    {
      title: 'Security Monitoring',
      icon: '👁️',
      description: '24/7 security monitoring and threat detection',
      details: [
        'Real-time intrusion detection (IDS)',
        'Security Information and Event Management (SIEM)',
        'Anomaly detection using ML',
        'DDoS protection',
        'Web Application Firewall (WAF)'
      ]
    },
    {
      title: 'Incident Response',
      icon: '🚨',
      description: 'Rapid response to security incidents',
      details: [
        '24/7 Security Operations Center (SOC)',
        'Automated threat response',
        '1-hour incident acknowledgment',
        'Detailed incident reports',
        'Post-incident analysis'
      ]
    },
    {
      title: 'Secure Development',
      icon: '💻',
      description: 'Security built into every stage of development',
      details: [
        'Secure coding practices',
        'Code review and static analysis',
        'Dependency vulnerability scanning',
        'Automated security testing',
        'Bug bounty program'
      ]
    },
    {
      title: 'Data Backup & Recovery',
      icon: '💾',
      description: 'Automated backups with encryption and geo-redundancy',
      details: [
        'Automated daily backups',
        'Encrypted backup storage',
        'Geo-redundant storage',
        'Point-in-time recovery',
        'Tested disaster recovery plan'
      ]
    },
    {
      title: 'Audit Logging',
      icon: '📝',
      description: 'Comprehensive logging of all system activities',
      details: [
        'Immutable audit trails',
        'User activity logging',
        'API access logs',
        'Administrative action logs',
        'Log retention for 1 year'
      ]
    },
  ];

  const infrastructure = [
    {
      provider: 'AWS',
      icon: '☁️',
      region: 'ap-south-1 (Mumbai)',
      features: ['EC2', 'S3', 'RDS', 'CloudFront', 'WAF']
    },
    {
      provider: 'Google Cloud',
      icon: '🔵',
      region: 'asia-south1 (Mumbai)',
      features: ['Compute Engine', 'Cloud Storage', 'Cloud SQL', 'Load Balancing']
    },
    {
      provider: 'Azure',
      icon: '🔷',
      region: 'Central India (Pune)',
      features: ['Virtual Machines', 'Blob Storage', 'SQL Database', 'CDN']
    },
  ];

  const securityPractices = [
    {
      title: 'Regular Audits',
      items: [
        'Quarterly external security audits',
        'Annual penetration testing',
        'Third-party vulnerability assessments',
        'Compliance audits (ISO, SOC 2)'
      ]
    },
    {
      title: 'Employee Security',
      items: [
        'Background checks for all employees',
        'Security awareness training (quarterly)',
        'Confidentiality agreements',
        'Principle of least privilege access'
      ]
    },
    {
      title: 'Physical Security',
      items: [
        'Tier III+ data centers',
        '24/7 security personnel',
        'Biometric access controls',
        'CCTV surveillance'
      ]
    },
    {
      title: 'Vendor Management',
      items: [
        'Vendor security assessments',
        'Data processing agreements',
        'Regular vendor audits',
        'Minimal third-party access'
      ]
    },
  ];

  const timeline = [
    { year: '2024', event: 'ISO 27001 Certification Achieved', icon: '🏆' },
    { year: '2024', event: 'SOC 2 Type II Audit Completed', icon: '✅' },
    { year: '2024', event: 'Bug Bounty Program Launched', icon: '🐛' },
    { year: '2025', event: 'Zero Security Incidents to Date', icon: '🎯' },
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
              <Link href="/privacy" className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition">
                Privacy
              </Link>
              <Link href="/contact" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-bold">
                Contact Security Team
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
              Enterprise-Grade Security
            </div>
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              Security & Compliance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
              Your data security is our top priority. Learn about our comprehensive security measures and compliance certifications.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="glass-effect p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🛡️</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">256-bit</div>
              <div className="text-sm text-gray-600">AES Encryption</div>
            </div>
            <div className="glass-effect p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">99.99%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
            <div className="glass-effect p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-sm text-gray-600">Security Breaches</div>
            </div>
            <div className="glass-effect p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Certifications & Compliance
            </h2>
            <p className="text-lg text-gray-600">
              Independently verified security and compliance standards
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {certifications.map((cert, index) => (
              <div key={index} className="glass-effect p-8 rounded-2xl hover:scale-105 transition-transform text-center">
                <div className="text-6xl mb-4">{cert.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600 mb-3">{cert.description}</p>
                <p className="text-sm text-gray-500 mb-2">{cert.issuer}</p>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  {cert.valid}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Security Features
            </h2>
            <p className="text-lg text-gray-600">
              Multi-layered security architecture protecting your data at every level
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="glass-effect p-8 rounded-2xl hover:shadow-2xl transition-all">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Secure Cloud Infrastructure
            </h2>
            <p className="text-xl text-blue-100">
              Multi-cloud architecture with data centers in India
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {infrastructure.map((infra, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all">
                <div className="text-6xl mb-4 text-center">{infra.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{infra.provider}</h3>
                <p className="text-blue-100 text-sm mb-4 text-center">{infra.region}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {infra.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Security Practices
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive security policies and procedures
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {securityPractices.map((practice, index) => (
              <div key={index} className="glass-effect p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-blue-600">●</span>
                  {practice.title}
                </h3>
                <ul className="space-y-3">
                  {practice.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Security Milestones
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {item.icon}
                  </div>
                </div>
                <div className="glass-effect p-6 rounded-2xl flex-1 hover:scale-105 transition-transform">
                  <div className="text-sm text-blue-600 font-bold mb-1">{item.year}</div>
                  <div className="text-lg font-bold text-gray-900">{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bug Bounty */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-6">🐛</div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Responsible Disclosure & Bug Bounty
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We welcome security researchers to help us identify vulnerabilities. Report issues responsibly and earn rewards up to ₹5,00,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:security@deepclean.ai" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl">
              Report Security Issue
            </a>
            <Link href="/bug-bounty" className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
              Bug Bounty Program
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Security */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="glass-effect p-12 rounded-2xl max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Security Questions?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our security team is available 24/7 to address your concerns
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📧</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Security Team</div>
                  <div className="text-gray-600">security@deepclean.ai</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🚨</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Security Incidents</div>
                  <div className="text-gray-600">incidents@deepclean.ai</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Compliance</div>
                  <div className="text-gray-600">compliance@deepclean.ai</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📞</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">24/7 Hotline</div>
                  <div className="text-gray-600">+91-80-4567-9999</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 DeepClean AI. Your security is our priority.</p>
        </div>
      </footer>
    </div>
  );
}
