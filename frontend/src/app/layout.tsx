import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import Header from './components/Header';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'ArtStoryAI',
  description: 'Sanat eserlerini keşfet, hikayelerini öğren.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'ArtStoryAI - Sanat Eserlerini Keşfet',
    description: 'Sanat eserlerini AI ile analiz edin, hikayelerini öğrenin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'ArtStoryAI',
    images: [
      {
        url: '/VanGogh.png',
        width: 1200,
        height: 630,
        alt: 'ArtStoryAI - Van Gogh Arka Plan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtStoryAI - Sanat Eserlerini Keşfet',
    description: 'Sanat eserlerini AI ile analiz edin, hikayelerini öğrenin.',
    images: ['/VanGogh.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-black min-h-screen font-body text-white"
        style={{ backgroundColor: '#000000 !important' }}
      >
        {children}
      </body>
    </html>
  );
}
