'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const plans = [
    {
      name: 'Individual',
      description: 'For personal use',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        { text: '5 analyses/month', included: true },
        { text: 'Basic detection', included: true },
        { text: 'Email support', included: true },
        { text: 'Standard speed', included: true },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false },
      ]
    },
    {
      name: 'Professional',
      description: 'For creators & professionals',
      monthlyPrice: 2999,
      annualPrice: 29999,
      popular: true,
      features: [
        { text: '100 analyses/month', included: true },
        { text: 'All detection engines', included: true },
        { text: 'Priority support', included: true },
        { text: 'Fast processing', included: true },
        { text: 'API access', included: true },
        { text: 'Evidence reports', included: true },
      ]
    },
    {
      name: 'Enterprise',
      description: 'For organizations',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      popular: false,
      features: [
        { text: 'Unlimited analyses', included: true },
        { text: 'Custom training', included: true },
        { text: '24/7 support', included: true },
        { text: 'White-label', included: true },
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-lg">DC</span>
              </div>
              <span className="font-black text-gray-900 text-xl tracking-tight">DeepClean.AI</span>
            </Link>
            <Link href="/login" className="px-7 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-[1.02]">
            Simple, <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">transparent</span> pricing
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-medium">
            Flexible pricing for individuals, professionals, and enterprises
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full p-2 shadow-md border-2 border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-bold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-full font-bold transition-all duration-200 relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-black shadow-md">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-6">
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">\n          {plans.map((plan, idx) => (
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
                🏛️ Special Plans Available
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-600">
                Custom solutions for government agencies, law enforcement, and large organizations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">👮</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Law Enforcement</h3>
                <p className="text-gray-600 dark:text-dark-600 text-sm">
                  Special pricing and features for police departments and cybercrime units
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
