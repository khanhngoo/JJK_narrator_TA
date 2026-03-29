'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { VoiceStatus, AudioPlayerState } from '@/types/voice'

interface UseAudioPlayerOptions {
  onEnded?: () => void
  onError?: (error: Error) => void
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
  })
  const [status, setStatus] = useState<VoiceStatus>('idle')

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }))
    }

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }))
    }

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
      setStatus('ready')
      options.onEnded?.()
    }

    const handleError = () => {
      setStatus('error')
      options.onError?.(new Error('Audio playback failed'))
    }

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }))
      setStatus('playing')
    }

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
      setStatus('paused')
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Load audio from URL
  const loadAudio = useCallback((url: string) => {
    if (!audioRef.current) return
    
    audioRef.current.src = url
    audioRef.current.load()
    setStatus('ready')
    setState(prev => ({ ...prev, currentTime: 0, duration: 0 }))
  }, [])

  // Play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return
    
    if (state.isPlaying) {
      audioRef.current.pause()
    } else {
      // Create user gesture context for autoplay policy
      audioRef.current.play().catch(error => {
        console.error('[AudioPlayer] Play failed:', error)
        setStatus('error')
        options.onError?.(error)
      })
    }
  }, [state.isPlaying, options])

  // Play
  const play = useCallback(() => {
    if (!audioRef.current) return
    
    audioRef.current.play().catch(error => {
      console.error('[AudioPlayer] Play failed:', error)
      setStatus('error')
      options.onError?.(error)
    })
  }, [options])

  // Pause
  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
  }, [])

  // Seek to position
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration))
  }, [state.duration])

  // Set volume (0-1)
  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return
    const clampedVolume = Math.max(0, Math.min(1, volume))
    audioRef.current.volume = clampedVolume
    setState(prev => ({ ...prev, volume: clampedVolume }))
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    const newMuted = !state.isMuted
    audioRef.current.muted = newMuted
    setState(prev => ({ ...prev, isMuted: newMuted }))
  }, [state.isMuted])

  // Replay from beginning
  const replay = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(error => {
      console.error('[AudioPlayer] Replay failed:', error)
      setStatus('error')
      options.onError?.(error)
    })
  }, [options])

  return {
    // State
    ...state,
    status,
    
    // Actions
    loadAudio,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    replay,
  }
}