'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🔐</div>
        <p className="text-white text-xl">Redirecting to login...</p>
      </div>
    </div>
  );
}
