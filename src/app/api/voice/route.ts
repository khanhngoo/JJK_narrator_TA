// Fish Speech TTS - replaces ElevenLabs
// Connects to your self-hosted Fish Speech server

import { NextRequest, NextResponse } from 'next/server'
import { getCachedAudio, setCachedAudio } from '@/lib/voice/cache'

export const maxDuration = 60

const FISH_SPEECH_URL = process.env.FISH_SPEECH_URL || 'http://localhost:8080'
const DEFAULT_VOICE = process.env.FISH_SPEECH_VOICE || 'jjk_narrator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, regenerate = false, voice = DEFAULT_VOICE } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 10000 characters.' },
        { status: 400 }
      )
    }

    // Check cache first (unless regenerating)
    if (!regenerate) {
      const cachedUrl = getCachedAudio(text)
      if (cachedUrl) {
        return NextResponse.json({ audioUrl: cachedUrl, cached: true })
      }
    }

    console.log('[Voice API] Generating audio via Fish Speech:', {
      textLength: text.length,
      voice,
      server: FISH_SPEECH_URL
    })

    // Call Fish Speech API
    const response = await fetch(`${FISH_SPEECH_URL}/v1/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
        speed: 1.0,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Voice API] Fish Speech error:', error)
      throw new Error(`Fish Speech API error: ${response.status}`)
    }

    // Get audio as blob
    const audioBlob = await response.blob()

    // Create blob URL for client
    const audioUrl = setCachedAudio(text, audioBlob)

    console.log('[Voice API] Audio generated successfully. Size:', audioBlob.size, 'bytes')

    return NextResponse.json({
      audioUrl,
      cached: false,
      duration: null,
    })
  } catch (error) {
    console.error('[Voice API] Error:', error)

    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('NetworkError')) {
        return NextResponse.json(
          { error: 'TTS server not reachable. Please check FISH_SPEECH_URL configuration.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate voice. Please try again.' },
      { status: 500 }
    )
  }
}
