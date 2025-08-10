'use client';
import React from 'react';
import ActionRow from '../components/ActionRow';

export default function DemoPage() {
  const handleLangChange = (lang: 'tr' | 'en') => {
    console.log('Dil değişti:', lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">ActionRow Demo</h1>

        <div className="space-y-8">
          {/* Hazır audio ile */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Hazır Audio ile</h2>
            <ActionRow audioSrc="/sample-audio.mp3" showVoiceSelector={true} />
          </div>

          {/* Story ile audio generation */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              2. Story ile Audio Generation
            </h2>
            <ActionRow
              artName="Van Gogh - Ayçiçekleri"
              story="Vincent van Gogh'un ünlü Ayçiçekleri tablosu, 1888 yılında Arles'da yapılmıştır. Bu eser, sanatçının en tanınmış çalışmalarından biridir ve sarı tonların gücünü gösterir."
              showVoiceSelector={true}
            />
          </div>

          {/* Sadece dil değiştirici */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">3. Sadece Dil Değiştirici</h2>
            <ActionRow showVoiceSelector={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
