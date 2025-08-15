'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFavorites } from '../contexts/FavoritesContext';

const Header = () => {
  const router = useRouter();
  const { favorites } = useFavorites();

  const handleFavoritesClick = () => {
    router.push('/favorites');
  };

  return (
    <header
      className="fixed top-0 left-0 w-full border-b border-gray-300"
      style={{
        backgroundColor: '#ffffff',
        zIndex: 999999,
        position: 'fixed',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => router.back()}
          className="w-32 h-12 bg-gray-500 hover:bg-gray-600 text-black font-medium rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-md flex items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Geri Dön</span>
          </div>
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
                background: 'linear-gradient(135deg,rgb(255, 255, 255),rgb(255, 255, 255))',
                WebkitBackgroundClip: 'text',
                // WebkitTextFillColor: 'transparent',
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
                className="relative font-medium text-sm transition-all duration-300 hover:scale-105 text-gray-700"
                style={{ textDecoration: 'none' }}
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full bg-blue-500"></div>
              </Link>
            ))}
          </nav>

          {/* Favorites Button */}
          <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 999999 }}>
            {/* Favoriler Sayfası Butonu */}
            <button
              onClick={handleFavoritesClick}
              className="w-32 h-12 bg-blue-500 hover:bg-blue-600 text-black font-medium rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 shadow-md flex items-center justify-center"
              style={{ position: 'relative', zIndex: 999999 }}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">Favorilerim</span>

                {/* Favori Sayısı Badge */}
                {favorites.length > 0 && (
                  <span
                    className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                    style={{ position: 'relative', zIndex: 999999 }}
                  >
                    {favorites.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
