'use client'

import { useJJKChat } from '@/hooks/useJJKChat'
import { InputForm } from './InputForm'
import { MessageList } from './MessageList'
import { LoadingIndicator } from './LoadingIndicator'
import type { Message } from '@/types/chat'

export function ChatContainer() {
  const { messages, input, setInput, handleSubmit, isLoading, status } = useJJKChat({
    onError: (error) => {
      console.error('[ChatContainer] Chat error:', error)
    },
    onVoiceError: (error) => {
      console.error('[ChatContainer] Voice error:', error)
    },
  })

  // Determine what to show in the main area
  const showLoading = status === 'submitting'
  const showEmpty = !showLoading && messages.length === 0

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
          {showEmpty && (
            <MessageList messages={[]} />
          )}
          
          {!showEmpty && !showLoading && (
            <MessageList 
              messages={messages as Message[]}
              isStreaming={status === 'streaming'}
            />
          )}

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
            isLoading={isLoading}
          />
        </div>
      </footer>
    </div>
  )
}