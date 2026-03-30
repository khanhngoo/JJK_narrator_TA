// OpenRouter client for LLM - replaces OpenAI
// Uses OpenAI-compatible format, just points to your server

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterChatRequest {
  model: string
  messages: OpenRouterMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface OpenRouterChatResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Your server URL (update this to your server's IP/domain)
const BASE_URL = process.env.OPENROUTER_BASE_URL || 'http://localhost:8080'

// Free model - good for creative writing
export const DEFAULT_MODEL = 'arcee-ai/trinity-large-preview'

export async function chatCompletion(
  messages: OpenRouterMessage[],
  options: {
    stream?: boolean
    model?: string
    temperature?: number
    signal?: AbortSignal
  } = {}
): Promise<Response> {
  const { stream = false, model = DEFAULT_MODEL, temperature = 0.7, signal } = options

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature,
      max_tokens: 2000,
    }),
    signal,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error: ${response.status} - ${error}`)
  }

  return response
}

export function isStreamingResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('text/event-stream')
}
