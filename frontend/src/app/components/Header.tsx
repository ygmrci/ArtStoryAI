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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full border-b border-gray-300 bg-white shadow-lg z-50">
        {/* Ana Header Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1.5 sm:py-2 md:py-3 lg:py-4">
            {/* Sol Taraf - Geri Dön Butonu + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Geri Dön Butonu - Daha kompakt responsive boyutlar */}
              <button
                onClick={() => router.back()}
                className="w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-md flex items-center justify-center text-xs sm:text-sm md:text-base"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4"
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
                  <span className="hidden sm:inline text-xs sm:text-sm">Geri</span>
                  <span className="sm:hidden text-xs">←</span>
                </div>
              </button>

              {/* Logo - Daha kompakt responsive boyutlar */}
              <Link
                href="/"
                className="group flex items-center gap-2 sm:gap-3 md:gap-4 hover:scale-105 transition-all duration-500"
                style={{ textDecoration: 'none' }}
              >
                <div className="relative">
                  <span
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                    role="img"
                    aria-label="Palet"
                  >
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
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-purple-500 tracking-wide"
                    style={{
                      background: 'linear-gradient(135deg,rgb(255, 255, 255),rgb(255, 255, 255))',
                      WebkitBackgroundClip: 'text',
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
            </div>

            {/* Orta - Desktop Navigation Links (Sadece md+ ekranlarda görünür) */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/about', label: 'Hakkında' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-medium text-sm lg:text-base transition-all duration-300 hover:scale-105 text-gray-700 group"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full bg-blue-500"></div>
                </Link>
              ))}
            </nav>

            {/* Sağ Taraf - Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              {/* Keşfet Butonu - Daha kompakt responsive boyutlar */}
              <button
                onClick={handleDiscoverClick}
                className="relative font-medium text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-105 text-gray-700 group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 border border-gray-200"
              >
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    />
                  </svg>
                  <span className="hidden sm:inline text-white font-medium">Keşfet</span>
                  <span className="sm:hidden">🔍</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </button>

              {/* Favorites Button - Daha kompakt responsive boyutlar */}
              <button
                onClick={handleFavoritesClick}
                className="w-12 sm:w-14 md:w-16 lg:w-20 xl:w-24 h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 shadow-md flex items-center justify-center text-xs sm:text-sm md:text-base"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline font-medium">Favoriler</span>
                  <span className="sm:hidden">❤️</span>

                  {/* Favori Sayısı Badge */}
                  {favorites.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[16px] sm:min-w-[20px] text-center">
                      {favorites.length}
                    </span>
                  )}
                </div>
              </button>

              {/* Hamburger Menu Button - Daha kompakt */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden w-7 h-7 sm:w-8 sm:h-8 flex flex-col justify-center items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                aria-label="Menüyü aç/kapat"
              >
                <span
                  className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                ></span>
                <span
                  className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Responsive tasarım */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <nav className="flex flex-col space-y-3 sm:space-y-4">
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/about', label: 'Hakkında' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="relative font-medium text-base sm:text-lg transition-all duration-300 text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-50"
                  style={{ textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
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
