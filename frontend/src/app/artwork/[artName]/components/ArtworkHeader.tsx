'use client';

import React from 'react';
import { HeartIcon, ShareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface ArtworkHeaderProps {
  artwork: {
    art_name: string;
    artist: string;
  };
  likes: number;
  onLike: () => void;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ArtworkHeader({
  artwork,
  likes,
  onLike,
  onBack,
  isFavorite,
  onToggleFavorite,
}: ArtworkHeaderProps) {
  const { t } = useTranslation();

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

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleFavorite}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">
                {isFavorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
              </span>
            </button>
            <button
              onClick={onLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                likes > 124 ? 'text-red-500' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <HeartIcon className={`w-5 h-5 ${likes > 124 ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span>{t('common.share')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
