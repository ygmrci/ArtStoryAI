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
}

export default function SimilarArtworks({ artworks, currentArtwork }: SimilarArtworksProps) {
  const router = useRouter();

  const handleArtworkClick = (artworkTitle: string) => {
    router.push(`/artwork/${encodeURIComponent(artworkTitle)}`);
  };

  if (!artworks || artworks.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-6 backdrop-blur-md border border-white/10">
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
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Bu Eserle Benzer Sanat Eserleri
        </h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {artworks.map((artwork, index) => (
          <div
            key={index}
            onClick={() => handleArtworkClick(artwork.title)}
            className="group cursor-pointer bg-white/5 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-500 hover:scale-105 flex-shrink-0 border border-white/10 hover:border-white/30"
            style={{ width: '220px' }}
          >
            <div className="relative h-28 overflow-hidden">
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

            <div className="p-3">
              <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors truncate">
                {artwork.title}
              </h4>
              <div className="space-y-1">
                <p className="text-gray-300 text-xs truncate flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {artwork.artist}
                </p>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {artwork.year}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-400 truncate">{artwork.similarity_reason}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-300 text-sm">
            Bu eserler size önerilen benzer sanat eserleridir. Tıklayarak detaylarını
            görebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
