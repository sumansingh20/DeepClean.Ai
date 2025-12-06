import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-9xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          404
        </div>
        <h1 className="text-5xl font-black text-white mb-6">Page Not Found</h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            🏠 Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/help"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            💡 Help Center
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { href: '/analysis', icon: '🔬', label: 'Analysis' },
            { href: '/reports', icon: '📊', label: 'Reports' },
            { href: '/victim', icon: '🛡️', label: 'Victim Support' },
            { href: '/contact', icon: '📧', label: 'Contact' }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/30 transition-all group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{link.icon}</div>
              <div className="text-white font-bold">{link.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
