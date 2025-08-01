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
        className="relative z-20 flex flex-col items-start justify-start px-8 pt-16 md:pt-24 lg:pt-32 max-w-xl w-full"
        style={{ minHeight: '60vh' }}
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
            placeholder="Bir tablo adı yazın"
            className="w-80 px-8 py-4 rounded-full bg-white text-black font-semibold shadow border-none text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Aranıyor...
              </div>
            ) : (
              'Ara'
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
