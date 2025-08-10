import { useState, useEffect } from 'react';

export const useVoiceManager = () => {
  const [selectedVoice, setSelectedVoice] = useState('tr');
  const [availableVoices] = useState(['tr', 'tr-male', 'en', 'en-male', 'de', 'fr', 'es']);

  // Local storage'dan seçili sesi yükle
  useEffect(() => {
    const savedVoice = localStorage.getItem('selectedVoice');
    if (savedVoice && availableVoices.includes(savedVoice)) {
      setSelectedVoice(savedVoice);
    }
  }, [availableVoices]);

  // Seçili sesi local storage'a kaydet
  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem('selectedVoice', voice);
  };

  return {
    selectedVoice,
    setSelectedVoice: handleVoiceChange,
    availableVoices,
  };
};
