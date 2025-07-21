import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata = {
  title: 'ArtStoryAI',
  description: 'Sanat eserlerini keşfet, hikayelerini öğren.',
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
      <body className="bg-[#121212] font-body text-[#ffffff]">{children}</body>
    </html>
  );
}
