export interface VoiceGenerationResult {
  audioUrl: string | null
  error: string | null
}

export type VoiceStatus = 'idle' | 'generating' | 'ready' | 'playing' | 'paused' | 'error'

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}