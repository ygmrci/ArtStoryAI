// API Konfigürasyonu
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  ENDPOINTS: {
    FILTER_ARTWORKS: '/api/filter-artworks',
    FILTER_OPTIONS: '/api/filter/options',
    FILTER_STATS: '/api/filter/stats',
    MANUAL_ARTWORKS: '/api/filter/manual-artworks',
    API_ARTWORKS: '/api/filter/api-artworks',
  },
} as const;

// Filtre seçenekleri için varsayılan değerler
export const DEFAULT_FILTER_OPTIONS = {
  periods: ['Rönesans', 'Barok', 'Klasik', 'Modern', 'Çağdaş'],
  styles: ['Empresyonizm', 'Ekspresyonizm', 'Kübizm', 'Sürrealizm', 'Realizm', 'Romantizm'],
  colors: ['Sıcak', 'Soğuk', 'Monokrom', 'Renkli', 'Pastel', 'Canlı'],
  sizes: ['Küçük', 'Orta', 'Büyük'],
  museums: ['Louvre', 'MET', 'Uffizi', 'Prado', 'British Museum', 'Vatican Museums'],
  sources: ['Manuel Görseller', 'MET Museum', 'Art Institute', 'Wikimedia'],
} as const;

// Varsayılan sources değeri
export const DEFAULT_SOURCES = ['Manuel Görseller'] as const;
