import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DeepClean AI | National Deepfake Detection Platform',
  description: 'Government-grade deepfake detection and fraud prevention system for India. Advanced AI-powered analysis with court-admissible evidence.',
  keywords: 'deepfake detection, fraud prevention, AI security, government platform, India, voice analysis, video analysis',
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
