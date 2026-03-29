'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingIndicatorProps {
  text?: string
  subtext?: string
  className?: string
}

export function LoadingIndicator({ 
  text = 'Channeling cursed energy...', 
  subtext = 'The narrator is putting their explanation together.',
  className 
}: LoadingIndicatorProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="relative mb-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
      <div className="text-lg font-medium text-foreground mb-2">
        {text}
      </div>
      {subtext && (
        <div className="text-sm text-muted-foreground">
          {subtext}
        </div>
      )}
    </div>
  )
}

// Variant for voice generation
export function VoiceLoadingIndicator() {
  return (
    <LoadingIndicator 
      text="Preparing narration..."
      subtext="Converting text to voice."
    />
  )
}