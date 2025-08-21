import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isBackendAvailable: boolean;
  lastChecked: Date | null;
}

export const useNetworkStatus = () => {
  // Sunucu ve istemci arasında tutarlı başlangıç durumu
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true, // Varsayılan olarak true, client-side'da güncellenecek
    isBackendAvailable: false,
    lastChecked: null,
  });

  // Client-side'da navigator.onLine değerini ayarla
  useEffect(() => {
    setNetworkStatus((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
    }));
  }, []);

  // Backend bağlantısını kontrol et
  const checkBackendConnection = async () => {
    console.log('🔍 Backend bağlantısı kontrol ediliyor...');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout

      const response = await fetch('/api/health', {
        signal: controller.signal,
        method: 'HEAD', // Sadece header'ları al
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ Backend bağlantısı başarılı');
        setNetworkStatus((prev) => ({
          ...prev,
          isBackendAvailable: true,
          lastChecked: new Date(),
        }));
        return true;
      } else {
        console.log('❌ Backend bağlantısı başarısız, HTTP status:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Backend bağlantısı hatası:', error);
      setNetworkStatus((prev) => ({
        ...prev,
        isBackendAvailable: false,
        lastChecked: new Date(),
      }));
      return false;
    }
  };

  // Online/offline durumunu dinle
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setNetworkStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // İlk yüklemede backend bağlantısını kontrol et
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Periyodik olarak backend bağlantısını kontrol et (her 30 saniyede bir)
  useEffect(() => {
    const interval = setInterval(() => {
      checkBackendConnection();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Network status değiştiğinde log'la
  useEffect(() => {
    console.log('🌐 Network status güncellendi:', networkStatus);
  }, [networkStatus]);

  return {
    ...networkStatus,
    checkBackendConnection,
  };
};
