'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '../contexts/FavoritesContext';
import { useRecommendations } from '../hooks/useRecommendations';

interface SimilarArtwork {
  title: string;
  artist: string;
  year: string;
  image_url: string;
  similarity_reason: string;
}

interface SimilarArtworksProps {
  currentArtwork: string;
  currentArtist?: string; // Mevcut sanatçı bilgisi için
}

export default function SimilarArtworks({ currentArtwork, currentArtist }: SimilarArtworksProps) {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // API'den benzer eserleri al
  const { recommendations, loading, error } = useRecommendations(currentArtwork);

  // Debug log'ları
  console.log('🔍 SimilarArtworks Component Debug:');
  console.log('  - currentArtwork:', currentArtwork);
  console.log('  - recommendations:', recommendations);
  console.log('  - loading:', loading);
  console.log('  - error:', error);

  const handleArtworkClick = (artworkTitle: string) => {
    router.push(`/artwork/${encodeURIComponent(artworkTitle)}`);
  };

  const handleFavoriteClick = (artwork: SimilarArtwork, e: React.MouseEvent) => {
    e.stopPropagation(); // Kart tıklamasını engelle

    const favoriteArtwork = {
      id: artwork.title, // title'ı ID olarak kullan
      art_name: artwork.title,
      artist: artwork.artist,
      year: parseInt(artwork.year) || 0,
      image_url: artwork.image_url,
    };

    toggleFavorite(favoriteArtwork);
  };

  // Loading state
  if (loading) {
    return (
      <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">Benzer eserler yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.warn('Recommendation error:', error);
  }

  // Her zaman 3 eser göster
  const displayArtworks = recommendations && recommendations.length > 0 ? recommendations : [];

  // Eğer 3'ten az eser varsa, placeholder eserler ekle
  const placeholderArtworks = [
    {
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: '1503-1519',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/300px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
      similarity_reason: 'Klasik sanat eseri',
    },
    {
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      year: '1889',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      similarity_reason: 'Post-empresyonist eser',
    },
    {
      title: 'The Scream',
      artist: 'Edvard Munch',
      year: '1893',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/300px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg',
      similarity_reason: 'Modern sanat eseri',
    },
  ];

  // Toplam 3 eser olacak şekilde düzenle
  const finalArtworks = [];
  for (let i = 0; i < 3; i++) {
    if (i < displayArtworks.length) {
      finalArtworks.push(displayArtworks[i]);
    } else {
      finalArtworks.push(placeholderArtworks[0]);
    }
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div
      className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md"
      style={{
        border: 'none !important',
        borderWidth: '0px !important',
        borderStyle: 'none !important',
        outline: 'none !important',
        borderColor: 'transparent !important',
        boxShadow: 'none !important',
        margin: '0 16px',
        marginLeft: '20px',
        marginRight: '20px',
      }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'block',
            textShadow: 'none',
            background: 'none',
            WebkitBackgroundClip: 'unset',
            WebkitTextFillColor: '#ffffff',
            backgroundClip: 'unset',
            backgroundImage: 'none',
            filter: 'none',
            lineHeight: '1.2',
            margin: '0',
            padding: '0',
          }}
        >
          {currentArtist ? `${currentArtist}'ın Diğer Eserleri` : 'Benzer Sanat Eserleri'}
        </span>
      </div>

      {/* Flexbox Layout - Space-around ile eşit dağılım */}
      <div
        className="flex flex-row flex-wrap justify-around items-stretch"
        style={{ margin: '8px 8px 0 8px' }}
      >
        {finalArtworks.map((artwork, index) => (
          <div
            key={index}
            onClick={() => handleArtworkClick(artwork.title)}
            className="group cursor-pointer rounded-3xl transition-all duration-500 flex flex-col"
            style={{
              width: '300px',
              minHeight: '550px',
              flex: '0 0 300px',
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))',
              borderRadius: '24px',
              backdropFilter: 'blur(10px)',
              transform: 'translateY(0) scale(1)',
              transition: 'all 0.5s ease',
              overflow: 'visible',
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
            {/* Resim Alanı - Sabit yükseklik */}
            <div
              className="relative overflow-hidden flex-shrink-0"
              style={{
                height: '260px',
                minHeight: '260px',
                maxHeight: '260px',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
              }}
            >
              <img
                src={(() => {
                  const title = artwork.title.toLowerCase();

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
                    // Diğer eserler için AI resmini kullan
                    // Eğer backend'den manuel resim URL'si geliyorsa, tam URL yap
                    if (artwork.image_url && artwork.image_url.startsWith('/manual-images/')) {
                      return `http://127.0.0.1:8000${artwork.image_url}`;
                    }
                    return artwork.image_url;
                  }
                })()}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                style={{
                  objectPosition: 'center center',
                  objectFit: 'cover',
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
                onClick={(e) => handleFavoriteClick(artwork, e)}
              >
                {isFavorite(artwork.title) ? '💖' : '🤍'}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* İçerik Alanı - Kalan alanı doldur */}
            <div
              className="p-3 sm:p-4 relative flex-1 flex flex-col justify-between"
              style={{
                zIndex: 10,
                minHeight: '140px',
                maxHeight: '180px',
              }}
            >
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors truncate">
                  {artwork.title}
                </h4>
                <div className="space-y-1">
                  <p className="text-gray-300 text-xs sm:text-sm truncate">{artwork.artist}</p>
                  <p className="text-xs sm:text-sm truncate" style={{ color: '#9ca3af' }}>
                    {artwork.year}
                  </p>
                </div>
              </div>

              {/* Benzerlik Sebebi */}
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400 truncate">{artwork.similarity_reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
