'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: '📋',
      content: `This Privacy Policy describes how DeepClean AI ("we", "us", or "our") collects, uses, and shares your personal information when you use our deepfake detection platform and services. We are committed to protecting your privacy and ensuring the security of your personal data in compliance with Indian data protection laws including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.

By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.`
    },
    {
      id: 'information-collection',
      title: '2. Information We Collect',
      icon: '📊',
      content: `**2.1 Personal Information**
- Name, email address, phone number, company name
- Government-issued ID for verification (for government portal users)
- Payment and billing information
- IP address, device information, browser type

**2.2 Usage Data**
- Files uploaded for deepfake detection analysis
- Analysis results and detection reports
- Platform usage patterns and feature interactions
- API request logs and performance metrics

**2.3 Automatically Collected Information**
- Cookies and similar tracking technologies
- Log data including access times and pages viewed
- Device identifiers and network information
- Location data (with your consent)`
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Your Information',
      icon: '🔧',
      content: `**3.1 Service Delivery**
- Process deepfake detection requests
- Provide analysis results and generate reports
- Maintain and improve our AI detection algorithms
- Send service notifications and updates

**3.2 Business Operations**
- Process payments and manage subscriptions
- Provide customer support and respond to inquiries
- Comply with legal obligations and prevent fraud
- Conduct research to improve our services

**3.3 Communications**
- Send important service updates
- Respond to your requests and inquiries
- Provide marketing communications (with your consent)
- Send security alerts and technical notices`
    },
    {
      id: 'data-sharing',
      title: '4. Data Sharing and Disclosure',
      icon: '🤝',
      content: `**4.1 We May Share Your Information With:**

**Service Providers**
- Cloud infrastructure providers (AWS, GCP, Azure)
- Payment processors for billing
- Analytics and monitoring services
- Customer support platforms

**Law Enforcement and Legal**
- When required by Indian law or legal process
- To protect our rights, property, or safety
- To prevent fraud or security threats
- In response to valid government requests

**Business Transfers**
- In case of merger, acquisition, or asset sale
- With your prior consent or notification

**We Never:**
- Sell your personal data to third parties
- Share your uploaded files with unauthorized parties
- Use your data for purposes other than stated`
    },
    {
      id: 'data-security',
      title: '5. Data Security',
      icon: '🔒',
      content: `**5.1 Security Measures**
We implement industry-standard security measures to protect your data:

- 256-bit AES encryption for data at rest
- TLS 1.3 encryption for data in transit
- Multi-factor authentication (MFA)
- Regular security audits and penetration testing
- Access controls and role-based permissions
- Automated threat detection and monitoring

**5.2 Data Retention**
- Account data: Retained while your account is active
- Uploaded files: Deleted within 30 days after analysis
- Analysis results: Retained for 1 year (or as per your plan)
- Logs and metadata: Retained for 90 days

**5.3 Data Centers**
- Primary servers located in India (Mumbai, Bangalore)
- ISO 27001 and SOC 2 Type II certified facilities
- Regular backups with encryption
- Disaster recovery and business continuity plans`
    },
    {
      id: 'user-rights',
      title: '6. Your Rights and Choices',
      icon: '⚖️',
      content: `**6.1 Access and Control**
You have the right to:

- **Access**: Request copies of your personal data
- **Correction**: Update or correct inaccurate information
- **Deletion**: Request deletion of your data (right to be forgotten)
- **Portability**: Export your data in a machine-readable format
- **Restriction**: Limit how we process your data
- **Objection**: Object to processing for specific purposes
- **Withdrawal**: Withdraw consent at any time

**6.2 How to Exercise Your Rights**
Contact us at privacy@deepclean.ai or use your account settings to:
- Download your data
- Update personal information
- Delete your account
- Manage communication preferences
- Opt-out of marketing emails

**6.3 Response Time**
We will respond to your requests within 30 days as per Indian data protection regulations.`
    },
    {
      id: 'cookies',
      title: '7. Cookies and Tracking',
      icon: '🍪',
      content: `**7.1 Types of Cookies We Use**

**Essential Cookies**
- Authentication and session management
- Security and fraud prevention
- Load balancing and performance

**Analytics Cookies**
- Usage patterns and feature popularity
- Performance monitoring
- Error tracking and diagnostics

**Preference Cookies**
- Language and region settings
- UI customization preferences
- Theme selection

**7.2 Third-Party Cookies**
We may use third-party analytics services (Google Analytics, Mixpanel) that place cookies on your device.

**7.3 Cookie Management**
You can control cookies through your browser settings. Note that disabling cookies may affect service functionality.`
    },
    {
      id: 'international',
      title: '8. International Data Transfers',
      icon: '🌍',
      content: `**8.1 Data Location**
Your data is primarily stored and processed in India. In some cases, we may transfer data to:
- Cloud service providers with servers outside India
- International partners for specific services

**8.2 Transfer Safeguards**
When transferring data internationally, we ensure:
- Standard contractual clauses
- Adequate data protection measures
- Compliance with Indian data localization requirements
- User consent for cross-border transfers

**8.3 Government Data**
Data collected through government portals remains within India in compliance with MeitY guidelines.`
    },
    {
      id: 'children',
      title: '9. Children\'s Privacy',
      icon: '👶',
      content: `Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.

If we discover that we have collected personal information from a child without parental consent, we will delete that information immediately.

Parents or guardians who believe we may have collected information from a child should contact us at privacy@deepclean.ai.`
    },
    {
      id: 'changes',
      title: '10. Changes to This Policy',
      icon: '🔄',
      content: `**10.1 Updates**
We may update this Privacy Policy from time to time to reflect:
- Changes in our practices
- Legal or regulatory requirements
- New features or services
- User feedback

**10.2 Notification**
We will notify you of any material changes by:
- Email notification (for registered users)
- Prominent notice on our website
- In-app notifications

**10.3 Effective Date**
Changes become effective 30 days after notification. Your continued use after this period constitutes acceptance of the updated policy.`
    },
    {
      id: 'contact',
      title: '11. Contact Information',
      icon: '📞',
      content: `**Data Protection Officer**
Email: dpo@deepclean.ai
Phone: +91-80-4567-8900

**Privacy Inquiries**
Email: privacy@deepclean.ai
Address: DeepClean AI, Electronics City, Bangalore, Karnataka 560100

**Grievance Officer**
As per IT Act 2000, Section 5(9):
Name: Mr. Rajesh Kumar
Email: grievance@deepclean.ai
Phone: +91-80-4567-8901
Response Time: Within 24 hours

**Government Queries**
For law enforcement or government inquiries:
Email: legal@deepclean.ai
Portal: https://gov.deepclean.ai/legal-requests`
    },
  ];

  const quickLinks = [
    { name: 'Terms of Service', href: '/terms', icon: '📄' },
    { name: 'Cookie Policy', href: '/cookies', icon: '🍪' },
    { name: 'Security', href: '/security', icon: '🔒' },
    { name: 'GDPR Compliance', href: '/gdpr', icon: '🇪🇺' },
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in">
              🔒 Last Updated: December 5, 2025
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="glass-effect p-4 rounded-xl text-center hover:scale-105 transition-transform group"
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <div className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {link.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className="glass-effect p-8 md:p-10 rounded-2xl mb-8 animate-fade-in-up hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{section.icon}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-gray-600">
              We adhere to the highest standards of data protection and security
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'ISO 27001', icon: '🏆' },
              { name: 'SOC 2 Type II', icon: '✅' },
              { name: 'GDPR Ready', icon: '🇪🇺' },
              { name: 'IT Act 2000', icon: '🇮🇳' },
              { name: 'DPDP Act 2023', icon: '📜' },
              { name: 'PCI DSS', icon: '💳' },
            ].map((cert, index) => (
              <div key={index} className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{cert.icon}</div>
                <div className="text-sm font-semibold text-gray-700">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-6">❓</div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Questions About Our Privacy Policy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our Data Protection Officer is here to help. Contact us for any privacy-related inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl">
              Contact DPO
            </Link>
            <Link href="/security" className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
              View Security
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 DeepClean AI. Ministry of Electronics & Information Technology, Government of India.</p>
          <p className="text-xs mt-2">This policy is governed by the laws of India.</p>
        </div>
      </footer>
    </div>
  );
}
