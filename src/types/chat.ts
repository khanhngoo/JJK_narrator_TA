export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  audioUrl?: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  isGeneratingVoice: boolean
  error: string | null
}

export type ChatStatus = 'idle' | 'submitting' | 'streaming' | 'generating_voice' | 'error'