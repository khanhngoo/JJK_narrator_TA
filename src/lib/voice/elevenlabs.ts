import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

// Singleton client instance
let client: ElevenLabsClient | null = null

export function getElevenLabsClient(): ElevenLabsClient {
  if (!client) {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set in environment')
    }
    client = new ElevenLabsClient()
  }
  return client
}

// Export for convenience
export { getElevenLabsClient as elevenLabsClient }