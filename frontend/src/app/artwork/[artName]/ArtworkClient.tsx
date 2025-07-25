'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

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
}

export default function ArtworkClient({ artName }: { artName: string }) {
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState(124);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!artName) return;

    const fetchArtwork = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artName]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
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

  if (loading) {
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
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/95 backdrop-blur-md fixed top-0 left-0 right-0 z-[9999] border-b border-gray-800">
        <button
          onClick={() => router.back()}
          className="header-button flex items-center justify-center bg-white text-black rounded-full transition-all duration-200 hover:bg-gray-200 hover:scale-110 hover:shadow-lg"
          style={{
            width: '48px !important',
            height: '48px !important',
            minWidth: '48px !important',
            minHeight: '48px !important',
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ width: '24px !important', height: '24px !important' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAudio}
            className={`header-button flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg ${
              isPlaying
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            style={{
              width: '48px !important',
              height: '48px !important',
              minWidth: '48px !important',
              minHeight: '48px !important',
            }}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ width: '24px !important', height: '24px !important' }}
            >
              {isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
          <button
            onClick={handleLike}
            className={`header-button flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg ${
              isLiked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            style={{
              width: '48px !important',
              height: '48px !important',
              minWidth: '48px !important',
              minHeight: '48px !important',
            }}
          >
            <svg
              className="w-6 h-6"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ width: '24px !important', height: '24px !important' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={handleShare}
            className="header-button flex items-center justify-center bg-gray-700 text-white rounded-full transition-all duration-200 hover:bg-gray-600 hover:scale-110 hover:shadow-lg"
            style={{
              width: '48px !important',
              height: '48px !important',
              minWidth: '48px !important',
              minHeight: '48px !important',
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ width: '24px !important', height: '24px !important' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between p-6 bg-black/95 backdrop-blur-md fixed top-0 left-0 right-0 z-[9999] border-b border-gray-800">
        <button
          onClick={() => router.back()}
          className="desktop-button flex items-center gap-3 bg-white text-black rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Geri Dön
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayAudio}
            className={`desktop-button flex items-center gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isPlaying
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
            {isPlaying ? 'Duraklat' : 'Dinle'}
          </button>
          <button
            onClick={handleLike}
            className={`desktop-button flex items-center gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isLiked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button
            onClick={handleShare}
            className="desktop-button flex items-center gap-2 bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Paylaş
          </button>
        </div>
      </div>

      {/* Tablet Header */}
      <div className="hidden md:flex lg:hidden items-center justify-between p-4 bg-black/95 backdrop-blur-md fixed top-0 left-0 right-0 z-[9999] border-b border-gray-800">
        <button
          onClick={() => router.back()}
          className="desktop-button flex items-center gap-2 bg-white text-black rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Geri
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAudio}
            className={`header-button flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
              isPlaying
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            style={{
              width: '40px !important',
              height: '40px !important',
              minWidth: '40px !important',
              minHeight: '40px !important',
            }}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ width: '20px !important', height: '20px !important' }}
            >
              {isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
          <button
            onClick={handleLike}
            className={`header-button flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
              isLiked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            style={{
              width: '40px !important',
              height: '40px !important',
              minWidth: '40px !important',
              minHeight: '40px !important',
            }}
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ width: '20px !important', height: '20px !important' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={handleShare}
            className="header-button flex items-center justify-center bg-gray-700 text-white rounded-lg transition-all duration-200 hover:bg-gray-600 hover:scale-110 hover:shadow-lg"
            style={{
              width: '40px !important',
              height: '40px !important',
              minWidth: '40px !important',
              minHeight: '40px !important',
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ width: '20px !important', height: '20px !important' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 lg:p-8" style={{ paddingTop: '100px' }}>
        {/* Mobile Layout - Alt Alta */}
        <div className="md:hidden">
          {/* Artwork Image */}
          <div className="relative mb-4">
            <div className="relative overflow-hidden rounded-lg max-w-[300px] mx-auto">
              <img
                src={artwork.image_url || '/globe.svg'}
                alt={artwork.art_name}
                className="w-full h-32 object-cover"
                style={{
                  maxWidth: '300px !important',
                  maxHeight: '128px !important',
                  minWidth: '200px !important',
                  minHeight: '80px !important',
                }}
              />
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
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">Eserin Hikayesi</h3>
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
                  src={artwork.image_url || '/globe.svg'}
                  alt={artwork.art_name}
                  className="w-24 h-24 object-cover"
                  style={{
                    maxWidth: '96px !important',
                    maxHeight: '96px !important',
                    minWidth: '80px !important',
                    minHeight: '80px !important',
                  }}
                />
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
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Eserin Hikayesi</h3>
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
                  src={artwork.image_url || '/globe.svg'}
                  alt={artwork.art_name}
                  className="w-28 h-28 object-cover"
                  style={{
                    maxWidth: '112px !important',
                    maxHeight: '112px !important',
                    minWidth: '100px !important',
                    minHeight: '100px !important',
                  }}
                />
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
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3">Eserin Hikayesi</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{artwork.story}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
