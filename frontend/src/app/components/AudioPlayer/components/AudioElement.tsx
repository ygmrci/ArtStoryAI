import React, { forwardRef } from 'react';

interface AudioElementProps {
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onEnded: () => void;
  onError: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => void;
}

const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  ({ onTimeUpdate, onLoadedMetadata, onEnded, onError }, ref) => {
    return (
      <audio
        ref={ref}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onError={onError}
        preload="metadata"
        className="hidden"
      />
    );
  },
);

AudioElement.displayName = 'AudioElement';

export default AudioElement;
