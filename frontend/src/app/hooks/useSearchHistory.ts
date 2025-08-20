'use client';

import { useState, useEffect, useCallback } from 'react';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  isFavorite: boolean;
  searchCount: number;
}

const STORAGE_KEY = 'artstory_search_history';
const MAX_HISTORY_ITEMS = 20; // Son 20 arama
const MAX_QUERY_LENGTH = 100; // Maksimum sorgu uzunluğu

const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Local storage'dan geçmişi yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Date string'leri Date objelerine çevir ve validate et
        const withDates = parsed
          .filter(
            (item: any) =>
              item &&
              item.id &&
              item.query &&
              typeof item.query === 'string' &&
              item.query.length <= MAX_QUERY_LENGTH,
          )
          .map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
            searchCount: Number(item.searchCount) || 1,
            isFavorite: Boolean(item.isFavorite),
          }))
          .filter((item: any) => !isNaN(item.timestamp.getTime())); // Geçersiz tarihleri filtrele

        setSearchHistory(withDates);
      }
    } catch (error) {
      console.error('Arama geçmişi yüklenirken hata:', error);
      // Hatalı veriyi temizle
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Local storage'a kaydet
  const saveToStorage = useCallback((history: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Arama geçmişi kaydedilirken hata:', error);
    }
  }, []);

  // Arama ekle
  const addSearch = useCallback(
    (query: string) => {
      if (!query || typeof query !== 'string') {
        console.warn('Geçersiz arama sorgusu:', query);
        return;
      }

      const trimmedQuery = query.trim();
      if (trimmedQuery.length === 0 || trimmedQuery.length > MAX_QUERY_LENGTH) {
        console.warn('Arama sorgusu çok uzun veya boş:', trimmedQuery);
        return;
      }

      setSearchHistory((prev) => {
        const existing = prev.find(
          (item) => item.query.toLowerCase() === trimmedQuery.toLowerCase(),
        );

        let updated: SearchHistoryItem[];

        if (existing) {
          // Mevcut aramayı güncelle
          updated = prev.map((item) =>
            item.query.toLowerCase() === trimmedQuery.toLowerCase()
              ? {
                  ...item,
                  timestamp: new Date(),
                  searchCount: item.searchCount + 1,
                }
              : item,
          );
        } else {
          // Yeni arama ekle
          const newItem: SearchHistoryItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Unique ID
            query: trimmedQuery,
            timestamp: new Date(),
            isFavorite: false,
            searchCount: 1,
          };

          updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        }

        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage],
  );

  // Favori işaretle
  const toggleFavorite = useCallback(
    (id: string) => {
      setSearchHistory((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage],
  );

  // Geçmişi temizle
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Arama geçmişinden kaldır
  const removeFromHistory = useCallback(
    (id: string) => {
      setSearchHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage],
  );

  // Belirli bir aramayı geçmişten kaldır
  const removeByQuery = useCallback(
    (query: string) => {
      setSearchHistory((prev) => {
        const updated = prev.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage],
  );

  // Favori aramaları getir
  const getFavoriteSearches = useCallback(() => {
    return searchHistory.filter((item) => item.isFavorite);
  }, [searchHistory]);

  // Son aramaları getir (son N gün)
  const getRecentSearches = useCallback(
    (days: number = 7) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return searchHistory.filter((item) => item.timestamp > cutoffDate);
    },
    [searchHistory],
  );

  // Arama istatistikleri
  const getSearchStats = useCallback(() => {
    const total = searchHistory.length;
    const favorites = searchHistory.filter((item) => item.isFavorite).length;
    const totalSearches = searchHistory.reduce((sum, item) => sum + item.searchCount, 0);

    return { total, favorites, totalSearches };
  }, [searchHistory]);

  return {
    searchHistory,
    isLoading,
    addSearch,
    toggleFavorite,
    clearHistory,
    removeFromHistory,
    removeByQuery,
    getFavoriteSearches,
    getRecentSearches,
    getSearchStats,
  };
};

export default useSearchHistory;
