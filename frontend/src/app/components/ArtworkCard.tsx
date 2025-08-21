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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Görsel Alanı - Responsive height */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-200">
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
          className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center p-2 sm:p-3 md:p-4"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <div>
            <div className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">
              {title}
            </div>
            <div className="text-xs sm:text-sm">{artist}</div>
            <div className="text-xs opacity-80">{year}</div>
          </div>
        </div>
      </div>

      {/* İçerik - Responsive padding ve typography */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base md:text-lg lg:text-xl truncate leading-tight">
          {title}
        </h3>

        {/* Bilgi grid'i - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mb-3">
          <p className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Sanatçı:</span>
            <span className="ml-1 truncate block">{artist}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Yıl:</span> {year}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Dönem:</span>
            <span className="ml-1 truncate block">{period}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Stil:</span>
            <span className="ml-1 truncate block">{style}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-600 sm:col-span-2">
            <span className="font-medium">Müze:</span>
            <span className="ml-1 truncate block">{museum}</span>
          </p>
        </div>

        {/* Açıklama - Responsive typography */}
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Alt kısım - Responsive layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              source === 'manual' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {source === 'manual' ? 'Manuel' : 'API'}
          </span>

          {/* Detay butonu - Responsive typography */}
          <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors hover:underline">
            Detayları Gör →
          </button>
        </div>
      </div>
    </div>
  );
}
