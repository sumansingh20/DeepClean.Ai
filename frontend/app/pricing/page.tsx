'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <div>
                <span className="font-bold text-base text-gray-900">DeepClean.AI</span>
                <span className="block text-xs text-green-600 font-semibold -mt-1">100% FREE</span>
              </div>
            </Link>
            <Link href="/" className="px-4 py-2 text-sm text-gray-700 hover:text-pink-600 font-medium transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold mb-4">
            🎉 ALWAYS FREE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple Pricing. Actually Free.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            No hidden costs. No premium tiers. No paywalls. <br />
            <strong className="text-green-600">Everything is free, forever.</strong>
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-4 border-green-500 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Forever Free Plan</h2>
              <p className="text-green-100 text-sm">For all women. No exceptions.</p>
              <div className="mt-6">
                <div className="text-6xl font-bold">₹0</div>
                <div className="text-green-100 text-sm mt-2">No credit card required</div>
              </div>
            </div>

            {/* Features */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What's Included:</h3>
              <ul className="space-y-4">
                {[
                  'Unlimited deepfake analyses',
                  'All AI detection engines (12 types)',
                  'Video, Voice, Image, Document analysis',
                  'Real-time liveness detection',
                  'Scam & fraud detection',
                  'Batch processing',
                  'Incident reporting',
                  'PDF report generation',
                  'Legal evidence packages',
                  'Priority support',
                  'No ads, ever',
                  'Privacy guaranteed'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register" 
                className="mt-8 block w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center font-bold rounded-lg hover:shadow-lg transition text-lg"
              >
                Get Started Free →
              </Link>

              <p className="text-center text-xs text-gray-500 mt-4">
                No setup fees • No monthly charges • No surprise bills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why is it Free?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-3">💜</div>
              <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-sm text-gray-600">
                We believe every woman deserves protection from deepfakes. Cost should never be a barrier to safety.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-3">🇮🇳</div>
              <h3 className="font-bold text-gray-900 mb-2">Made in India</h3>
              <p className="text-sm text-gray-600">
                Built to serve Indian women first. Our platform will always remain accessible to everyone who needs it.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-gray-900 mb-2">Community First</h3>
              <p className="text-sm text-gray-600">
                Supported by grants, donations, and sponsors who believe in women's safety over profits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compare with Others</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-green-600">DeepClean.AI</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Monthly Cost</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-green-600">₹0</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">₹1,500 - ₹5,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Unlimited Analysis</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">❌ (Limited)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">All Features Included</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">❌ (Pay extra)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Women's Safety Focus</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">❌</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Made in India</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is it really 100% free?',
                a: 'Yes! Absolutely no charges, ever. No credit card needed, no hidden fees, no premium tiers.'
              },
              {
                q: 'Will it always be free?',
                a: 'Yes. Our commitment is to keep the platform free forever for individual users, especially women.'
              },
              {
                q: 'Are there any limits?',
                a: 'No artificial limits. You can analyze unlimited files. Fair use policy applies to prevent abuse.'
              },
              {
                q: 'How do you sustain this?',
                a: 'Through grants, sponsors, and future enterprise solutions (which will remain optional).'
              },
              {
                q: 'What about my privacy?',
                a: 'Your data is encrypted and never shared. You can delete your files anytime. Privacy is guaranteed.'
              },
              {
                q: 'Can I use it for commercial purposes?',
                a: 'Yes! Our mission is to make deepfake detection accessible to everyone, including professionals.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-pink-100">
            Join thousands of women already using DeepClean.AI to protect themselves
          </p>
          <Link 
            href="/register" 
            className="inline-block px-8 py-4 bg-white text-pink-600 font-bold rounded-lg hover:shadow-xl transition"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DC</span>
                </div>
                <span className="text-white font-bold text-sm">DeepClean.AI</span>
              </div>
              <p className="text-xs leading-relaxed mb-2">Free deepfake detection for women's safety</p>
              <p className="text-xs text-green-400 font-semibold">100% Free Forever</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs">Product</h4>
              <div className="space-y-2 text-xs">
                <Link href="/analysis" className="block hover:text-pink-400 transition">Analysis</Link>
                <Link href="/features" className="block hover:text-pink-400 transition">Features</Link>
                <Link href="/pricing" className="block hover:text-pink-400 transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs">Company</h4>
              <div className="space-y-2 text-xs">
                <Link href="/about" className="block hover:text-pink-400 transition">About</Link>
                <Link href="/contact" className="block hover:text-pink-400 transition">Contact</Link>
                <Link href="/careers" className="block hover:text-pink-400 transition">Careers</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs">Legal</h4>
              <div className="space-y-2 text-xs">
                <Link href="/privacy" className="block hover:text-pink-400 transition">Privacy</Link>
                <Link href="/terms" className="block hover:text-pink-400 transition">Terms</Link>
                <Link href="/security" className="block hover:text-pink-400 transition">Security</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-xs text-center">
            <p className="text-gray-500">© 2025 DeepClean.AI. All rights reserved. <span className="text-pink-500 font-medium">Made in India</span> 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
        { text: 'Full API access', included: true },
        { text: 'On-premise option', included: true },
      ]
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 'Custom') return 'Custom';
    if (plan.monthlyPrice === 0) return 'Free';
    
    const monthlyPrice = typeof plan.monthlyPrice === 'number' ? plan.monthlyPrice : 0;
    const annualPrice = typeof plan.annualPrice === 'number' ? plan.annualPrice : 0;
    const price = billingCycle === 'monthly' ? monthlyPrice : Math.floor(annualPrice / 12);
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 'Custom' || plan.monthlyPrice === 0) return null;
    if (billingCycle === 'annual') {
      const monthlyPrice = typeof plan.monthlyPrice === 'number' ? plan.monthlyPrice : 0;
      const annualPrice = typeof plan.annualPrice === 'number' ? plan.annualPrice : 0;
      const monthlyTotal = monthlyPrice * 12;
      const savings = monthlyTotal - annualPrice;
      const percentage = Math.round((savings / monthlyTotal) * 100);
      return `Save ${percentage}%`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-medium">
                DC
              </div>
              <span className="text-xl font-bold text-gray-900">DeepClean.AI</span>
            </Link>
            <Link href="/login" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-medium">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-6">
              Choose Your <span className="gradient-text dark:text-blue-400">Protection Plan</span>
            </h1>
            <p className="text-2xl text-gray-600 dark:text-dark-600 max-w-3xl mx-auto mb-8">
              Flexible pricing for individuals, professionals, and enterprises
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-white dark:bg-dark-200 rounded-full p-2 shadow-lg border-2 border-gray-200 dark:border-dark-300">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-dark-700 hover:bg-gray-100 dark:hover:bg-dark-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-8 py-3 rounded-full font-bold transition-all relative ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-dark-700 hover:bg-gray-100 dark:hover:bg-dark-300'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative glass dark:bg-dark-200/50 rounded-3xl p-8 border-2 transition-all duration-300 ${
                  plan.popular
                    ? 'border-blue-500 shadow-2xl scale-105 z-10'
                    : 'border-gray-200 dark:border-dark-300 shadow-xl hover:shadow-2xl hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-dark-600 font-semibold">{plan.description}</p>
                </div>

                <div className="text-center mb-8 py-6 bg-gradient-to-br from-gray-50 to-white dark:from-dark-300 dark:to-dark-200 rounded-2xl">
                  <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">
                    {getPrice(plan)}
                  </div>
                  <div className="text-gray-600 dark:text-dark-600 font-semibold">
                    {plan.monthlyPrice === 'Custom' ? 'Contact Sales' : billingCycle === 'monthly' ? 'per month' : 'per month (billed annually)'}
                  </div>
                  {getSavings(plan) && (
                    <div className="mt-2 text-green-600 font-bold text-sm">
                      🎉 {getSavings(plan)}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-3 ${feature.included ? 'text-gray-700 dark:text-dark-700' : 'text-gray-400 dark:text-dark-600'}`}>
                      <span className={`text-xl flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span className="font-semibold text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105'
                      : 'bg-white dark:bg-dark-300 border-2 border-gray-300 dark:border-dark-400 text-gray-900 dark:text-white hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {plan.monthlyPrice === 'Custom' ? 'Contact Sales' : plan.monthlyPrice === 0 ? 'Get Started' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise Features */}
          <div className="mt-20 max-w-5xl mx-auto glass dark:bg-dark-200/50 rounded-3xl p-12 border border-white/20 dark:border-dark-300 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                🏢 Enterprise Solutions
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-600">
                Custom solutions for organizations with high-volume analysis needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Academic & Research</h3>
                <p className="text-gray-600 dark:text-dark-600 text-sm">
                  Special pricing for universities and research institutions
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Government</h3>
                <p className="text-gray-600 dark:text-dark-600 text-sm">
                  National and state government agency packages with priority support
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Education</h3>
                <p className="text-gray-600 dark:text-dark-600 text-sm">
                  Discounted rates for universities and research institutions
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/admin" className="btn-primary text-xl px-12 py-5">
                Contact Sales Team
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="glass dark:bg-dark-200/50 rounded-2xl p-8 border border-white/20 dark:border-dark-300">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600 dark:text-dark-600">
                  We accept all major credit/debit cards, UPI, net banking, and for enterprise clients, we offer invoice-based billing.
                </p>
              </div>
              <div className="glass dark:bg-dark-200/50 rounded-2xl p-8 border border-white/20 dark:border-dark-300">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600 dark:text-dark-600">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div className="glass dark:bg-dark-200/50 rounded-2xl p-8 border border-white/20 dark:border-dark-300">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600 dark:text-dark-600">
                  We offer a 14-day money-back guarantee if you're not satisfied with our service. For annual plans, pro-rated refunds are available.
                </p>
              </div>
              <div className="glass dark:bg-dark-200/50 rounded-2xl p-8 border border-white/20 dark:border-dark-300">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Is my data secure?</h3>
                <p className="text-gray-600 dark:text-dark-600">
                  Absolutely. We use military-grade 256-bit encryption, are ISO 27001 certified, and comply with all Indian data protection laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
