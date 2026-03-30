'use client'

import React from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  audioUrl: string
  onEnded?: () => void
  onError?: (error: Error) => void
  onShare?: () => void
  className?: string
}

export function AudioPlayer({ audioUrl, onEnded, onError, onShare, className }: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    status,
    loadAudio,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    replay,
  } = useAudioPlayer({ onEnded, onError })

  // Load audio when URL changes
  React.useEffect(() => {
    if (audioUrl) {
      loadAudio(audioUrl)
    }
  }, [audioUrl, loadAudio])

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    seek(newTime)
  }

  const isLoading = status === 'idle' && !audioUrl

  return (
    <div className={cn('bg-card border border-border rounded-lg p-4', className)}>
      <div className="flex items-center gap-3">
        {/* Play/Pause/Replay button */}
        <Button
          onClick={isPlaying ? togglePlayPause : status === 'ready' && currentTime > 0 ? replay : togglePlayPause}
          disabled={isLoading || status === 'error'}
          className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label={isPlaying ? 'Pause narration' : status === 'ready' && currentTime > 0 ? 'Replay narration' : 'Play narration'}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : status === 'ready' && currentTime > 0 && !isPlaying ? (
            <RotateCcw className="h-5 w-5" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        {/* Progress bar */}
        <div 
          className="flex-1 h-[6px] bg-muted rounded cursor-pointer group"
          onClick={handleProgressClick}
          role="slider"
          aria-label={`Audio progress: ${formatTime(currentTime)} of ${formatTime(duration)}`}
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          <div 
            className="h-full bg-primary rounded transition-all group-hover:brightness-110"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>

        {/* Time display */}
        <div className="text-sm text-muted-foreground min-w-[80px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Volume control */}
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>

        {/* Volume slider (shown on hover) */}
        <div className="hidden md:block">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Volume"
          />
        </div>

        {/* Share button */}
        {onShare && (
          <Button
            onClick={onShare}
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
            aria-label="Share this narration"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}