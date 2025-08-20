import { useState, useEffect, useCallback } from 'react';

interface CacheStats {
  total_keys: number;
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hit_rate: number;
}

interface UseCacheStatsReturn {
  stats: CacheStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  clearCache: () => Promise<void>;
}

const useCacheStats = (): UseCacheStatsReturn => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/recommendations/cache/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Cache stats fetch error:', err);
      setError(err instanceof Error ? err.message : 'Cache istatistikleri alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/recommendations/cache/clear`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Cache temizlendikten sonra stats'ı sıfırla
      setStats({
        total_keys: 0,
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        hit_rate: 0,
      });
    } catch (err) {
      console.error('Cache clear error:', err);
      setError(err instanceof Error ? err.message : 'Cache temizlenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    clearCache,
  };
};

export default useCacheStats;
