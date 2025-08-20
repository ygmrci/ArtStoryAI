import React from 'react';

interface ArtworkCardProps {
  id: string;
  title: string;
  artist: string;
  year: string;
  period: string;
  style: string;
  museum: string;
  imageUrl: string;
  description: string;
  source?: string;
}

export default function ArtworkCard({
  id,
  title,
  artist,
  year,
  period,
  style,
  museum,
  imageUrl,
  description,
  source = 'manual',
}: ArtworkCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Görsel Alanı */}
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Görsel yüklenemezse placeholder göster
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Placeholder - görsel yüklenemezse göster */}
        <div
          className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center p-4"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <div>
            <div className="text-lg font-semibold mb-2">{title}</div>
            <div className="text-sm">{artist}</div>
            <div className="text-xs opacity-80">{year}</div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-lg truncate">{title}</h3>

        <div className="space-y-2 mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Sanatçı:</span> {artist}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Yıl:</span> {year}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Dönem:</span> {period}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Stil:</span> {style}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Müze:</span> {museum}
          </p>
        </div>

        {/* Açıklama */}
        {description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>}

        {/* Kaynak etiketi */}
        <div className="flex justify-between items-center">
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              source === 'manual' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {source === 'manual' ? 'Manuel' : 'API'}
          </span>

          {/* Detay butonu */}
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            Detayları Gör →
          </button>
        </div>
      </div>
    </div>
  );
}
