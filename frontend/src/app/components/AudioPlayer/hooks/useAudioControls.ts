import { useCallback, useRef } from 'react';
import { useAudioState } from './useAudioState';

export const useAudioControls = () => {
  const { isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration } =
    useAudioState();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      // Eğer zaten çalıyorsa, önce durdur
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      // Ses dosyası yüklenene kadar bekle
      if (audioRef.current.readyState < 2) {
        await new Promise((resolve) => {
          if (audioRef.current) {
            audioRef.current.addEventListener('canplay', resolve, { once: true });
          }
        });
      }

      // Play işlemini dene
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Ses çalma hatası:', error);
      // Hata durumunda state'i güncelle
      setIsPlaying(false);
    }
  }, [isPlaying, setIsPlaying]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.warn('Ses durdurma hatası:', error);
    }
  }, [setIsPlaying]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.warn('Ses durdurma hatası:', error);
    }
  }, [setIsPlaying, setCurrentTime]);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;

      try {
        audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
        setCurrentTime(audioRef.current.currentTime);
      } catch (error) {
        console.warn('Ses arama hatası:', error);
      }
    },
    [duration, setCurrentTime],
  );

  const setAudioRef = useCallback((audio: HTMLAudioElement | null) => {
    audioRef.current = audio;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [setCurrentTime]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [setIsPlaying, setCurrentTime]);

  const handleError = useCallback(
    (error: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      console.error('Ses dosyası hatası:', error);
      setIsPlaying(false);
    },
    [setIsPlaying],
  );

  return {
    play,
    pause,
    stop,
    seek,
    setAudioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleError,
    isPlaying,
    currentTime,
    duration,
  };
};
