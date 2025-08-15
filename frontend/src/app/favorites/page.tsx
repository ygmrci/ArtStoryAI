'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { useFavorites } from '../contexts/FavoritesContext';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Favorilerim</h1>
            <p className="text-gray-400 text-lg mb-4">
              {favorites.length === 0
                ? 'Henüz favori eser eklemediniz'
                : `${favorites.length} favori eser bulunuyor`}
            </p>
            {favorites.length === 0 && (
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                Favori eser eklemek için sanat eseri sayfalarında kalp ikonuna tıklayın veya arama
                yaparak eser bulun.
              </p>
            )}
          </div>

          {/* Favori Eserler Grid - SimilarArtworks Stili */}
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
            <div className="flex flex-row flex-wrap justify-around items-stretch" style={{ margin: '8px 8px 0 8px' }}>
              {favorites.map((artwork) => (
                <div
                  key={artwork.id}
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
                    margin: '8px',
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
                  {/* Resim Alanı */}
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
                      src={artwork.image_url || '/globe.svg'}
                      alt={artwork.art_name}
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

                    {/* Favori Kaldır Butonu - Sağ Üst */}
                    <div
                      className="absolute top-2 right-2 cursor-pointer transition-all duration-300"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 9999,
                        backgroundColor: 'rgba(220, 38, 38, 0.9)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        border: '2px solid rgba(220, 38, 38, 0.8)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(185, 28, 28, 0.9)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.borderColor = 'rgba(185, 28, 28, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.8)';
                      }}
                      onClick={() => removeFavorite(artwork.id)}
                      title="Favorilerden kaldır"
                    >
                      ❌
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* İçerik Alanı */}
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
                        {artwork.art_name}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-gray-300 text-xs sm:text-sm truncate">{artwork.artist}</p>
                        <p className="text-xs sm:text-sm truncate" style={{ color: '#9ca3af' }}>
                          {artwork.year}
                        </p>
                      </div>
                    </div>

                    {/* Detay Görüntüleme Linki */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <Link
                        href={`/artwork/${encodeURIComponent(artwork.art_name)}`}
                        className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors duration-200 inline-flex items-center gap-1 group/link"
                      >
                        <span>Detayları Gör</span>
                        <svg
                          className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
