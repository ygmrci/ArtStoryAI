import { useState, useEffect } from 'react';

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
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/filter/options');
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.data);
      }
    } catch (err) {
      console.error('Filtre seçenekleri alınamadı:', err);
    }
  };

  // İstatistikleri al
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/filter/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('İstatistikler alınamadı:', err);
    }
  };

  // Filtrelenmiş sanat eserlerini al
  const fetchFilteredArtworks = async (filters: FilterState) => {
    setLoading(true);
    setError(null);

    try {
      console.log("API'ye gönderilen filtreler:", filters); // Yeni log
      const response = await fetch('http://localhost:8000/api/filter/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data: FilterResponse = await response.json();
      console.log("API'den gelen yanıt:", data); // Yeni log
      setArtworks(data.artworks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('Filtreleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manuel görselleri al
  const fetchManualArtworks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/filter/manual-artworks');
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      console.error('Manuel görseller alınamadı:', err);
    }
  };

  // API görsellerini al
  const fetchApiArtworks = async (source: string, limit: number = 10) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/filter/api-artworks?source=${source}&limit=${limit}`,
      );
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      console.error('API görselleri alınamadı:', err);
    }
  };

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
      sources: ['Manuel Görseller'],
    });
  }, []);

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
