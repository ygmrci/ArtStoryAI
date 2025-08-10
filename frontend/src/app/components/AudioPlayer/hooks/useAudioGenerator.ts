import { useState, useCallback } from 'react';

export const useAudioGenerator = (text: string) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAudio = useCallback(
    async (voice: string = 'tr') => {
      if (!text.trim()) {
        setError('Ses üretimi için metin gerekli');
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text.trim(),
            voice,
            language: voice.startsWith('tr') ? 'tr' : 'en',
          }),
        });

        if (!response.ok) {
          throw new Error('Ses üretimi başarısız');
        }

        const data = await response.json();

        if (data.audio) {
          setAudioUrl(data.audio);
        } else {
          throw new Error('Ses verisi alınamadı');
        }
      } catch (err) {
        console.error('Ses üretimi hatası:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');

        // Hata durumunda fallback ses dosyası kullan
        setAudioUrl('/sample-audio.mp3');
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
