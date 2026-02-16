'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-pink-900 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="text-8xl mb-8">⚠️</div>
        <h1 className="text-5xl font-black text-white mb-6">Something Went Wrong</h1>
        <p className="text-xl text-gray-300 mb-8">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>
        
        <div className="bg-black/30 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 mb-8 text-left">
          <div className="text-sm text-red-300 font-mono">
            <div className="text-white font-bold mb-2">Error Details:</div>
            {error.message || 'An unexpected error occurred'}
            {error.digest && (
              <div className="mt-2 text-xs text-gray-400">
                Error ID: {error.digest}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            🏠 Go Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            📧 Contact Support
          </Link>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          <p>If this problem persists, please contact our support team at:</p>
          <a href="mailto:support@deepclean.ai" className="text-blue-400 hover:text-blue-300 font-bold">
            support@deepclean.ai
          </a>
        </div>
      </div>
    </div>
  );
}
