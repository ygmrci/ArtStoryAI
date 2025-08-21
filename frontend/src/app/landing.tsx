import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';

export default function Landing() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Debug log'ları
  console.log('🔍 Landing Component Debug:', { query, isLoading });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      alert('Lütfen bir eser adı girin.');
      return;
    }

    setIsLoading(true);

    try {
      // Backend API'sine istek at
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/artwork/${encodeURIComponent(query.trim())}`);

      if (!response.ok) {
        throw new Error('API yanıtı başarısız');
      }

      const data = await response.json();

      // Eser sayfasına yönlendir
      router.push(`/artwork/${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Arama hatası:', error);
      alert('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full flex items-center justify-start bg-black overflow-hidden">
        {/* Arka plan görseli */}
        <img
          src="/VanGogh.png"
          alt="Van Gogh"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            filter: 'brightness(0.5) blur(0px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        {/* Karanlık overlay */}
        <div
          className="absolute inset-0 bg-black/60"
          style={{ zIndex: 1, pointerEvents: 'none' }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
            style={{ zIndex: 100 }}
          >
            <div className="text-center px-4">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-white mb-3"></div>
              <p className="text-white text-base sm:text-lg font-semibold">Eser aranıyor...</p>
              <p className="text-white/70 text-sm mt-2">"{query}" için bilgiler toplanıyor</p>
            </div>
          </div>
        )}

        {/* İçerik - Daha kompakt responsive container */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div
            className="relative flex flex-col items-start justify-start pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 max-w-lg w-full"
            style={{
              minHeight: '50vh',
              zIndex: 9999,
              position: 'relative',
              pointerEvents: 'auto',
            }}
          >
            {/* Başlık - Daha küçük responsive typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-extrabold text-white mb-2 sm:mb-3 lg:mb-4 drop-shadow-lg tracking-tight leading-tight">
              ArtStoryAI
            </h1>

            {/* Alt başlık - Daha küçük responsive typography */}
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-white/90 mb-4 sm:mb-6 lg:mb-8 max-w-sm lg:max-w-md xl:max-w-lg drop-shadow leading-relaxed">
              Sanat Tarihini Daha Önce Hiç Olmadığı Gibi Keşfedin
            </h2>

            {/* Arama Formu - Yatay layout, buton input'un yanında */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-row w-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl gap-3 sm:gap-4 bg-white/20 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-2xl border border-white/30"
              style={{
                zIndex: 9999,
                position: 'relative',
                pointerEvents: 'auto',
              }}
            >
              {/* Input Container */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bir sanat eseri yazın.(Mona Lisa)"
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 lg:py-4 xl:py-5 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-sm text-gray-800 font-medium text-sm sm:text-base lg:text-lg transition-all duration-300 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-300/50 focus:border-purple-400 placeholder:text-gray-500 shadow-lg border border-white/50"
                  disabled={isLoading}
                  style={{
                    zIndex: 9999,
                    position: 'relative',
                    pointerEvents: 'auto',
                    cursor: 'text',
                  }}
                />
                {/* Input Focus Indicator */}
                <div className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-transparent transition-all duration-300 pointer-events-none"></div>
              </div>

              {/* Arama Butonu - Input'un yanında */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2.5 sm:py-3 lg:py-4 xl:py-5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:transform-none whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)',
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.4)';
                  }
                }}
              >
                {/* Button Glow Effect */}
                <div
                  className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)',
                    zIndex: -1,
                  }}
                ></div>

                {isLoading ? (
                  <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-medium">Aranıyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="font-bold">Ara</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Responsive: Mobilde içerik ortalanır ve alt kısma kayar */}
        <style jsx>{`
          @media (max-width: 640px) {
            div[style*='min-height:50vh'] {
              align-items: center !important;
              justify-content: flex-end !important;
              padding-top: 0 !important;
              padding-bottom: 1.5rem !important;
              max-width: 100vw !important;
            }
          }

          @media (max-width: 768px) {
            div[style*='min-height:50vh'] {
              align-items: center !important;
              justify-content: flex-end !important;
              padding-top: 0 !important;
              padding-bottom: 2rem !important;
              max-width: 100vw !important;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
