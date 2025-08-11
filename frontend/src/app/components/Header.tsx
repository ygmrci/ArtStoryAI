'use client';
import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const handleFavoritesClick = () => {
    router.push('/favorites');
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => router.back()}
          className="group relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #64748b, #94a3b8)',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(100, 116, 139, 0.3)',
            border: '1px solid rgba(100, 116, 139, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(100, 116, 139, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(100, 116, 139, 0.3)';
          }}
        >
          <svg
            className="w-4 h-4 transition-all duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Geri Dön</span>

          {/* Button Glow Effect */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg scale-110"
            style={{
              background: 'linear-gradient(135deg, #64748b, #94a3b8)',
              zIndex: -1,
            }}
          ></div>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-4 hover:scale-105 transition-all duration-500"
          style={{ textDecoration: 'none' }}
        >
          <div className="relative">
            <span className="text-4xl" role="img" aria-label="Palet">
              🎨
            </span>
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 blur-xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                filter: 'blur(20px)',
              }}
            ></div>
          </div>
          <div className="flex flex-col">
            <span
              className="text-xl font-bold tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #1e293b, #475569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ArtStoryAI
            </span>
            <div
              className="h-0.5 w-full rounded-full mt-1 transition-all duration-500 group-hover:w-0"
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              }}
            ></div>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Ana Sayfa' },
              { href: '/demo', label: 'Demo' },
              { href: '/about', label: 'Hakkında' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-medium text-sm transition-all duration-300 hover:scale-105"
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                }}
              >
                <span className="relative z-10">{link.label}</span>
                <div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  }}
                ></div>
              </Link>
            ))}
          </nav>

          {/* Favorites Button */}
          <button
            onClick={handleFavoritesClick}
            className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-500 transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
            }}
          >
            <div className="relative">
              {isLiked ? (
                <HeartSolidIcon
                  className="w-4 h-4 transition-all duration-500 group-hover:scale-125"
                  style={{ color: '#fca5a5' }}
                />
              ) : (
                <HeartIcon
                  className="w-4 h-4 transition-all duration-500 group-hover:scale-125"
                  style={{ color: '#ffffff' }}
                />
              )}
            </div>
            <span className="font-medium">Favorilerim</span>

            {/* Button Glow Effect */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                zIndex: -1,
              }}
            ></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
