export interface AudioPlayerProps {
  artName: string;
  story: string;
  className?: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  audioUrl: string | null;
  selectedVoice: string;
  showVoiceSelector: boolean;
}
