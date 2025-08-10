'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioControls } from './hooks/useAudioControls';
import { useAudioGenerator } from './hooks/useAudioGenerator';
import { useVoiceManager } from './hooks/useVoiceManager';
import PlayButton from './components/PlayButton';
import VoiceSelector from './components/VoiceSelector';
import AudioElement from './components/AudioElement';

interface AudioPlayerProps {
  text: string;
  artworkTitle?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, artworkTitle, className = '' }) => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
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
  } = useAudioControls();

  const { audioUrl, isGenerating, generateAudio, error: generationError } = useAudioGenerator(text);

  const { selectedVoice, setSelectedVoice, availableVoices } = useVoiceManager();

  // Audio element referansını ayarla
  useEffect(() => {
    setAudioRef(audioRef.current);
  }, [setAudioRef]);

  // Ses URL'i değiştiğinde audio element'i güncelle
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handlePlayPause = async () => {
    if (!audioUrl) {
      // Ses yoksa önce üret
      await generateAudio(selectedVoice);
      return;
    }

    // Ses varsa çal/durdur
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const handleVoiceChange = async (voice: string) => {
    setSelectedVoice(voice);

    // Eğer ses çalıyorsa durdur ve yeni ses üret
    if (isPlaying) {
      stop();
    }

    if (audioUrl) {
      await generateAudio(voice);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-50">
        <VoiceSelector
          selectedVoice={selectedVoice}
          onVoiceChange={handleVoiceChange}
          availableVoices={availableVoices}
        />
      </div>

      <div
        className={`audio-player-main bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-2xl shadow-2xl p-6 border border-[#764ba2]/20 backdrop-blur-md ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {artworkTitle ? `${artworkTitle} - ${t('audioPlayer.title')}` : t('audioPlayer.title')}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Ses Kontrolleri */}
          <div className="flex items-center justify-center space-x-4">
            <PlayButton
              isPlaying={isPlaying}
              isGenerating={isGenerating}
              onClick={handlePlayPause}
              disabled={!text}
            />

            {audioUrl && (
              <button
                onClick={stop}
                className="group relative p-3 rounded-full transition-all duration-500 transform hover:-translate-y-1 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #ec9f05, #f59e0b)',
                  color: '#ffffff',
                  boxShadow: '0 4px 20px rgba(236, 159, 5, 0.4)',
                  border: '1px solid rgba(236, 159, 5, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(236, 159, 5, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 159, 5, 0.4)';
                }}
                title={t('audioPlayer.stop')}
              >
                {/* Button Glow Effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #ec9f05, #f59e0b)',
                    zIndex: -1,
                  }}
                ></div>

                <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="6" y="6" width="8" height="8" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {audioUrl && duration > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#667eea] to-[#764ba2] h-2 rounded-full transition-all duration-150"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {generationError && (
            <div className="text-red-400 text-sm text-center p-2 bg-red-500/20 rounded-lg border border-red-500/30">
              {t('audioPlayer.generationError')}
            </div>
          )}

          {/* Audio Element (gizli) */}
          <AudioElement
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={handleError}
          />
        </div>

        {/* CSS Isolation için unique styles */}
        <style jsx>{`
          .audio-player-main {
            background: linear-gradient(
              135deg,
              rgba(102, 126, 234, 0.1) 0%,
              rgba(118, 75, 162, 0.1) 100%
            );
            border: 1px solid rgba(118, 75, 162, 0.2);
            backdrop-filter: blur(12px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .audio-player-main:hover {
            border-color: rgba(118, 75, 162, 0.4);
            box-shadow: 0 25px 50px -12px rgba(118, 75, 162, 0.15);
          }
        `}</style>
      </div>
    </div>
  );
};

// Zaman formatı yardımcı fonksiyonu
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default AudioPlayer;
