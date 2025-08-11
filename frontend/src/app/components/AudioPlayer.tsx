'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  artName: string;
  story: string;
  className?: string;
}

interface Voice {
  id: string;
  name: string;
  description: string;
}

export default function AudioPlayer({ artName, story, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ses türlerini yükle
  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('http://localhost:8000/audio/voices');
      const data = await response.json();
      setVoices(data.voices || []);
    } catch (error) {
      console.error('Ses türleri yüklenemedi:', error);
    }
  };

  const generateAudio = async () => {
    if (!story || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/audio/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          art_name: artName,
          story: story,
          voice: selectedVoice,
        }),
      });

      const data = await response.json();

      if (data.success && data.audio_data) {
        // Base64 audio data'yı blob'a çevir
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio_data), (c) => c.charCodeAt(0))],
          { type: 'audio/mp3' },
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Audio element'ini oluştur ve oynat
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        console.error('Sesli anlatım oluşturulamadı:', data.error);
      }
    } catch (error) {
      console.error('Sesli anlatım hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioUrl) {
      generateAudio();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setShowVoiceSelector(false);
    // Yeni ses türü seçildiğinde mevcut audio'yu temizle
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setIsPlaying(false);
    }
  };

  // Component unmount olduğunda URL'i temizle
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className={`flex items-center gap-4 -ml-5 ${className}`} >
      {/* Ses Türü Seçici */}
      <div className="relative">
        <button
          onClick={() => setShowVoiceSelector(!showVoiceSelector)}
          className="flex items-center gap-3 px-6 py-4 bg-white text-black rounded-2xl hover:bg-gray-100 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl"
          style={{
            backgroundColor: 'white !important',
            color: 'black !important',
            padding: '24px !important',
            borderRadius: '16px !important',
            fontSize: '16px !important',
            fontWeight: '500 !important',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1) !important',
            minWidth: 'auto !important',
            minHeight: 'auto !important',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <span>{voices.find((v) => v.id === selectedVoice)?.name || 'Nova'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Ses Türü Dropdown */}
        {showVoiceSelector && (
          <div className="absolute bottom-full left-0 mb-3 bg-gray-800 rounded-lg shadow-lg border border-white/10 z-[9999] min-w-[200px]">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => handleVoiceChange(voice.id)}
                className={`w-full text-left px-3 py-2 hover:bg-white/10 transition-colors ${
                  selectedVoice === voice.id ? 'bg-white/20 text-white' : 'text-gray-300'
                }`}
              >
                <div className="font-medium">{voice.name}</div>
                <div className="text-xs text-gray-400">{voice.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Oynat/Duraklat Butonu */}
      <button
        onClick={handlePlayPause}
        disabled={isLoading}
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isPlaying
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-white hover:bg-gray-100 text-black'
        }`}
        style={{
          padding: '24px !important',
          borderRadius: '16px !important',
          fontSize: '16px !important',
          fontWeight: '500 !important',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1) !important',
          minWidth: 'auto !important',
          minHeight: 'auto !important',
          backgroundColor: isLoading
            ? '#d1d5db !important'
            : isPlaying
            ? '#ef4444 !important'
            : 'white !important',
          color: isLoading
            ? '#6b7280 !important'
            : isPlaying
            ? 'white !important'
            : 'black !important',
        }}
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Oluşturuluyor...</span>
          </>
        ) : isPlaying ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" />
            </svg>
            <span>Duraklat</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Dinle</span>
          </>
        )}
      </button>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="hidden"
      />
    </div>
  );
}
