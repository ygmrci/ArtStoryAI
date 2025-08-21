'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TestImagePage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 pt-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Resim Test Sayfası</h1>

          {/* Test Card 1 - Tailwind CSS ile */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tailwind CSS Card</h2>
            <div className="w-96 h-[600px] bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 rounded-3xl overflow-hidden group">
              <div className="flex-1 min-h-0 bg-slate-800">
                <img
                  src="/artworks/Adem.jpg"
                  alt="Test Image"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 h-52 bg-white">
                <h3 className="font-semibold text-gray-800 mb-2">Test Resim</h3>
                <p className="text-gray-600">Bu bir test resmidir</p>
              </div>
            </div>
          </div>

          {/* Test Card 2 - Inline Style ile */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Inline Style Card</h2>
            <div
              style={{
                width: '384px',
                height: '600px',
                background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.8))',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(71, 85, 105, 0.3)',
              }}
            >
              <div style={{ flex: 1, minHeight: 0, backgroundColor: '#1e293b' }}>
                <img
                  src="/artworks/Adem.jpg"
                  alt="Test Image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
              <div style={{ padding: '16px', height: '208px', backgroundColor: 'white' }}>
                <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                  Test Resim
                </h3>
                <p style={{ color: '#4b5563' }}>Bu bir test resmidir</p>
              </div>
            </div>
          </div>

          {/* Test Card 3 - Karışık Stil */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Karışık Stil Card</h2>
            <div
              className="w-96 h-[600px] rounded-3xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.8))',
                border: '1px solid rgba(71, 85, 105, 0.3)',
              }}
            >
              <div className="flex-1 min-h-0 bg-slate-800">
                <img
                  src="/artworks/Adem.jpg"
                  alt="Test Image"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 h-52 bg-white">
                <h3 className="font-semibold text-gray-800 mb-2">Test Resim</h3>
                <p className="text-gray-600">Bu bir test resmidir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TestImagePage;
