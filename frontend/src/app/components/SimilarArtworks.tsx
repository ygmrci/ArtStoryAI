'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SimilarArtwork {
  title: string;
  artist: string;
  year: string;
  image_url: string;
  similarity_reason: string;
}

interface SimilarArtworksProps {
  artworks: SimilarArtwork[];
  currentArtwork: string;
  currentArtist?: string; // Mevcut sanatçı bilgisi için
}

export default function SimilarArtworks({
  artworks,
  currentArtwork,
  currentArtist,
}: SimilarArtworksProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleArtworkClick = (artworkTitle: string) => {
    router.push(`/artwork/${encodeURIComponent(artworkTitle)}`);
  };

  const handleFavoriteClick = (artworkTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Kart tıklamasını engelle

    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(artworkTitle)) {
        newFavorites.delete(artworkTitle);
      } else {
        newFavorites.add(artworkTitle);
      }
      return newFavorites;
    });
  };

  const isFavorite = (artworkTitle: string) => {
    return favorites.has(artworkTitle);
  };

  if (!artworks || artworks.length === 0) {
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
        {artworks.map((artwork, index) => {
          console.log(`Kart ${index + 1}:`, {
            title: artwork.title,
            artist: artwork.artist,
            year: artwork.year,
            similarity_reason: artwork.similarity_reason,
          });

          return (
            <div
              key={index}
              onClick={() => handleArtworkClick(artwork.title)}
              className="group cursor-pointer rounded-3xl transition-all duration-500 flex flex-col"
              style={{
                width: '300px',
                minHeight: '550px',
                flex: '0 0 300px',
                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))',
                border: '2px solid blue',
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
                    } else {
                      // Diğer eserler için AI resmini kullan
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
                  onClick={(e) => handleFavoriteClick(artwork.title, e)}
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
                  border: '1px solid transparent',
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
          );
        })}
      </div>
    </div>
  );
}
