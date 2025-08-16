'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import SimilarArtworks from '../../components/SimilarArtworks';
import AudioPlayer from '../../components/AudioPlayer';
import { useFavorites } from '../../contexts/FavoritesContext';

interface SimilarArtwork {
  title: string;
  artist: string;
  year: string;
  image_url: string;
  similarity_reason: string;
}

interface ArtworkData {
  art_name: string;
  artist: string;
  year: number;
  movement: string;
  museum: string;
  story: string;
  artist_bio: string;
  movement_desc: string;
  image_url: string;
  similar_artworks?: SimilarArtwork[];
}

export default function ArtworkClient({ artName }: { artName: string }) {
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState(124);
  const { isFavorite, toggleFavorite } = useFavorites();

  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!artName) return;

    const fetchArtwork = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/artwork/${encodeURIComponent(artName)}`);
        if (!res.ok) {
          throw new Error(t('artwork.apiError'));
        }
        const data = await res.json();
        setArtwork(data);
      } catch (err) {
        setError(t('artwork.fetchError'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtwork();
  }, [artName]);

  const handleLike = () => {
    if (!artwork) return;

    const favoriteArtwork = {
      id: artwork.art_name,
      art_name: artwork.art_name,
      artist: artwork.artist,
      year: artwork.year,
      image_url: artwork.image_url,
    };

    toggleFavorite(favoriteArtwork);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork?.art_name,
        text: `${artwork?.art_name} - ${artwork?.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        {/* Loading Content */}
        <div className="p-4 md:p-6 lg:p-8" style={{ paddingTop: '100px' }}>
          {/* Mobile Loading */}
          <div className="md:hidden">
            <div className="bg-gray-800 rounded-lg h-32 max-w-[300px] mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-800 rounded w-1/2 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Desktop Loading */}
          <div className="hidden lg:flex gap-6">
            <div className="w-24 h-24 bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-1/3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Tablet Loading */}
          <div className="hidden md:flex lg:hidden gap-4">
            <div className="w-28 h-28 bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-800 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-1/3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Hata Oluştu</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="group relative bg-white text-black px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
            style={{
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.3)';
            }}
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Eser Bulunamadı</h2>
          <p className="text-gray-300 mb-6">{t('artwork.notFound')}</p>
          <button
            onClick={() => router.back()}
            className="group relative bg-white text-black px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
            style={{
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.3)';
            }}
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black relative"
      style={{ backgroundColor: '#000000 !important' }}
    >
      {/* Content */}
      <div className="p-4 md:p-6 lg:p-8" style={{ paddingTop: '120px' }}>
        {/* Mobile Layout - Alt Alta */}
        <div className="md:hidden">
          {/* Artwork Image */}
          <div className="relative mb-4">
            <div className="relative overflow-hidden rounded-lg max-w-[300px] mx-auto">
              <img
                src={(() => {
                  const title = artwork.art_name.toLowerCase();

                  // Manuel eklenen resimler için direkt kullan
                  if (
                    title.includes('cafe terrace') ||
                    title.includes('kafe terasta') ||
                    title.includes('kafe terasta gece')
                  ) {
                    return '/artworks/kafeTerastaGece.webp';
                  } else if (
                    title.includes('lady with an ermine') ||
                    title.includes('lady with ermine')
                  ) {
                    return '/artworks/ladywithandermine.jpg';
                  } else if (
                    title.includes('sarı ev') ||
                    title.includes('yellow house') ||
                    title.includes('the yellow house')
                  ) {
                    return '/artworks/sarıev.jpg';
                  } else if (title.includes('sunflowers') || title.includes('ayçiçekleri')) {
                    return '/artworks/sunflowers.jpg';
                  } else if (title.includes('the milkmaid') || title.includes('sütçü kız')) {
                    return '/artworks/themilkmaid.jpg';
                  } else if (title.includes('guernica')) {
                    return '/artworks/Picasso_Guernica.jpg';
                  } else if (
                    title.includes('avignonlu kızlar') ||
                    title.includes("les demoiselles d'avignon")
                  ) {
                    return '/artworks/avignonluKızlar.jpg';
                  } else if (title.includes('weeping woman') || title.includes('ağlayan kadın')) {
                    return '/artworks/Weeping-woman.jpg';
                  } else {
                    // Diğer eserler için backend'den gelen resmi kullan
                    // Eğer backend'den manuel resim URL'si geliyorsa, tam URL yap
                    if (artwork.image_url && artwork.image_url.startsWith('/manual-images/')) {
                      return `http://127.0.0.1:8000${artwork.image_url}`;
                    }
                    return (
                      artwork.image_url ||
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
                    );
                  }
                })()}
                alt={artwork.art_name}
                className="w-full h-32 object-cover"
                style={{
                  maxWidth: '300px !important',
                  maxHeight: '128px !important',
                  minWidth: '200px !important',
                  minHeight: '80px !important',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';
                }}
              />

              {/* Favori Kalp İkonu - Sağ Üst */}
              <div
                className="absolute top-2 right-2 cursor-pointer transition-all duration-300"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 9999,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  border: '2px solid white',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'white';
                }}
                onClick={handleLike}
              >
                {isFavorite(artwork.art_name) ? '💖' : '🤍'}
              </div>
            </div>
          </div>

          {/* Title and Info */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-serif font-bold text-white mb-2">{artwork.art_name}</h1>
            <p className="text-gray-300 text-sm font-medium">
              {artwork.artist}, {artwork.year}
            </p>
            <p className="text-gray-400 text-xs">{artwork.movement}</p>
            <p className="text-gray-500 text-xs mt-1">
              {artwork.museum || 'Müze bilgisi mevcut değil'}
            </p>
          </div>

          {/* Description */}
          <div className="bg-gray-900 rounded-xl p-4" style={{ margin: '0 16px' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Eserin Hikayesi</h3>
              <AudioPlayer artName={artwork.art_name} story={artwork.story} className="scale-75" />
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">{artwork.story}</p>
          </div>
        </div>

        {/* Desktop Layout - Sol Tablo, Sağ Bilgiler */}
        <div className="hidden lg:flex gap-6">
          {/* Left Column - Image */}
          <div className="w-24 flex-shrink-0">
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={(() => {
                    const title = artwork.art_name.toLowerCase();

                    // Manuel eklenen resimler için direkt kullan
                    if (
                      title.includes('cafe terrace') ||
                      title.includes('kafe terasta') ||
                      title.includes('kafe terasta gece')
                    ) {
                      return '/artworks/kafeTerastaGece.webp';
                    } else if (
                      title.includes('lady with an ermine') ||
                      title.includes('lady with ermine')
                    ) {
                      return '/artworks/ladywithandermine.jpg';
                    } else if (
                      title.includes('sarı ev') ||
                      title.includes('yellow house') ||
                      title.includes('the yellow house')
                    ) {
                      return '/artworks/sarıev.jpg';
                    } else if (title.includes('sunflowers') || title.includes('ayçiçekleri')) {
                      return '/artworks/sunflowers.jpg';
                    } else if (title.includes('the milkmaid') || title.includes('sütçü kız')) {
                      return '/artworks/themilkmaid.jpg';
                    } else if (title.includes('guernica')) {
                      return '/artworks/Picasso_Guernica.jpg';
                    } else if (
                      title.includes('avignonlu kızlar') ||
                      title.includes("les demoiselles d'avignon")
                    ) {
                      return '/artworks/avignonluKızlar.jpg';
                    } else if (title.includes('weeping woman') || title.includes('ağlayan kadın')) {
                      return '/artworks/Weeping-woman.jpg';
                    } else {
                      // Diğer eserler için backend'den gelen resmi kullan
                      return (
                        artwork.image_url ||
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
                      );
                    }
                  })()}
                  alt={artwork.art_name}
                  className="w-24 h-24 object-cover"
                  style={{
                    maxWidth: '96px !important',
                    maxHeight: '96px !important',
                    minWidth: '80px !important',
                    minHeight: '80px !important',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';
                  }}
                />

                {/* Favori Kalp İkonu - Sağ Üst */}
                <div
                  className="absolute top-1 right-1 cursor-pointer transition-all duration-300"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    zIndex: 9999,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    border: '2px solid white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'white';
                  }}
                  onClick={handleLike}
                >
                  {isFavorite(artwork.art_name) ? '💖' : '🤍'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">{artwork.art_name}</h1>
              <p className="text-gray-300 text-lg font-medium mb-1">
                {artwork.artist}, {artwork.year}
              </p>
              <p className="text-gray-400 text-sm mb-1">{artwork.movement}</p>
              <p className="text-gray-500 text-xs">
                {artwork.museum || 'Müze bilgisi mevcut değil'}
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-900 rounded-xl p-6" style={{ margin: '0 16px' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Eserin Hikayesi</h3>
                <AudioPlayer artName={artwork.art_name} story={artwork.story} />
              </div>
              <p className="text-gray-300 leading-relaxed">{artwork.story}</p>
            </div>
          </div>
        </div>

        {/* Tablet Layout - Orta boyut */}
        <div className="hidden md:flex lg:hidden gap-4">
          {/* Left Column - Image */}
          <div className="w-28 flex-shrink-0">
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={(() => {
                    const title = artwork.art_name.toLowerCase();

                    // Manuel eklenen resimler için direkt kullan
                    if (
                      title.includes('cafe terrace') ||
                      title.includes('kafe terasta') ||
                      title.includes('kafe terasta gece')
                    ) {
                      return '/artworks/kafeTerastaGece.webp';
                    } else if (
                      title.includes('lady with an ermine') ||
                      title.includes('lady with ermine')
                    ) {
                      return '/artworks/ladywithandermine.jpg';
                    } else if (
                      title.includes('sarı ev') ||
                      title.includes('yellow house') ||
                      title.includes('the yellow house')
                    ) {
                      return '/artworks/sarıev.jpg';
                    } else {
                      // Diğer eserler için AI resmini kullan
                      return artwork.image_url || '/globe.svg';
                    }
                  })()}
                  alt={artwork.art_name}
                  className="w-28 h-28 object-cover"
                  style={{
                    maxWidth: '112px !important',
                    maxHeight: '112px !important',
                    minWidth: '100px !important',
                    minHeight: '100px !important',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/globe.svg';
                  }}
                />

                {/* Favori Kalp İkonu - Sağ Üst */}
                <div
                  className="absolute top-2 right-2 cursor-pointer transition-all duration-300"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 9999,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    border: '2px solid white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'white';
                  }}
                  onClick={handleLike}
                >
                  {isFavorite(artwork.art_name) ? '💖' : '🤍'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-serif font-bold text-white mb-2">{artwork.art_name}</h1>
              <p className="text-gray-300 text-base font-medium mb-1">
                {artwork.artist}, {artwork.year}
              </p>
              <p className="text-gray-400 text-sm mb-1">{artwork.movement}</p>
              <p className="text-gray-500 text-xs">
                {artwork.museum || 'Müze bilgisi mevcut değil'}
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-900 rounded-xl p-4" style={{ margin: '0 16px' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">Eserin Hikayesi</h3>
                <AudioPlayer
                  artName={artwork.art_name}
                  story={artwork.story}
                  className="scale-90"
                />
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">{artwork.story}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benzer Eserler */}
      {artwork.similar_artworks && artwork.similar_artworks.length > 0 && (
        <SimilarArtworks artworks={artwork.similar_artworks} currentArtwork={artwork.art_name} />
      )}
    </div>
  );
}
