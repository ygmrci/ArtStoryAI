'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

interface FavoriteArtwork {
  id: string;
  art_name: string;
  artist: string;
  year: number;
  image_url: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([]);

  useEffect(() => {
    // LocalStorage'dan favorileri yükle
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFavorite = (artworkId: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== artworkId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Favorilerim</h1>
            <p className="text-gray-400 text-lg">
              {favorites.length === 0
                ? 'Henüz favori eser eklemediniz'
                : `${favorites.length} favori eser bulunuyor`}
            </p>
          </div>

          {/* Favori Eserler Grid */}
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="none"
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
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Favori Eser Yok</h3>
              <p className="text-gray-400 mb-6">
                Sanat eserlerini keşfetmeye başlayın ve favorilerinize ekleyin
              </p>
              <Link
                href="/"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
                  color: '#1e293b',
                  boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.3)';
                }}
              >
                {/* Button Glow Effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
                    zIndex: -1,
                  }}
                ></div>

                <span className="relative z-10 font-bold">Keşfetmeye Başla</span>
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((artwork) => (
                <div key={artwork.id} className="group relative">
                  <Link href={`/artwork/${encodeURIComponent(artwork.art_name)}`}>
                    <div className="bg-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                      {/* Resim */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={artwork.image_url || '/globe.svg'}
                          alt={artwork.art_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Favori Kaldır Butonu */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFavorite(artwork.id);
                          }}
                          className="group relative absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: '#ffffff',
                            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.4)';
                          }}
                        >
                          {/* Button Glow Effect */}
                          <div
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              zIndex: -1,
                            }}
                          ></div>

                          <svg
                            className="w-5 h-5 relative z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Bilgiler */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-lg mb-1 truncate">
                          {artwork.art_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {artwork.artist}, {artwork.year}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
