import { openai } from '@ai-sdk/openai'

// Use gpt-4o-mini for faster responses during development
// Switch to gpt-4o for production
export const model = openai('gpt-4o-mini')

export const MODEL_CONFIG = {
  // Lower temperature for more consistent dramatic style
  temperature: 0.7,
  // Reasonable max tokens for explanations
  maxTokens: 2000,
}