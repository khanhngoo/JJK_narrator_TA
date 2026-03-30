// Fish Speech client for TTS - replaces ElevenLabs
// Connects to your self-hosted Fish Speech server

export interface FishSpeechRequest {
  text: string
  voice?: string
  speed?: number
  temperature?: number
}

export interface FishSpeechResponse {
  audio: Blob
  duration?: number
}

// Your Fish Speech server URL (update this to your server's IP/domain)
const FISH_SPEECH_URL = process.env.FISH_SPEECH_URL || 'http://localhost:8080'

// Default voice name (should match your trained voice)
export const DEFAULT_VOICE = 'jjk_narrator'

export async function generateSpeech(
  text: string,
  options: {
    voice?: string
    speed?: number
    regenerate?: boolean
  } = {}
): Promise<Blob> {
  const { voice = DEFAULT_VOICE, speed = 1.0 } = options

  const response = await fetch(`${FISH_SPEECH_URL}/v1/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice,
      speed,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Fish Speech error: ${response.status} - ${error}`)
  }

  return response.blob()
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${FISH_SPEECH_URL}/health`, {
      method: 'GET',
    })
    return response.ok
  } catch {
    return false
  }
}
