import { useState, useRef } from 'react';

export const useAudioState = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>('alloy');
  const [voices, setVoices] = useState<string[]>([
    'alloy',
    'echo',
    'fable',
    'onyx',
    'nova',
    'shimmer',
  ]);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  return {
    isPlaying,
    setIsPlaying,
    isLoading,
    setIsLoading,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    audioUrl,
    setAudioUrl,
    selectedVoice,
    setSelectedVoice,
    voices,
    setVoices,
    showVoiceSelector,
    setShowVoiceSelector,
    audioRef,
  };
};
