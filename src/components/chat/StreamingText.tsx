'use client'

import { cn } from '@/lib/utils'

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
  className?: string
}

export function StreamingText({ content, isStreaming, className }: StreamingTextProps) {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-none',
        'text-foreground leading-[1.7] tracking-[0.01em]',
        'text-base', // 16px
        className
      )}
    >
      {content}
      {isStreaming && (
        <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse" aria-hidden="true">
          ▊
        </span>
      )}
    </div>
  )
}