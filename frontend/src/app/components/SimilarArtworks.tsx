'use client';

import React from 'react';
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

  const handleArtworkClick = (artworkTitle: string) => {
    router.push(`/artwork/${encodeURIComponent(artworkTitle)}`);
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
      }}
    >
      <div className="flex items-center gap-3 mb-6">
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

      {/* Flexbox Layout - Daha kontrollü dağılım */}
      <div className="flex flex-wrap justify-between gap-6">
        {artworks.map((artwork, index) => (
          <div
            key={index}
            onClick={() => handleArtworkClick(artwork.title)}
            className="group cursor-pointer bg-white/5 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-500 hover:scale-105"
            style={{
              width: 'calc(33.333% - 16px)',
              minWidth: '200px',
              maxWidth: '280px',
              flex: '1 1 auto',
              border: '1px solid transparent',
              borderColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            {/* Resim Alanı - Daha küçük yükseklik */}
            <div className="relative h-24 sm:h-28 overflow-hidden">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>

            {/* İçerik Alanı */}
            <div className="p-2 sm:p-3">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors truncate">
                {artwork.title}
              </h4>
              <div className="space-y-1">
                <p className="text-gray-300 text-xs sm:text-sm truncate">{artwork.artist}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{artwork.year}</p>
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
