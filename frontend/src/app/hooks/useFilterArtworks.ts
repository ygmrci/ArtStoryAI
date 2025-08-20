import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, DEFAULT_FILTER_OPTIONS, DEFAULT_SOURCES } from '../../lib/config';

interface FilterState {
  periods: string[];
  styles: string[];
  colors: string[];
  sizes: string[];
  museums: string[];
  sources: string[];
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  period: string;
  style: string;
  museum: string;
  imageUrl: string;
  source: string;
  description: string;
}

interface FilterResponse {
  total: number;
  sources: {
    manual: number;
    met_museum: number;
  };
  artworks: Artwork[];
}

export const useFilterArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  // Filtre seçeneklerini al
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILTER_OPTIONS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.data);
      }
    } catch (err) {
      console.error('Filtre seçenekleri alınamadı:', err);
      // Fallback: Varsayılan filtre seçeneklerini kullan
      setFilterOptions(DEFAULT_FILTER_OPTIONS);
    }
  }, []);

  // İstatistikleri al
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILTER_STATS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('İstatistikler alınamadı:', err);
    }
  }, []);

  // Filtrelenmiş sanat eserlerini al - GET method ile query params kullan
  const fetchFilteredArtworks = useCallback(async (filters: FilterState) => {
    setLoading(true);
    setError(null);

    try {
      // Query parametrelerini oluştur
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

      const url = `${API_CONFIG.BASE_URL}${
        API_CONFIG.ENDPOINTS.FILTER_ARTWORKS
      }?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data: FilterResponse = await response.json();

      if (data.artworks && data.artworks.length > 0) {
        setArtworks(data.artworks);
      } else {
        // Eğer sonuç yoksa boş array set et
        setArtworks([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      console.error('Filtreleme hatası:', err);
      // Hata durumunda boş array set et
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manuel görselleri al
  const fetchManualArtworks = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANUAL_ARTWORKS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      console.error('Manuel görseller alınamadı:', err);
      setArtworks([]);
    }
  }, []);

  // API görsellerini al
  const fetchApiArtworks = useCallback(async (source: string, limit: number = 10) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API_ARTWORKS}?source=${source}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      console.error('API görselleri alınamadı:', err);
      setArtworks([]);
    }
  }, []);

  // Component mount olduğunda filtre seçeneklerini ve istatistikleri al
  useEffect(() => {
    fetchFilterOptions();
    fetchStats();
    // Sayfa yüklendiğinde varsayılan olarak manuel görselleri getir
    fetchFilteredArtworks({
      periods: [],
      styles: [],
      colors: [],
      sizes: [],
      museums: [],
      sources: [...DEFAULT_SOURCES],
    });
  }, [fetchFilterOptions, fetchStats, fetchFilteredArtworks]);

  return {
    artworks,
    loading,
    error,
    filterOptions,
    stats,
    fetchFilteredArtworks,
    fetchManualArtworks,
    fetchApiArtworks,
    clearError: () => setError(null),
  };
};
