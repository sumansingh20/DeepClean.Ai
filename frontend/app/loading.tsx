export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-8 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-8 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Loading...</h2>
        <p className="text-gray-300">Please wait while we fetch your content</p>
      </div>
    </div>
  );
}
