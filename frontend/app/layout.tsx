import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DeepClean AI | AI-Powered Deepfake Detection Platform',
  description: 'Advanced AI-powered deepfake detection and media verification. Analyze videos, images, and audio with machine learning algorithms.',
  keywords: 'deepfake detection, AI analysis, media verification, video analysis, audio analysis, image analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
