import React, { useState } from 'react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  availableVoices: string[];
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  availableVoices,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const voiceLabels: Record<string, string> = {
    tr: 'Türkçe (Kadın)',
    'tr-male': 'Türkçe (Erkek)',
    en: 'İngilizce (Kadın)',
    'en-male': 'İngilizce (Erkek)',
    de: 'Almanca (Kadın)',
    fr: 'Fransızca (Kadın)',
    es: 'İspanyolca (Kadın)',
  };

  const handleVoiceSelect = (voice: string) => {
    onVoiceChange(voice);
    setIsOpen(false);
  };

  return (
    <div className="voice-selector-main relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-3 px-4 py-3 text-sm font-medium text-white rounded-xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#764ba2]/50 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          border: '1px solid rgba(118, 75, 162, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        }}
      >
        {/* Button Glow Effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110"
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            zIndex: -1,
          }}
        ></div>

        <span className="relative z-10">{voiceLabels[selectedVoice] || selectedVoice}</span>
        <svg
          className={`w-4 h-4 relative z-10 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="voice-selector-dropdown absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#667eea]/95 to-[#764ba2]/95 border border-[#764ba2]/40 rounded-lg shadow-2xl z-50 backdrop-blur-md">
          <div className="py-1">
            {availableVoices.map((voice) => (
              <button
                key={voice}
                onClick={() => handleVoiceSelect(voice)}
                className={`group relative block w-full text-left px-4 py-3 text-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedVoice === voice
                    ? 'bg-white/30 text-white font-semibold'
                    : 'text-white/90 hover:text-white'
                }`}
                style={{
                  background: selectedVoice === voice ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  borderRadius: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (selectedVoice !== voice) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVoice !== voice) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {voiceLabels[voice] || voice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CSS Isolation için unique styles */}
      <style jsx>{`
        .voice-selector-main {
          position: relative;
        }

        .voice-selector-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 1px solid rgba(118, 75, 162, 0.4);
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .voice-selector-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          border-color: rgba(118, 75, 162, 0.6);
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .voice-selector-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.5);
        }

        .voice-selector-dropdown {
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.95) 0%,
            rgba(118, 75, 162, 0.95) 100%
          );
          border: 1px solid rgba(118, 75, 162, 0.4);
          backdrop-filter: blur(12px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .voice-selector-option {
          transition: all 0.2s ease;
        }

        .voice-selector-option:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .voice-selector-option:first-child {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .voice-selector-option:last-child {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default VoiceSelector;
