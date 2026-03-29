'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useCallback, useMemo, useRef } from 'react'
import type { Message, ChatStatus } from '@/types/chat'

export interface UseJJKChatOptions {
  onFinish?: (message: Message) => void
  onError?: (error: Error) => void
  onVoiceError?: (error: string) => void
}

const MAX_VOICE_RETRIES = 1 // Per D-04: auto-retry once

export function useJJKChat(options: UseJJKChatOptions = {}) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const voiceRetryCount = useRef(0)
  const lastMessageContent = useRef<string | null>(null)
  
  // Generate voice after text completes
  const generateVoice = useCallback(async (text: string, isRetry: boolean = false) => {
    if (!text) return
    
    // Check cache first (per D-03)
    // Note: getCachedAudio will be implemented in Plan 03
    // For now, we proceed directly to API call
    
    setIsGeneratingVoice(true)
    setVoiceError(null)
    
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          regenerate: isRetry 
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate voice')
      }
      
      const data = await response.json()
      
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl)
        voiceRetryCount.current = 0 // Reset retry count on success
      } else {
        throw new Error('No audio URL returned')
      }
    } catch (error) {
      console.error('[Voice] Generation error:', error)
      
      // Per D-04: Auto-retry once, then fallback to text-only
      if (voiceRetryCount.current < MAX_VOICE_RETRIES && !isRetry) {
        console.log('[Voice] Retrying once...')
        voiceRetryCount.current++
        await generateVoice(text, true)
        return
      }
      
      // After retry (or if was already retry), show text-only fallback
      setVoiceError(error instanceof Error ? error.message : 'Voice generation failed')
      options.onVoiceError?.(error instanceof Error ? error.message : 'Voice generation failed')
    } finally {
      setIsGeneratingVoice(false)
    }
  }, [options])

  const handleRetryVoice = useCallback(() => {
    if (lastMessageContent.current) {
      voiceRetryCount.current = 0
      generateVoice(lastMessageContent.current, true)
    }
  }, [generateVoice])

  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onFinish: async ({ content, role }) => {
      // Store for potential retry
      lastMessageContent.current = content
      
      // Per D-02: Sequential flow - generate voice after text completes
      // Voice generation will be fully integrated in Plan 03
      if (role === 'assistant' && content) {
        // Note: Voice generation disabled until Plan 03
        // await generateVoice(content)
      }
      
      if (options.onFinish) {
        options.onFinish({
          id: crypto.randomUUID(),
          role: role as 'user' | 'assistant',
          content,
          createdAt: new Date()
        })
      }
    },
    onError: (error) => {
      console.error('[Chat] Error:', error)
      if (options.onError) {
        options.onError(error)
      }
    },
  })

  const status: ChatStatus = useMemo(() => {
    if (error) return 'error'
    if (isGeneratingVoice) return 'generating_voice'
    if (isLoading) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === 'assistant' && lastMessage.content) {
        return 'streaming'
      }
      return 'submitting'
    }
    return 'idle'
  }, [isLoading, isGeneratingVoice, error, messages])

  const clearAudio = useCallback(() => {
    setAudioUrl(null)
    setVoiceError(null)
    voiceRetryCount.current = 0
  }, [])

  const clearError = useCallback(() => {
    setVoiceError(null)
  }, [])

  return {
    // From useChat
    messages,
    input,
    setInput,
    handleSubmit,
    
    // Additional state
    status,
    isLoading,
    isGeneratingVoice,
    audioUrl,
    voiceError,
    
    // Actions
    clearAudio,
    clearError,
    retryVoice: handleRetryVoice,
  }
}