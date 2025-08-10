'use client';
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import PlayButton from './AudioPlayer/components/PlayButton';
import VoiceSelector from './AudioPlayer/components/VoiceSelector';
import AudioElement from './AudioPlayer/components/AudioElement';
import { useAudioState } from './AudioPlayer/hooks/useAudioState';
import { useVoiceManager } from './AudioPlayer/hooks/useVoiceManager';
import { useAudioGenerator } from './AudioPlayer/hooks/useAudioGenerator';
import { useAudioControls } from './AudioPlayer/hooks/useAudioControls';

type Props = {
  audioSrc?: string; // varsa çalar
  lang?: 'tr' | 'en';
  onLangChange?: (lng: 'tr' | 'en') => void;
  showVoiceSelector?: boolean;
  artName?: string;
  story?: string;
};

export default function ActionRow({
  audioSrc,
  lang = 'tr',
  onLangChange,
  showVoiceSelector = false,
  artName = 'Artwork',
  story = 'Story content',
}: Props) {
  const { isPlaying, setIsPlaying, isLoading, setIsLoading, audioUrl, setAudioUrl, audioRef } =
    useAudioState();

  const { selectedVoice, setSelectedVoice, availableVoices } = useVoiceManager();

  const { generateAudio, isGenerating } = useAudioGenerator(story);

  const { play, pause, stop, setAudioRef } = useAudioControls();

  const handlePlayPauseClick = () => {
    if (audioSrc) {
      // Eğer hazır audio varsa, onu çal
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } else {
      // Yoksa yeni audio generate et
      if (isPlaying) {
        pause();
        setIsPlaying(false);
      } else {
        generateAudio(selectedVoice);
        setIsPlaying(true);
      }
    }
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    // Eğer ses çalıyorsa durdur ve yeni ses üret
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    }
    if (audioUrl) {
      generateAudio(voice);
    }
  };

  const handleLanguageChange = (newLang: 'tr' | 'en') => {
    if (onLangChange) {
      onLangChange(newLang);
    }
  };

  // Audio element referansını ayarla
  React.useEffect(() => {
    setAudioRef(audioRef.current);
  }, [setAudioRef, audioRef]);

  return (
    <div className="mx-auto mt-3 max-w-3xl px-4 sm:px-6">
      {/* kart görünümü */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-3">
          {/* Audio element gizli */}
          <AudioElement
            onTimeUpdate={() => {}}
            onLoadedMetadata={() => {}}
            onEnded={() => setIsPlaying(false)}
            onError={() => {}}
          />

          <PlayButton
            isPlaying={isPlaying}
            isGenerating={isGenerating}
            onClick={handlePlayPauseClick}
          />

          {showVoiceSelector && (
            <div className="hidden sm:block">
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceChange={handleVoiceChange}
                availableVoices={availableVoices}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
