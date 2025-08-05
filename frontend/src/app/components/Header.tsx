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
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl shadow-2xl border-b border-gray-600/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
        {/* Sol taraf - Logo */}
        <Link
          href="/"
          className="group flex items-center gap-4 text-white select-none hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <span className="text-5xl" role="img" aria-label="Palet">
              🎨
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium tracking-wider">ArtStoryAI</span>
          </div>
        </Link>

        {/* Sağ taraf - Favoriler Butonu */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleFavoritesClick}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl text-lg border border-gray-200/50 hover:border-gray-300/50"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%) !important',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
              minWidth: 'auto !important',
              minHeight: 'auto !important',
            }}
          >
            <div className="relative">
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500 transition-all duration-300 group-hover:scale-110" />
              ) : (
                <HeartIcon className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-red-500" />
              )}
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
            </div>
            <span className="font-bold">Favorilerim</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
