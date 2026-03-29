'use client'

import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

type VoiceState = 'generating' | 'ready' | 'error' | 'idle'

interface VoiceStatusProps {
  state: VoiceState
  onRetry?: () => void
  errorMessage?: string
  className?: string
}

export function VoiceStatus({ state, onRetry, errorMessage, className }: VoiceStatusProps) {
  if (state === 'idle') {
    return null
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 text-center', className)}>
      {state === 'generating' && (
        <>
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
          <div className="text-lg font-medium text-foreground mb-1">
            Preparing narration...
          </div>
          <div className="text-sm text-muted-foreground">
            Converting text to voice
          </div>
        </>
      )}

      {state === 'error' && (
        <>
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <div className="text-lg font-medium text-foreground mb-1">
            A barrier appeared...
          </div>
          <div className="text-sm text-muted-foreground mb-4 max-w-md">
            {errorMessage || 'Something interrupted the voice transmission. The explanation is available as text.'}
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2"
              aria-label="Retry voice generation"
            >
              <RefreshCw className="h-4 w-4" />
              Listen
            </Button>
          )}
        </>
      )}

      {state === 'ready' && (
        <div className="text-sm text-muted-foreground">
          Narration ready
        </div>
      )}
    </div>
  )
}

// Error messages per CONTEXT.md D-04
export const VOICE_ERROR_MESSAGES = {
  generation_failed: 'Something interrupted the voice transmission. The explanation is available as text.',
  network_error: 'A barrier is blocking the connection. Check your internet and try again.',
  quota_exceeded: 'Voice service busy. Please try again in a moment.',
  unknown: 'Could not generate voice. Text is available above.',
}