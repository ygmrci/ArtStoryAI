'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SmartFilterModal from '../components/SmartFilterModal';
import { useFilterArtworks } from '../hooks/useFilterArtworks';
import Header from '../components/Header';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  period: string;
  style: string;
  museum: string;
  imageUrl: string;
  description: string;
  source?: string;
}

const DiscoverPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filtreleme hook'u
  const { filterOptions, fetchFilteredArtworks } = useFilterArtworks();

  // Filtreleme fonksiyonları
  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = async (filters: any) => {
    console.log('Uygulanan filtreler:', filters);
    setActiveFilters(filters);

    try {
      await fetchFilteredArtworks(filters);
      // Filtreleme sonrası mock data yerine gerçek veriyi kullan
      // setArtworks(filteredArtworks);
    } catch (error) {
      console.error('Filtreleme hatası:', error);
    }
  };

  // Mock data - gerçek uygulamada backend'den gelecek
  const mockArtworks: Artwork[] = [
    {
      id: '1',
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: '1503-1519',
      period: 'Rönesans',
      style: 'Realizm',
      museum: 'Louvre',
      imageUrl: '/artworks/mona-lisa.jpg',
      description: 'Dünyaca ünlü portre',
      source: 'manual',
    },
    {
      id: '2',
      title: 'Yıldızlı Gece',
      artist: 'Vincent van Gogh',
      year: '1889',
      period: 'Modern',
      style: 'Post-Empresyonizm',
      museum: 'MOMA',
      imageUrl: '/artworks/kafeTerastaGece.webp',
      description: 'Hareketli gökyüzü tasviri',
      source: 'manual',
    },
    {
      id: '3',
      title: 'Guernica',
      artist: 'Pablo Picasso',
      year: '1937',
      period: 'Modern',
      style: 'Kübizm',
      museum: 'Reina Sofía',
      imageUrl: '/artworks/Picasso_Guernica.jpg',
      description: 'Savaşın dehşetini yansıtan eser',
      source: 'manual',
    },
    {
      id: '4',
      title: 'Avignonlu Kızlar',
      artist: 'Pablo Picasso',
      year: '1907',
      period: 'Modern',
      style: 'Kübizm',
      museum: 'MOMA',
      imageUrl: '/artworks/avignonluKızlar.jpg',
      description: 'Kübist sanatın öncü eseri',
      source: 'manual',
    },
    {
      id: '5',
      title: "Venüs'ün Doğuşu",
      artist: 'Sandro Botticelli',
      year: '1485',
      period: 'Rönesans',
      style: 'Realizm',
      museum: 'Uffizi',
      imageUrl: '/artworks/VenüsDogusu.jpg',
      description: 'Klasik mitolojik tema',
      source: 'manual',
    },
    {
      id: '6',
      title: 'Ağlayan Kadın',
      artist: 'Pablo Picasso',
      year: '1937',
      period: 'Modern',
      style: 'Kübizm',
      museum: 'Tate Modern',
      imageUrl: '/artworks/Weeping-woman.jpg',
      description: 'Kübist tarzda ağlayan kadın portresi',
      source: 'manual',
    },
    {
      id: '13',
      title: 'Çığlık',
      artist: 'Edvard Munch',
      year: '1893',
      period: 'Modern',
      style: 'Ekspresyonizm',
      museum: 'National Gallery',
      imageUrl: '/artworks/Weeping-woman.jpg',
      description: 'Varoluşsal kaygıyı yansıtan ikonik eser',
      source: 'manual',
    },
    {
      id: '7',
      title: "Adem'in Yaratılışı",
      artist: 'Michelangelo',
      year: '1512',
      period: 'Rönesans',
      style: 'Realizm',
      museum: 'Sistine Chapel',
      imageUrl: '/artworks/Adem.jpg',
      description: 'İnsanlığın yaratılışını tasvir eden fresk',
      source: 'manual',
    },
    {
      id: '8',
      title: 'Kaplumbağa Terbiyecisi',
      artist: 'Osman Hamdi Bey',
      year: '1906',
      period: 'Modern',
      style: 'Oryantalizm',
      museum: 'Pera Museum',
      imageUrl: '/artworks/kaplumbagaTerbiyecisi.jpg',
      description: 'Osmanlı kültürünü yansıtan önemli eser',
      source: 'manual',
    },
    {
      id: '9',
      title: 'Nilüferler',
      artist: 'Claude Monet',
      year: '1916',
      period: 'Modern',
      style: 'Empresyonizm',
      museum: 'Orangerie',
      imageUrl: '/artworks/Nilüferler.jpg',
      description: 'Su üzerindeki nilüfer çiçeklerinin empresyonist tasviri',
      source: 'manual',
    },
    {
      id: '10',
      title: 'Köylü Kadın',
      artist: 'Vincent van Gogh',
      year: '1885',
      period: 'Modern',
      style: 'Realizm',
      museum: 'Van Gogh Museum',
      imageUrl: '/artworks/koyluKadın.jpg',
      description: 'Köy yaşamının gerçekçi tasviri',
      source: 'manual',
    },
    {
      id: '11',
      title: 'David',
      artist: 'Michelangelo',
      year: '1504',
      period: 'Rönesans',
      style: 'Realizm',
      museum: 'Accademia',
      imageUrl: '/artworks/David.jpg',
      description: 'İnsan vücudunun mükemmelliğini yansıtan heykel',
      source: 'manual',
    },
    {
      id: '12',
      title: 'Amerikan Gotiği',
      artist: 'Grant Wood',
      year: '1930',
      period: 'Modern',
      style: 'Regionalism',
      museum: 'Art Institute of Chicago',
      imageUrl: '/artworks/amerikanGotiği.jpg',
      description: 'Amerikan kırsal yaşamının ikonik tasviri',
      source: 'manual',
    },
  ];

  useEffect(() => {
    // URL'den filtreleri al
    const filters: any = {};
    const periods = searchParams.get('periods');
    const styles = searchParams.get('styles');
    const colors = searchParams.get('colors');
    const sizes = searchParams.get('sizes');
    const museums = searchParams.get('museums');

    if (periods) filters.periods = periods.split(',');
    if (styles) filters.styles = styles.split(',');
    if (colors) filters.colors = colors.split(',');
    if (sizes) filters.sizes = sizes.split(',');
    if (museums) filters.museums = museums.split(',');

    setActiveFilters(filters);

    // Backend API'den filtreli sonuçları al
    const fetchFilteredResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Backend API endpoint'i
        const apiUrl = new URL('http://127.0.0.1:8000/api/filter-artworks');

        // Query parametrelerini ekle
        if (filters.periods) apiUrl.searchParams.set('periods', filters.periods.join(','));
        if (filters.styles) apiUrl.searchParams.set('styles', filters.styles.join(','));
        if (filters.colors) apiUrl.searchParams.set('colors', filters.colors.join(','));
        if (filters.sizes) apiUrl.searchParams.set('sizes', filters.sizes.join(','));
        if (filters.museums) apiUrl.searchParams.set('museums', filters.museums.join(','));

        console.log('Backend API çağrısı:', apiUrl.toString());

        const response = await fetch(apiUrl.toString());
        if (!response.ok) {
          throw new Error(`API hatası: ${response.status}`);
        }

        const data = await response.json();
        console.log('Backend API yanıtı:', data);

        if (data.artworks && data.artworks.length > 0) {
          // Backend'den gelen verileri kullan
          setArtworks(data.artworks);
        } else {
          // Fallback: Mock data kullan
          console.log('Backend veri yok, mock data kullanılıyor');
          let filtered = mockArtworks;

          if (filters.periods && filters.periods.length > 0) {
            filtered = filtered.filter((artwork) => filters.periods.includes(artwork.period));
          }

          if (filters.styles && filters.styles.length > 0) {
            filtered = filtered.filter((artwork) => filters.styles.includes(artwork.style));
          }

          if (filters.museums && filters.museums.length > 0) {
            filtered = filtered.filter((artwork) => filters.museums.includes(artwork.museum));
          }

          setArtworks(filtered);
        }
      } catch (err) {
        console.error('API hatası, mock data kullanılıyor:', err);
        // Hata durumunda mock data kullan
        let filtered = mockArtworks;

        if (filters.periods && filters.periods.length > 0) {
          filtered = filtered.filter((artwork) => filters.periods.includes(artwork.period));
        }

        if (filters.styles && filters.styles.length > 0) {
          filtered = filtered.filter((artwork) => filters.styles.includes(artwork.style));
        }

        if (filters.museums && filters.museums.length > 0) {
          filtered = filtered.filter((artwork) => filters.museums.includes(artwork.museum));
        }

        setArtworks(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredResults();
  }, [searchParams]);

  const handleBackToFilters = () => {
    router.back();
  };

  const handleArtworkClick = (artwork: Artwork) => {
    // Sanat eseri detay sayfasına yönlendir
    const artworkSlug = artwork.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    router.push(`/artwork/${artworkSlug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl font-semibold text-white">Filtreleme sonuçları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-white mb-4">Hata!</p>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={handleBackToFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Component */}
      <Header />

      {/* Sayfa Başlığı */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <h1 className="text-2xl font-bold text-white">Keşfet</h1>
            </div>
          </div>

          {/* Aktif Filtreler ve Eser Sayısı */}
          <div className="flex flex-col items-center gap-4">
            {/* Eser Sayısı */}
            <div className="text-center">
              <span className="text-slate-300 font-medium text-lg">
                {artworks.length} eser bulundu
              </span>
            </div>

            {/* Aktif Filtreler */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {Object.entries(activeFilters).map(([category, values]) =>
                  (values as string[]).map((value) => (
                    <span
                      key={`${category}-${value}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full font-medium shadow-lg"
                    >
                      {value}
                    </span>
                  )),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {artworks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
            <p className="text-slate-300 mb-6">
              Seçilen filtrelere uygun eser bulunamadı. Filtreleri değiştirmeyi deneyin.
            </p>
            <button
              onClick={handleBackToFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Filtreleri Düzenle
            </button>
          </div>
        ) : (
          <div
            className="flex flex-row flex-wrap justify-between items-start gap-8"
            style={{
              margin: '32px 32px 0 32px',
              minHeight: '100vh',
              alignContent: 'flex-start',
            }}
          >
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                onClick={() => handleArtworkClick(artwork)}
                className="group cursor-pointer rounded-3xl transition-all duration-500 flex flex-col"
                style={{
                  width: '300px',
                  height: '480px',
                  flex: '0 0 300px',
                  background:
                    'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))',
                  borderRadius: '24px',
                  backdropFilter: 'blur(10px)',
                  transform: 'translateY(0) scale(1)',
                  transition: 'all 0.5s ease',
                  overflow: 'hidden',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  marginBottom: '24px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(55, 65, 81, 0.9), rgba(31, 41, 55, 0.9))';
                  e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Görsel */}
                <div className="relative overflow-hidden rounded-t-lg">
                  {artwork.imageUrl ? (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling;
                        if (placeholder) {
                          placeholder.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  {/* Placeholder - varsayılan olarak gizli */}
                  <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center hidden">
                    <div className="text-center text-gray-400">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">Görsel Bulunamadı</p>
                    </div>
                  </div>
                </div>

                {/* İçerik Alanı */}
                <div className="p-3 flex-1 flex flex-col justify-between h-40">
                  {/* Başlık ve Sanatçı */}
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium line-clamp-1">
                      {artwork.artist}
                    </p>
                  </div>

                  {/* Detaylar */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium w-10">Tarih:</span>
                      <span className="truncate">{artwork.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium w-10">Dönem:</span>
                      <span className="truncate">{artwork.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium w-10">Stil:</span>
                      <span className="truncate">{artwork.style}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium w-10">Müze:</span>
                      <span className="truncate">{artwork.museum}</span>
                    </div>
                  </div>

                  {/* Açıklama */}
                  <div className="mb-2 flex-1">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                      {artwork.description}
                    </p>
                  </div>

                  {/* Kaynak Bilgisi */}
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Kaynak:</span>{' '}
                    {artwork.source === 'manual' ? 'Manuel Görseller' : artwork.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Akıllı Filtreleme Modal */}
        <SmartFilterModal
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default DiscoverPage;
