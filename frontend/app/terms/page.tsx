'use client';

import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: '✅',
      content: `By accessing or using the DeepClean AI platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.

These Terms constitute a legally binding agreement between you and DeepClean AI Private Limited, a company registered under the Companies Act, 2013, with its registered office in Bangalore, Karnataka, India.

The Service is operated in accordance with the laws of India, and you agree to comply with all applicable local, state, national, and international laws and regulations.

**By using our Service, you represent that:**
- You are at least 18 years of age
- You have the legal capacity to enter into binding contracts
- You will use the Service in compliance with all applicable laws
- All information you provide is accurate and current`
    },
    {
      id: 'service-description',
      title: '2. Service Description',
      icon: '🔍',
      content: `**2.1 DeepClean AI Platform**
DeepClean AI provides AI-powered deepfake detection and synthetic media analysis services, including but not limited to:

- Voice deepfake detection (91.8% accuracy)
- Video deepfake detection (94.2% accuracy)
- Document forgery detection (89.5% accuracy)
- Liveness detection (96.1% accuracy)
- Scam call detection (88.3% accuracy)
- Legal evidence verification (100% audit compliance)

**2.2 Service Availability**
We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to:
- Scheduled maintenance
- Technical issues or emergencies
- Force majeure events
- Compliance with legal requirements

**2.3 Service Modifications**
We reserve the right to:
- Modify or discontinue features
- Update detection algorithms
- Change pricing and plans (with 30 days notice)
- Improve accuracy and performance

**2.4 Beta Features**
Some features may be offered in beta. These are provided "as-is" without warranties and may be discontinued without notice.`
    },
    {
      id: 'user-accounts',
      title: '3. User Accounts and Registration',
      icon: '👤',
      content: `**3.1 Account Creation**
To access certain features, you must:
- Register for an account with accurate information
- Maintain the security of your account credentials
- Be responsible for all activities under your account
- Notify us immediately of unauthorized access

**3.2 Account Types**
- **Individual**: Personal use, limited features
- **Professional**: Business use, advanced features
- **Enterprise**: Organization-wide deployment
- **Government**: Verified government agencies only

**3.3 Account Responsibilities**
You agree to:
- Provide accurate, current information
- Update information when it changes
- Maintain confidentiality of passwords
- Accept responsibility for all account activities
- Not share accounts or credentials

**3.4 Account Termination**
We may suspend or terminate accounts for:
- Violation of these Terms
- Fraudulent or illegal activities
- Non-payment of fees
- Abuse of the Service
- Extended period of inactivity

You may close your account at any time through account settings or by contacting support@deepclean.ai.`
    },
    {
      id: 'acceptable-use',
      title: '4. Acceptable Use Policy',
      icon: '⚖️',
      content: `**4.1 Permitted Uses**
You may use the Service to:
- Detect deepfakes and synthetic media
- Verify authenticity of digital content
- Protect against fraud and scams
- Comply with legal and regulatory requirements
- Conduct research (with proper authorization)

**4.2 Prohibited Uses**
You may NOT use the Service to:
- Create or distribute deepfakes or manipulated content
- Violate any laws or regulations
- Infringe intellectual property rights
- Harass, threaten, or harm others
- Transmit malware, viruses, or harmful code
- Attempt to breach security measures
- Reverse engineer or copy our technology
- Resell or redistribute the Service
- Upload illegal or prohibited content
- Interfere with Service operations

**4.3 Content Restrictions**
Do not upload:
- Child sexual abuse material (CSAM)
- Content depicting violence or terrorism
- Private information without consent
- Copyrighted material without authorization
- Malicious or harmful files
- Content violating Indian law

**4.4 Consequences of Violation**
Violations may result in:
- Immediate account suspension
- Permanent account termination
- Legal action and prosecution
- Cooperation with law enforcement
- Liability for damages`
    },
    {
      id: 'intellectual-property',
      title: '5. Intellectual Property Rights',
      icon: '©️',
      content: `**5.1 Our Intellectual Property**
All rights, title, and interest in the Service, including:
- Software, algorithms, and AI models
- User interface and design
- Trademarks, logos, and branding
- Documentation and content
- Trade secrets and proprietary technology

are owned by DeepClean AI and protected by Indian and international copyright, trademark, patent, and other intellectual property laws.

**5.2 Limited License**
We grant you a limited, non-exclusive, non-transferable, revocable license to:
- Access and use the Service as permitted
- Use our API within plan limits
- Download reports for your internal use

You may NOT:
- Copy, modify, or create derivative works
- Reverse engineer or decompile
- Remove proprietary notices
- Use our branding without permission

**5.3 Your Content**
You retain ownership of content you upload. By uploading content, you grant us:
- Limited license to process and analyze
- Right to use for improving our algorithms
- Permission to create anonymized datasets
- Ability to comply with legal requirements

**5.4 Feedback**
Any feedback or suggestions you provide become our property and may be used without compensation or attribution.`
    },
    {
      id: 'payment-billing',
      title: '6. Payment and Billing',
      icon: '💳',
      content: `**6.1 Pricing**
Current pricing is available at deepclean.ai/pricing. Prices are in Indian Rupees (INR) unless otherwise stated.

**6.2 Payment Terms**
- Individual Plan: ₹0/month (Free)
- Professional Plan: ₹2,999/month or ₹29,990/year
- Enterprise Plan: Custom pricing

**6.3 Billing Cycle**
- Monthly plans: Billed on subscription date each month
- Annual plans: Billed in advance for 12 months
- Enterprise: Custom billing terms

**6.4 Payment Methods**
We accept:
- Credit/Debit cards (Visa, Mastercard, RuPay)
- Net banking
- UPI
- Wire transfer (Enterprise only)

**6.5 Taxes**
All prices are exclusive of applicable taxes (GST, etc.). You are responsible for all taxes.

**6.6 Refunds**
- Free trial cancellations: No charges
- Monthly plans: No refunds for partial months
- Annual plans: Pro-rated refunds within 30 days
- Enterprise: As per contract terms

**6.7 Non-Payment**
Failure to pay may result in:
- Service suspension after 7 days
- Account termination after 30 days
- Collection efforts and fees
- Legal action for outstanding amounts`
    },
    {
      id: 'data-privacy',
      title: '7. Data Privacy and Security',
      icon: '🔒',
      content: `**7.1 Data Processing**
We process your data in accordance with our Privacy Policy and applicable data protection laws including:
- Information Technology Act, 2000
- Digital Personal Data Protection Act, 2023
- GDPR (for European users)

**7.2 Data Storage**
- Primary storage: India (Mumbai, Bangalore)
- Backup storage: Encrypted, geographically distributed
- Retention: As per our Privacy Policy
- Deletion: Upon request or account closure

**7.3 Security Measures**
We implement:
- 256-bit encryption (data at rest)
- TLS 1.3 (data in transit)
- Multi-factor authentication
- Regular security audits
- Access controls and logging
- Incident response procedures

**7.4 Your Responsibilities**
You must:
- Protect account credentials
- Use secure connections
- Report security incidents
- Comply with data protection laws
- Obtain necessary consents

**7.5 Data Breach Notification**
We will notify you within 72 hours of any data breach affecting your account.`
    },
    {
      id: 'warranties',
      title: '8. Warranties and Disclaimers',
      icon: '⚠️',
      content: `**8.1 Service Warranty**
We warrant that the Service will perform substantially as described, subject to:
- Proper use according to documentation
- Compatible devices and networks
- Reasonable technical specifications

**8.2 DISCLAIMER OF WARRANTIES**
TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

- Merchantability
- Fitness for a particular purpose
- Non-infringement
- Accuracy or reliability
- Uninterrupted or error-free operation
- Security or freedom from viruses

**8.3 Accuracy Disclaimer**
While we strive for high accuracy, we do not guarantee:
- 100% detection accuracy
- Zero false positives or negatives
- Results suitable for all use cases
- Legal admissibility of results

You should use results as one factor in your decision-making process, not as the sole determinant.

**8.4 No Legal Advice**
Nothing in the Service constitutes legal, financial, or professional advice. Consult appropriate professionals for specific advice.

**8.5 Third-Party Services**
We are not responsible for third-party services, integrations, or links.`
    },
    {
      id: 'limitation-liability',
      title: '9. Limitation of Liability',
      icon: '🛡️',
      content: `**9.1 LIMITATION OF LIABILITY**
TO THE MAXIMUM EXTENT PERMITTED BY INDIAN LAW:

DeepClean AI, its officers, directors, employees, agents, and affiliates SHALL NOT BE LIABLE for any:

- Indirect, incidental, special, or consequential damages
- Loss of profits, revenue, data, or business opportunities
- Cost of substitute services
- Damage to reputation or goodwill
- Damages arising from unauthorized access
- Errors, omissions, or inaccuracies in results
- Service interruptions or terminations

**9.2 Maximum Liability**
Our total liability for all claims related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim.

**9.3 Exceptions**
This limitation does not apply to:
- Gross negligence or willful misconduct
- Death or personal injury caused by our negligence
- Fraud or fraudulent misrepresentation
- Liability that cannot be excluded by law

**9.4 Basis of Bargain**
You acknowledge that these limitations are reasonable and an essential part of our agreement.`
    },
    {
      id: 'indemnification',
      title: '10. Indemnification',
      icon: '🤝',
      content: `You agree to indemnify, defend, and hold harmless DeepClean AI, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses arising from:

**10.1 Your Use of the Service**
- Your violation of these Terms
- Your violation of any laws or regulations
- Your infringement of third-party rights
- Content you upload or process
- Your negligence or misconduct

**10.2 Third-Party Claims**
Any claims by third parties arising from your use of the Service or results you obtain.

**10.3 Defense Obligations**
You will:
- Cooperate fully in the defense
- Pay all costs, damages, and attorney fees
- Not settle without our written consent

**10.4 Exceptions**
This does not apply to claims arising from our gross negligence or willful misconduct.`
    },
    {
      id: 'term-termination',
      title: '11. Term and Termination',
      icon: '🔚',
      content: `**11.1 Term**
These Terms remain in effect while you use the Service.

**11.2 Termination by You**
You may terminate at any time by:
- Closing your account through settings
- Contacting support@deepclean.ai
- Ceasing to use the Service

**11.3 Termination by Us**
We may terminate immediately for:
- Breach of these Terms
- Illegal activities
- Non-payment (after notice)
- Extended inactivity
- Legal requirements

**11.4 Effect of Termination**
Upon termination:
- Your right to use the Service ends immediately
- We may delete your data after 30 days
- Outstanding fees become immediately due
- Provisions intended to survive will continue

**11.5 Survival**
The following sections survive termination:
- Intellectual Property
- Payment obligations
- Warranties and Disclaimers
- Limitation of Liability
- Indemnification
- Governing Law and Dispute Resolution`
    },
    {
      id: 'governing-law',
      title: '12. Governing Law and Dispute Resolution',
      icon: '⚖️',
      content: `**12.1 Governing Law**
These Terms are governed by the laws of India without regard to conflict of law principles.

**12.2 Jurisdiction**
Exclusive jurisdiction: Courts of Bangalore, Karnataka, India.

**12.3 Dispute Resolution Process**

**Step 1: Informal Resolution (30 days)**
Contact us at legal@deepclean.ai to resolve amicably.

**Step 2: Mediation (60 days)**
If unresolved, attempt mediation under the Indian Arbitration and Conciliation Act, 1996.

**Step 3: Arbitration**
If mediation fails, arbitration in Bangalore under:
- Indian Arbitration and Conciliation Act, 1996
- Single arbitrator mutually agreed or appointed by Bangalore High Court
- Language: English
- Costs: As per arbitrator's decision

**Step 4: Litigation**
Final recourse: Bangalore courts.

**12.4 Class Action Waiver**
You agree to bring claims individually, not as part of any class or representative action.

**12.5 Government Users**
Indian government agencies may follow their standard procurement and dispute resolution procedures.`
    },
    {
      id: 'miscellaneous',
      title: '13. Miscellaneous Provisions',
      icon: '📝',
      content: `**13.1 Entire Agreement**
These Terms, together with our Privacy Policy, constitute the entire agreement and supersede all prior agreements.

**13.2 Amendments**
We may modify these Terms at any time. Material changes will be notified 30 days in advance. Continued use after changes constitutes acceptance.

**13.3 Waiver**
Our failure to enforce any right or provision is not a waiver of that right or provision.

**13.4 Severability**
If any provision is found invalid, the remaining provisions remain in full effect.

**13.5 Assignment**
You may not assign these Terms. We may assign to affiliates or in connection with merger, acquisition, or sale of assets.

**13.6 Force Majeure**
Neither party is liable for failure to perform due to circumstances beyond reasonable control.

**13.7 Export Compliance**
You must comply with Indian export laws and regulations.

**13.8 Government Rights**
The Service is deemed "commercial computer software" for government procurement purposes.

**13.9 Notices**
Legal notices must be sent to:
Legal Department
DeepClean AI Private Limited
Electronics City, Bangalore, Karnataka 560100
Email: legal@deepclean.ai

**13.10 Language**
In case of conflict between English and translated versions, English prevails.`
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
              <Link href="/privacy" className="px-6 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition">
                Privacy
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
              📜 Effective Date: December 5, 2025
            </div>
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
              Please read these terms carefully before using our deepfake detection platform
            </p>
          </div>

          {/* Quick Summary */}
          <div className="glass-effect p-8 rounded-2xl max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Quick Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <strong>Use our Service</strong> to detect deepfakes and protect against fraud
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">✗</span>
                <div>
                  <strong>Don&apos;t create deepfakes</strong> or use the Service illegally
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <strong>Your data is protected</strong> with encryption and security measures
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">✗</span>
                <div>
                  <strong>No guarantees</strong> of 100% accuracy - use as part of your process
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">ℹ</span>
                <div>
                  <strong>Disputes resolved</strong> through mediation or arbitration in India
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">ℹ</span>
                <div>
                  <strong>Contact us</strong> at legal@deepclean.ai for questions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="glass-effect p-8 md:p-10 rounded-2xl mb-8 hover:shadow-2xl transition-all duration-500"
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

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-6">⚖️</div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our legal team is here to help clarify any questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl">
              Contact Legal Team
            </Link>
            <Link href="/privacy" className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 DeepClean AI Private Limited. All rights reserved.</p>
          <p className="text-xs mt-2">Registered in India under CIN: U72900KA2024PTC123456</p>
        </div>
      </footer>
    </div>
  );
}
