import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      alert('Lütfen bir eser adı girin.');
      return;
    }

    setIsLoading(true);

    try {
      // Backend API'sine istek at
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
    <div className="relative min-h-screen w-full flex items-center justify-start bg-black overflow-hidden">
      {/* Arka plan görseli */}
      <img
        src="/VanGogh.png"
        alt="Van Gogh"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{ filter: 'brightness(0.5) blur(0px)' }}
      />
      {/* Karanlık overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
            <p className="text-white text-xl font-semibold">Eser aranıyor...</p>
            <p className="text-white/70 text-sm mt-2">"{query}" için bilgiler toplanıyor</p>
          </div>
        </div>
      )}

      {/* İçerik */}
      <div
        className="relative z-20 flex flex-col items-start justify-start pt-16 md:pt-24 lg:pt-32 max-w-xl w-full"
        style={{
          minHeight: '60vh',
          paddingLeft: '50px',
          paddingRight: '50px',
        }}
      >
        <h1 className="text-5xl font-serif font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">
          ArtStoryAI
        </h1>
        <h2 className="text-2xl font-medium text-white/90 mb-8 max-w-md drop-shadow">
          Sanat Tarihini Daha Önce Hiç Olmadığı Gibi Keşfedin
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row w-full max-w-lg gap-2 bg-white/10 rounded-full p-2 shadow-lg backdrop-blur-md"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bir tablo adı yazın örn: Mona Lisa"
            className="w-[400px] px-20 py-10 rounded-full bg-white text-black font-semibold text-xl transition-all duration-300 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 placeholder:text-gray-500 shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="group relative px-12 py-6 rounded-full font-semibold text-xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              color: '#ffffff',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
              }
            }}
          >
            {/* Button Glow Effect */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                zIndex: -1,
              }}
            ></div>

            {isLoading ? (
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="font-medium">Aranıyor...</span>
              </div>
            ) : (
              <span className="relative z-10 font-bold">Ara</span>
            )}
          </button>
        </form>
      </div>

      {/* Responsive: Mobilde içerik ortalanır ve alt kısma kayar */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*='min-height:60vh'] {
            align-items: center !important;
            justify-content: flex-end !important;
            padding-top: 0 !important;
            padding-bottom: 3rem !important;
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
}
