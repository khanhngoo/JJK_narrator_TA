'use client'

import { useState } from 'react'
import { useJJKChat } from '@/hooks/useJJKChat'
import { InputForm } from './InputForm'
import { MessageList } from './MessageList'
import { LoadingIndicator } from './LoadingIndicator'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { VoiceStatus } from '@/components/audio/VoiceStatus'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import type { Message } from '@/types/chat'

export function ChatContainer() {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const { 
    messages, 
    input, 
    setInput, 
    handleSubmit, 
    isLoading, 
    status,
    audioUrl,
    isGeneratingVoice,
    voiceError,
    clearError,
    retryVoice,
  } = useJJKChat({
    onError: (error) => {
      console.error('[ChatContainer] Chat error:', error)
    },
    onVoiceError: (error) => {
      console.error('[ChatContainer] Voice error:', error)
    },
  })

  const handleShare = async () => {
    if (!audioUrl || !lastAssistantMessage) return
    
    setIsSharing(true)
    try {
      // Fetch the blob from blob URL
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      
      // Convert to base64
      const reader = new FileReader()
      const audioData = await new Promise((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
        reader.readAsDataURL(blob)
      })
      
      // Get question (last user message)
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      const question = lastUserMessage?.content || ''
      
      // POST to share API
      const shareResponse = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData,
          question,
          text: lastAssistantMessage.content
        })
      })
      
      const result = await shareResponse.json()
      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl)
        // Copy to clipboard
        await navigator.clipboard.writeText(result.shareUrl)
      }
    } catch (error) {
      console.error('[Share] Error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  // Determine what to show in the main area
  const showEmpty = !isGeneratingVoice && messages.length === 0
  const showLoading = status === 'submitting'
  const showVoiceLoading = status === 'generating_voice'
  const showVoiceError = voiceError !== null
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <h1 className="text-2xl font-semibold text-foreground text-center">
          JJK Narrator Teacher
        </h1>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Empty state */}
          {showEmpty && (
            <MessageList messages={[]} />
          )}
          
          {/* Messages */}
          {!showEmpty && !showLoading && messages.length > 0 && (
            <>
              <MessageList 
                messages={messages as Message[]}
                isStreaming={status === 'streaming'}
              />
              
              {/* Voice loading indicator */}
              {showVoiceLoading && (
                <VoiceStatus state="generating" className="mt-4" />
              )}
              
              {/* Voice error with retry */}
              {showVoiceError && (
                <VoiceStatus 
                  state="error" 
                  errorMessage={voiceError}
                  onRetry={() => {
                    clearError()
                    retryVoice()
                  }}
                  className="mt-4"
                />
              )}
              
              {/* Audio player when ready */}
              {audioUrl && lastAssistantMessage && !showVoiceLoading && !showVoiceError && (
                <div className="mt-4">
                  <AudioPlayer 
                    audioUrl={audioUrl}
                    onShare={handleShare}
                    onEnded={() => console.log('[ChatContainer] Audio ended')}
                    onError={(err) => console.error('[ChatContainer] Audio player error:', err)}
                  />
                  
                  {/* Share URL display */}
                  {shareUrl && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm flex items-center gap-2">
                      <span className="text-muted-foreground">Share link:</span>
                      <code className="flex-1 truncate">{shareUrl}</code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Initial loading state */}
          {showLoading && (
            <LoadingIndicator />
          )}
        </div>
      </main>

      {/* Input area - fixed at bottom */}
      <footer className="border-t border-border p-4 bg-card">
        <div className="max-w-3xl mx-auto">
          <InputForm
            onSubmit={handleSubmit}
            input={input}
            setInput={setInput}
            isLoading={isLoading || isGeneratingVoice}
            disabled={isGeneratingVoice}
          />
        </div>
      </footer>
    </div>
  )
}