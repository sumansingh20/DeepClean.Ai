'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-2xl border-b border-purple-100 sticky top-0 z-50 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 h-20">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center gap-2 transform hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">DC</span>
              </div>
              <div>
                <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">DeepClean.AI</span>
                <span className="block text-xs text-green-600 font-extrabold -mt-1">100% FREE</span>
              </div>
            </Link>
            <Link href="/" className="px-6 py-2.5 text-sm text-gray-700 hover:text-purple-600 font-bold transition border-2 border-transparent hover:border-purple-200 rounded-xl">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-base font-extrabold mb-6 shadow-xl transform hover:scale-105 transition-transform">
            🎉 ALWAYS FREE
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-6">
            Simple Pricing. Actually Free.
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            No hidden costs. No premium tiers. No paywalls. <br />
            <strong className="text-green-600 text-2xl font-extrabold">Everything is free, forever.</strong>
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-4 border-green-500 rounded-3xl shadow-2xl hover:shadow-green-200 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-10 text-center">
              <h2 className="text-4xl font-black mb-3">Forever Free Plan</h2>
              <p className="text-green-100 text-base font-semibold">For all women. No exceptions.</p>
              <div className="mt-8">
                <div className="text-7xl font-black">₹0</div>
                <div className="text-green-100 text-base mt-3 font-bold">No credit card required</div>
              </div>
            </div>

            {/* Features */}
            <div className="p-10">
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-8">What's Included:</h3>
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
