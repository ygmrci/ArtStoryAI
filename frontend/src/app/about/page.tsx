'use client';
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 pt-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-6xl" role="img" aria-label="Palet">
                🎨
              </span>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ArtStoryAI
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sanat eserlerini AI yardımıyla herkes için anlaşılır, sade ve etkileyici hale getiren
              yenilikçi web uygulaması
            </p>
          </div>

          {/* Ana Bölümler */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Sol Kolon */}
            <div className="space-y-8">
              {/* Proje Amacı */}
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎯</span>
                  <h2 className="text-2xl font-bold text-gray-800">Proje Amacı</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Sanatseverler, sanat eserlerinin anlamını, dönemini veya sanatçısını merak
                  ettiklerinde akademik içeriklerle karşılaşıyor ve bu içerikleri anlamakta
                  zorlanıyorlar. ArtStoryAI, kullanıcı dostu, sade ve etkileyici bir anlatım biçimi
                  sunarak bu sorunu çözmeyi hedefliyor.
                </p>
              </div>

              {/* Hedef Kitle */}
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👥</span>
                  <h2 className="text-2xl font-bold text-gray-800">Hedef Kitle</h2>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Sanatsever genel kullanıcılar</li>
                  <li>• Öğrenciler ve sanat tarihi öğrencileri</li>
                  <li>• Sosyal medya içerik üreticileri</li>
                  <li>• Müze ziyaretçileri</li>
                  <li>• Sanatçılar ve küratörler</li>
                </ul>
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-8">
              {/* Özellikler */}
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">✨</span>
                  <h2 className="text-2xl font-bold text-gray-800">Özellikler</h2>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    AI destekli sanat eseri açıklamaları
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Sanatçı biyografileri ve dönem bilgileri
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Sesli anlatım (Text-to-Speech)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Benzer eser önerileri
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Türkçe/İngilizce dil desteği
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Favori eserler koleksiyonu
                  </li>
                </ul>
              </div>

              {/* Teknoloji */}
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🚀</span>
                  <h2 className="text-2xl font-bold text-gray-800">Teknoloji</h2>
                </div>
                <div className="space-y-3 text-gray-600">
                  <div>
                    <span className="font-semibold">Frontend:</span> Next.js, React, TailwindCSS
                  </div>
                  <div>
                    <span className="font-semibold">Backend:</span> FastAPI, Python, OpenAI
                  </div>
                  <div>
                    <span className="font-semibold">Veritabanı:</span> PostgreSQL, Redis
                  </div>
                  <div>
                    <span className="font-semibold">AI:</span> GPT-4 Turbo, Vision API
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nasıl Kullanılır */}
          <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📖</span>
              <h2 className="text-2xl font-bold text-gray-800">Nasıl Kullanılır?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Arama Yapın</h3>
                <p className="text-sm text-gray-600">
                  Ana sayfada sanat eseri adını yazın veya görsel yükleyin
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">2. AI Analizi</h3>
                <p className="text-sm text-gray-600">
                  AI eseri analiz eder ve detaylı bilgiler üretir
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Dinleyin & Keşfedin</h3>
                <p className="text-sm text-gray-600">
                  Sesli anlatımı dinleyin ve benzer eserleri keşfedin
                </p>
              </div>
            </div>
          </div>

          {/* CTA Butonları */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>🎨</span>
                Sanat Eseri Ara
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>🔍</span>
                Keşfet
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              <p>
                GitHub:
                <a
                  href="https://github.com/ygmrci/ArtStoryAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  ygmrci/ArtStoryAI
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
