'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSearchHistory from '../hooks/useSearchHistory';

const SearchHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'recent'>('all');
  const { searchHistory, toggleFavorite, clearHistory, removeFromHistory } = useSearchHistory();
  const router = useRouter();

  // Filtrelenmiş ve sıralanmış geçmiş
  const filteredHistory = useMemo(() => {
    let filtered = searchHistory;

    // Filtre tipine göre filtrele
    if (filterType === 'favorites') {
      filtered = filtered.filter((item) => item.isFavorite);
    } else if (filterType === 'recent') {
      filtered = filtered.filter((item) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return item.timestamp > oneWeekAgo;
      });
    }

    // Arama sorgusuna göre filtrele
    if (filterQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.query.toLowerCase().includes(filterQuery.toLowerCase()),
      );
    }

    // Tarihe göre sırala (en yeni önce)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchHistory, filterQuery, filterType]);

  const handleSearch = (query: string) => {
    router.push(`/artwork/${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleToggleFavorite = (id: string, query: string, isFavorite: boolean) => {
    toggleFavorite(id);
  };

  const handleRemoveFromHistory = (id: string, query: string) => {
    removeFromHistory(id);
  };

  const handleClearHistory = () => {
    if (searchHistory.length === 0) {
      return;
    }

    if (window.confirm('Tüm arama geçmişini temizlemek istediğinizden emin misiniz?')) {
      clearHistory();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Dün';
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return new Date(date).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl px-4 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
        title="Arama Geçmişi"
        aria-label="Arama geçmişini aç/kapat"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">Arama Geçmişi</div>
            <div className="text-purple-300 text-xs">{searchHistory.length} arama</div>
          </div>
        </div>
      </button>

      {/* History Panel */}
      {isOpen && (
        <div className="fixed top-20 right-6 z-50 w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Arama Geçmişi</h3>
              <button
                onClick={handleClearHistory}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 px-3 py-1 rounded-lg transition-all text-sm font-medium"
                title="Geçmişi Temizle"
                aria-label="Tüm arama geçmişini temizle"
              >
                Temizle
              </button>
            </div>

            {/* Filtreleme Sistemi */}
            <div className="space-y-3">
              {/* Arama Kutusu */}
              <div className="relative">
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Aramaları filtrele..."
                  className="w-full px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder:text-gray-300 transition-all"
                  aria-label="Arama geçmişini filtrele"
                />
                <svg
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
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

              {/* Filtre Butonları */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                    filterType === 'all'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  aria-label="Tüm aramaları göster"
                >
                  Tümü
                </button>
                <button
                  onClick={() => setFilterType('favorites')}
                  className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                    filterType === 'favorites'
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  aria-label="Sadece favori aramaları göster"
                >
                  ⭐ Favoriler
                </button>
                <button
                  onClick={() => setFilterType('recent')}
                  className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                    filterType === 'recent'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  aria-label="Son 7 gündeki aramaları göster"
                >
                  Son 7 Gün
                </button>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.172a4 4 0 00-5.656 0M15 12H9m6-4H9"
                  />
                </svg>
                <p className="text-sm">
                  {filterQuery.trim()
                    ? `"${filterQuery}" için sonuç bulunamadı`
                    : filterType === 'favorites'
                    ? 'Henüz favori arama yok'
                    : filterType === 'recent'
                    ? 'Son 7 günde arama yapılmamış'
                    : 'Arama geçmişi boş'}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 border-b border-white/10 hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleSearch(item.query)}
                        className="text-left w-full text-white hover:text-purple-300 font-medium truncate transition-colors hover:underline"
                        title={item.query}
                        aria-label={`"${item.query}" eserini ara`}
                      >
                        {item.query}
                      </button>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xs text-gray-400">{formatDate(item.timestamp)}</span>
                        <span className="text-xs text-gray-500">{item.searchCount} kez arandı</span>
                        {item.isFavorite && (
                          <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                            ⭐ Favori
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleToggleFavorite(item.id, item.query, item.isFavorite)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          item.isFavorite
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20'
                            : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                        title={item.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                        aria-label={item.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={item.isFavorite ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleRemoveFromHistory(item.id, item.query)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        title="Geçmişten kaldır"
                        aria-label="Bu aramayı geçmişten kaldır"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-3 border-t border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>{filteredHistory.length} sonuç gösteriliyor</span>
              <span>Toplam: {searchHistory.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchHistory;
