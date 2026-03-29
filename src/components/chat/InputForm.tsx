'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface InputFormProps {
  onSubmit: (e: React.FormEvent) => void
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function InputForm({ onSubmit, input, setInput, isLoading, disabled }: InputFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !disabled) {
      onSubmit(e)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-center">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... the truth shall be revealed."
          disabled={isLoading || disabled}
          className="flex-1 h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary text-base"
          aria-label="Ask a question"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          aria-label={isLoading ? 'Revealing...' : 'Ask'}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Revealing...
            </>
          ) : (
            'Ask'
          )}
        </Button>
      </div>
    </form>
  )
}