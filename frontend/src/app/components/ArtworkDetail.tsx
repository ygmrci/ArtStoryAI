'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../contexts/FavoritesContext';

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
  location?: string;
}

interface ArtworkDetailProps {
  artwork: ArtworkData;
}

export default function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [likes, setLikes] = useState(124);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleLike = () => {
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
        title: artwork.art_name,
        text: `${artwork.art_name} - ${artwork.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getLocationText = () => {
    if (artwork.location) return artwork.location;
    if (artwork.museum) return artwork.museum;
    return 'Konum bilgisi mevcut değil';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-end px-4 py-3 lg:px-8 lg:py-4">
          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="group relative p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(59, 130, 246, 0.3)';
              }}
              aria-label="Paylaş"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className="group relative p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              style={{
                background: isFavorite(artwork.art_name)
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                color: isFavorite(artwork.art_name) ? '#ffffff' : '#475569',
                boxShadow: isFavorite(artwork.art_name)
                  ? '0 2px 10px rgba(239, 68, 68, 0.4)'
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: isFavorite(artwork.art_name)
                  ? '1px solid rgba(239, 68, 68, 0.3)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                if (isFavorite(artwork.art_name)) {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.5)';
                } else {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                if (isFavorite(artwork.art_name)) {
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(239, 68, 68, 0.4)';
                } else {
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                }
              }}
              aria-label="Beğen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {isFavorite(artwork.art_name) && (
                <svg
                  className="w-5 h-5 absolute inset-0 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>

            {/* Like Count */}
            <div
              className="bg-white rounded-xl px-3 py-2 border transition-all duration-300 transform hover:scale-105"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <span className="text-sm font-medium text-gray-700">{likes}</span>
              <svg
                className="w-4 h-4 inline ml-1 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            {/* View Count */}
            <button
              className="group relative p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(16, 185, 129, 0.3)';
              }}
              aria-label="Görüntülenme"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {/* Artwork Image */}
        <div className="relative w-full">
          <Image
            src={artwork.image_url || '/globe.svg'}
            alt={artwork.art_name}
            width={1200}
            height={800}
            className="w-full h-auto max-h-[70vh] object-cover"
          />
        </div>

        {/* Title and Location */}
        <div className="px-4 py-6 lg:py-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2">
            {artwork.art_name}
          </h1>
          <p className="text-gray-600 text-lg lg:text-xl">{getLocationText()}</p>
        </div>

        {/* Interactive Controls */}
        <div className="px-4 py-4 lg:py-6 flex items-center justify-between max-w-4xl mx-auto">
          {/* Audio Player */}
          <div className="flex items-center gap-2">
            <AudioPlayer artName={artwork.art_name} story={artwork.story} />
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange('tr')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                i18n.language === 'tr'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                i18n.language === 'en'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 py-6 lg:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
              <p className="text-gray-800 leading-relaxed text-lg lg:text-xl">
                &ldquo;{artwork.art_name}&rdquo;, {artwork.artist} tarafından {artwork.year} yılında
                yaratılan ünlü bir tablodur. Bu eser, onun en ikonik çalışmalarından biri olarak
                kabul edilir ve {artwork.movement} hareketinin bir başyapıtıdır.
              </p>

              <p className="text-gray-800 leading-relaxed text-lg lg:text-xl mt-4">
                {artwork.story}
              </p>

              {artwork.artist_bio && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                    Sanatçı Hakkında
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                    {artwork.artist_bio}
                  </p>
                </div>
              )}

              {artwork.movement_desc && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Sanat Akımı</h3>
                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                    {artwork.movement_desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
