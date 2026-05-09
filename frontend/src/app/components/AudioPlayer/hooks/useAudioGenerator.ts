import { useState, useCallback } from 'react';
import { API_CONFIG } from '../../../../lib/config';

export const useAudioGenerator = (text: string) => {
  console.log('🔍 useAudioGenerator hook called with text:', text);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAudio = useCallback(
    async (voice: string = 'tr') => {
      console.log('🎯 generateAudio called with:', { text, voice, textLength: text?.length });

      if (!text || !text.trim()) {
        const errorMsg = 'Ses üretimi için metin gerekli';
        console.error('❌ Text validation failed:', errorMsg);
        setError(errorMsg);
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        console.log('🎵 Ses üretimi başlatılıyor...', { text: text.trim(), voice });

        const response = await fetch(`${API_CONFIG.BASE_URL}/audio/story`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            art_name: 'Sanat Eseri',
            story: text.trim(),
            voice: voice,
          }),
        });

        console.log('📡 API Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ API Error:', errorData);
          throw new Error(`API hatası: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log('📊 API Response data:', data);

        // API'den gelen hata kontrolü
        if (data.error) {
          throw new Error(data.error);
        }

        if (data.audio_url) {
          console.log('✅ Ses URL alındı:', data.audio_url);
          setAudioUrl(data.audio_url);

          // Fallback mesajı varsa göster
          if (data.status) {
            console.log('ℹ️ API Status:', data.status);
          }
        } else {
          throw new Error('Ses verisi alınamadı');
        }
      } catch (err) {
        console.error('❌ Ses üretimi hatası:', err);
        const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
        setError(errorMessage);

        // Hata durumunda fallback ses dosyası kullan
        console.log('🔄 Fallback ses dosyası kullanılıyor...');
        setAudioUrl('/artworks/Adem.jpg'); // Geçici olarak resim dosyası
      } finally {
        setIsGenerating(false);
      }
    },
    [text],
  );

  const clearAudio = useCallback(() => {
    setAudioUrl(null);
    setError(null);
  }, []);

  return {
    audioUrl,
    isGenerating,
    error,
    generateAudio,
    clearAudio,
  };
};
