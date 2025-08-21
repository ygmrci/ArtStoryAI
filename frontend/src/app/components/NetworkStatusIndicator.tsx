'use client';
import { useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkStatusIndicator = () => {
  const [mounted, setMounted] = useState(false);
  const { isOnline, isBackendAvailable, lastChecked } = useNetworkStatus();

  // Hydration mismatch'i önlemek için mounted state kullan
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sunucu tarafında hiçbir şey render etme
  if (!mounted) {
    return null;
  }

  if (isOnline && isBackendAvailable) {
    return null; // Her şey yolunda, gösterme
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
          !isOnline
            ? 'bg-red-500 text-white'
            : !isBackendAvailable
            ? 'bg-yellow-500 text-white'
            : 'bg-green-500 text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              !isOnline ? 'bg-red-200' : !isBackendAvailable ? 'bg-yellow-200' : 'bg-green-200'
            }`}
          />
          <span>
            {!isOnline
              ? 'Çevrimdışı'
              : !isBackendAvailable
              ? 'Backend Bağlantısı Yok'
              : 'Çevrimiçi'}
          </span>
        </div>
        {lastChecked && (
          <div className="text-xs opacity-75 mt-1">
            Son kontrol: {lastChecked.toLocaleTimeString('tr-TR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkStatusIndicator;
