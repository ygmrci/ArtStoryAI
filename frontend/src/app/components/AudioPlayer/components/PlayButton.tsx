import React from 'react';

interface PlayButtonProps {
  isPlaying: boolean;
  isGenerating: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  isGenerating,
  onClick,
  disabled = false,
}) => {
  if (isGenerating) {
    return (
      <button
        disabled
        className="p-4 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd8] hover:to-[#6a4190] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-4 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd8] hover:to-[#6a4190] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      title={isPlaying ? 'Durdur' : 'Çal'}
    >
      {isPlaying ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

export default PlayButton;
