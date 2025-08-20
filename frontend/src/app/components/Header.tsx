'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import SmartFilterModal from './SmartFilterModal';

const Header = () => {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleFavoritesClick = () => {
    router.push('/favorites');
  };

  const handleDiscoverClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: any) => {
    // Filtreleri URL parametrelerine çevir
    const params = new URLSearchParams();

    if (filters.periods && filters.periods.length > 0) {
      params.set('periods', filters.periods.join(','));
    }
    if (filters.styles && filters.styles.length > 0) {
      params.set('styles', filters.styles.join(','));
    }
    if (filters.colors && filters.colors.length > 0) {
      params.set('colors', filters.colors.join(','));
    }
    if (filters.sizes && filters.sizes.length > 0) {
      params.set('sizes', filters.sizes.join(','));
    }
    if (filters.museums && filters.museums.length > 0) {
      params.set('museums', filters.museums.join(','));
    }
    if (filters.sources && filters.sources.length > 0) {
      params.set('sources', filters.sources.join(','));
    }

    // Yeni sayfaya yönlendir
    const queryString = params.toString();
    const discoverUrl = queryString ? `/discover?${queryString}` : '/discover';
    router.push(discoverUrl);

    // Modal'ı kapat
    setIsFilterModalOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full border-b border-gray-300"
        style={{
          backgroundColor: '#ffffff',
          zIndex: 99999, // Kalp ikonundan daha yüksek z-index
          position: 'fixed',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          {/* Geri Dön Butonu */}
          <button
            onClick={() => router.back()}
            className="w-32 h-12 bg-gray-500 hover:bg-gray-600 text-black font-medium rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-md flex items-center justify-center"
            style={{ position: 'relative', zIndex: 10000 }}
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
            style={{ textDecoration: 'none', position: 'relative', zIndex: 10000 }}
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
                className="text-xl font-bold text-purple-500 tracking-wide"
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
          <div className="flex items-center gap-8" style={{ position: 'relative', zIndex: 10000 }}>
            {/* Navigation Links */}
            <nav className="flex items-center gap-8">
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/demo', label: 'Demo' },
                { href: '/about', label: 'Hakkında' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-medium text-sm transition-all duration-300 hover:scale-105 text-gray-700 hidden md:block"
                  style={{ textDecoration: 'none', position: 'relative', zIndex: 10001 }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full bg-blue-500"></div>
                </Link>
              ))}

              {/* Keşfet Butonu - Akıllı Filtreleme */}
              <button
                onClick={handleDiscoverClick}
                className="relative font-medium text-sm transition-all duration-300 hover:scale-105 text-gray-700 group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-200"
                style={{ position: 'relative', zIndex: 10001 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">Keşfet</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </button>
            </nav>

            {/* Favorites Button */}
            <div
              className="flex items-center gap-2"
              style={{ position: 'relative', zIndex: 10001 }}
            >
              {/* Favoriler Sayfası Butonu */}
              <button
                onClick={handleFavoritesClick}
                className="w-32 h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 shadow-md flex items-center justify-center"
                style={{ position: 'relative', zIndex: 10001 }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">Favorilerim</span>

                  {/* Favori Sayısı Badge */}
                  {favorites.length > 0 && (
                    <span
                      className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                      style={{ position: 'relative', zIndex: 10002 }}
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

      {/* Akıllı Filtreleme Modal */}
      <SmartFilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />

      {/* Debug bilgisi */}
      {console.log('Header render - isFilterModalOpen:', isFilterModalOpen)}
    </>
  );
};

export default Header;
