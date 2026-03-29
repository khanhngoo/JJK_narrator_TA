'use client'

import { Message } from '@/types/chat'
import { Card } from '@/components/ui/card'
import { StreamingText } from './StreamingText'

interface MessageListProps {
  messages: Message[]
  isStreaming?: boolean
  streamingContent?: string
}

export function MessageList({ messages, isStreaming, streamingContent }: MessageListProps) {
  // Get only user and assistant messages (system messages filtered out)
  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  )

  if (visibleMessages.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-xl font-semibold text-foreground mb-2">
          The Void Awaits
        </div>
        <div className="text-muted-foreground max-w-md">
          Ask any question and hear the answer in the voice of the JJK narrator.
          The truth shall be revealed...
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Try: What is Domain Expansion?
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {visibleMessages.map((message, index) => (
        <MessageCard
          key={message.id}
          message={message}
          isLastAssistantMessage={
            message.role === 'assistant' &&
            index === visibleMessages.length - 1
          }
          isStreaming={isStreaming && index === visibleMessages.length - 1 && message.role === 'assistant'}
          streamingContent={streamingContent}
        />
      ))}
      
      {/* Streaming message in progress */}
      {isStreaming && visibleMessages.length === 0 && streamingContent && (
        <MessageCard
          message={{ id: 'streaming', role: 'assistant', content: streamingContent, createdAt: new Date() }}
          isLastAssistantMessage={true}
          isStreaming={true}
        />
      )}
    </div>
  )
}

interface MessageCardProps {
  message: Message
  isLastAssistantMessage?: boolean
  isStreaming?: boolean
  streamingContent?: string
}

function MessageCard({ message, isLastAssistantMessage, isStreaming, streamingContent }: MessageCardProps) {
  const content = isStreaming && isLastAssistantMessage && streamingContent
    ? streamingContent
    : message.content

  return (
    <Card className="p-6 bg-card border-border">
      {message.role === 'user' ? (
        <div className="text-muted-foreground text-sm mb-1">
          Q:
        </div>
      ) : null}
      
      <div className="text-muted-foreground text-sm mb-2">
        {message.role === 'user' ? message.content : null}
      </div>

      {message.role === 'assistant' && (
        <StreamingText
          content={content}
          isStreaming={isStreaming && isLastAssistantMessage}
          className="min-h-[100px]"
        />
      )}
    </Card>
  )
}